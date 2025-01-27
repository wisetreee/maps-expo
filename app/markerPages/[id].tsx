import { useSearchParams } from "expo-router/build/hooks";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Text, View, StyleSheet, Button, FlatList} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Image } from "expo-image";
import * as FileSystem from "expo-file-system";

export default function MarkerPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const markerJson  = searchParams.get('marker');
    const marker = markerJson? JSON.parse(markerJson) : null;
    const [localImages, setLocalImages] = useState<string[]>(
        Array.isArray(marker?.images) ? marker.images : []
      );

    const handleAddImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
          const assetUri = result.assets[0].uri;
          const fileName = assetUri.split("/").pop(); // Имя файла
          const newUri = `${FileSystem.cacheDirectory}${fileName}`; // Постоянный путь
      
          try {
            await FileSystem.moveAsync({
              from: assetUri,
              to: newUri,
            });
      
            setLocalImages((prev) => [...prev, newUri]);
          } catch (error) {
            console.error("Failed to move file:", error);
          }
        }
      };

      const handleSave = () => {
          const updatedMarker = {
            id: marker.id,
            latitude: marker.latitude,
            longitude: marker.longitude,
            images: localImages,
          };
              
          // Возвращаемся к предыдущей странице
          router.back();            
          router.setParams({ updatedMarker: JSON.stringify(updatedMarker)})
      };

    if (!marker) return (<Text>Marker not found</Text>);
  
    return (
      <View style={styles.container}>   
        {/* Рендерим изображения из localImages */}
         <FlatList
          data={localImages} // Используем localImages
          keyExtractor={(index) => index.toString()}
          numColumns={3} // Количество столбцов
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Image source={{ uri: item }} style={styles.image} />
            </View>
          )}
        /> 
        <Button title="Add Image" onPress={handleAddImage} />
        <Button title="Save" onPress={handleSave} />
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#FFFFFF",
      alignItems: "center",
    },
    imageContainer: {
      margin: 5,
      aspectRatio: 1, // Квадратные изображения
      borderRadius: 10,
    },
    image: {
      width: 100,
      height: 100,
    },
    button: {
      marginBottom: 5,
      fontSize: 20,
      textDecorationLine: "underline",
      color: "#fff",
    },
  });