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
            aspect: [1, 1],
            quality: 1,
            allowsMultipleSelection: true,
        });

        if (!result.canceled) {
          try {
            const newUris = await Promise.all( 
            // URI, полученные от ImagePicker, не читаются при перезаходе,
            // поэтому используем хранилище изображений, куда добавляем изображения по их URI
              result.assets.map(async (asset) => {
                const assetUri = asset.uri;
                const fileName = assetUri.split("/").pop(); 
                const newUri = `${FileSystem.cacheDirectory}${fileName}`; 
      
                // Перемещаем файл в хранилище
                await FileSystem.moveAsync({
                  from: assetUri,
                  to: newUri,
                });

                return newUri; 
              })
            );
      
            // Обновляем состояние с добавлением всех новых URI
            setLocalImages((prev) => [...prev, ...newUris]);
    
          } catch (error) {
            console.error("Failed to move files:", error);
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
        <View style={styles.buttonContainer}>
        <Button title="Добавить изображения" onPress={handleAddImage} />
        <Button title="Сохранить изображения" onPress={handleSave} />
        </View>
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
      margin: 2,
      aspectRatio: 1, // Квадратные изображения
      gap: 5,
      width: 100,
      height: 100,
    },
    image: {
      flex: 1,
    },
    buttonContainer: {
      gap: 5,
    },
  });