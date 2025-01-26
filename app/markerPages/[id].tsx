import { useSearchParams } from "expo-router/build/hooks";
import { useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import { Text, View, StyleSheet, Button, FlatList} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Image } from "react-native";

export default function MarkerPage() {
    const navigation = useNavigation();
    const router = useRouter();
    const searchParams = useSearchParams();
    const markerJson  = searchParams.get('marker');
    const marker = markerJson? JSON.parse(markerJson) : null;
    console.log(`Marker: ${marker}`);
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
          setLocalImages((prev) => [...prev, result.assets[0].uri]);
          console.log("Added Image:", result.assets[0].uri);
          console.log("Updated Local Images:", [...localImages, result.assets[0].uri]);
        }
      };

      const handleSave = () => {
        const updatedMarker = {
          id: marker.id,
          latitude: marker.latitude,
          longitude: marker.longitude,
          images: localImages,
        };
        
        console.log("Saving Marker:", {
            id: marker.id,
            latitude: marker.latitude,
            longitude: marker.longitude,
            images: localImages,
        });
        console.log("Replace Params:", {
            pathname: "/",
            params: { updatedMarker: JSON.stringify(updatedMarker) },
        });
        navigation.navigate('index', {params: JSON.stringify(updatedMarker)});
        // Возврат с обновлением данных в родителе
        //  router.navigate({
        //      pathname: "/",
        //      params: {
        //          updatedMarker: JSON.stringify(updatedMarker),
        //      },
        //  });
      
        //  console.log("Calling router.back()");
        //  router.back();
      };

    if (!marker) return (<Text>Marker not found</Text>);
  
    return (
      <View style={styles.container}>
        <Text>Latitude: {marker.latitude}</Text>
        <Text>Longitude: {marker.longitude}</Text>

         <FlatList
                data={marker.images}
                keyExtractor={(item, index) => index.toString()}
                numColumns={3} // Количество столбцов
                renderItem={({ item }) => (
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: item  }} style={styles.image} />
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
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
    },
    imageContainer: {
        flex: 1,
        margin: 5,
        aspectRatio: 1, // Квадратные изображения
        borderRadius: 10,
      },
    image: {
      width: 320,
      height: 440,
      borderRadius: 18,
    },
    button: {
      fontSize: 20,
      textDecorationLine: 'underline',
      color: '#fff',
    },
    
  });