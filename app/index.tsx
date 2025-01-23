import React, { useState } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import { StyleSheet, View } from 'react-native';

interface Coordinate {
  latitude: number;
  longitude: number;
}

export default function App() {
  const [markers, setMarkers] = useState<Coordinate[]>([]);

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

  const handlePress = (e: any) => {
    setMarkers([...markers, e.nativeEvent.coordinate]);
  };
   

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_REGION}
        onLongPress={handlePress}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker}
            title={`Marker ${index + 1}`}
            description={`Latitude: ${marker.latitude}, Longitude: ${marker.longitude}`}
            // onPress={DeleteMarker}
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