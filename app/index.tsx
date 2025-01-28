import React, { useEffect, useState } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import { StyleSheet, Text, View } from 'react-native';
import { RelativePathString, useRouter } from 'expo-router';
import { useSearchParams } from 'expo-router/build/hooks';

interface MarkerData {
  id: string; // Уникальный идентификатор
  latitude: number;
  longitude: number;
  images: string[]; // Массив URI изображений
}

export default function App() {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const INITIAL_REGION: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } = {
    latitude: 58,
    longitude: 56.19,
    latitudeDelta: 2,
    longitudeDelta: 2,
  };
  
  useEffect(() => {
    const updatedMarkerJson = searchParams.get("updatedMarker"); 
    if (updatedMarkerJson) {
      try {      
        const updatedMarker = JSON.parse(updatedMarkerJson);
        
        setMarkers((prevMarkers) =>
          prevMarkers.map((m) =>
            m.id === String(updatedMarker.id)
              ? { ...m, images: updatedMarker.images }
              : m
          )
        );
      } catch (error) {
        console.error("Failed to parse updatedMarker:", error);
      }
    } 
  }, [searchParams.get("updatedMarker")]);

  const handleLongPress = (e: any) => {
    const newMarker: MarkerData = {
      id: Date.now().toString(), // Генерация уникального идентификатора
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
      images: [], // Пока без изображений
    };
    setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
  };


const handleMarkerPress = (id: string) => {
  const marker = markers.find((m) => m.id === id);
  if (marker) {
    router.push({
      pathname: `/markerPages/${id}` as RelativePathString,
      params: {
        marker: JSON.stringify(marker),
      },
    });
  }
};

  return (
    <View style={styles.container}>
      <Text>Удерживайте для добавления маркера на карту.</Text>
      <Text>Нажмите на маркер, чтобы открыть окно маркера.</Text>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_REGION}
        onLongPress={handleLongPress}
      >      
        {markers.map((marker, index) => (
            <Marker
            key={marker.id}
            coordinate={marker}
            title={`Marker ${index + 1}`}
            onPress={() => handleMarkerPress(marker.id)}           
          />       
        ))}
      </MapView>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },

});