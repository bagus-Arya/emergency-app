import React, { useEffect, useState, useRef } from 'react';
import { 
  StyleSheet, 
  Alert, 
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  View
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { MaterialIcons } from '@expo/vector-icons'; 
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

export default function Home() {
  const mapRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [region, setRegion] = useState({
    latitude: -6.200000,  
    longitude: 106.816666,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const sendData = () => {
    if (location) {
      const lat = location.coords.latitude;
      const lng = location.coords.longitude;
      console.log("Sending SOS with location:", lat +`, `+ lng);
      Alert.alert("Success sending location:", lat +`, `+ lng);
    } else {
      console.log("Location not available");
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      
      // Update region when location is obtained
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setLoading(false);
    })();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        {loading ? (
          <ThemedView style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </ThemedView>
        ) : (
          <MapView
            ref={mapRef}
            style={styles.map}
            showsUserLocation={false}
            region={region}
            onRegionChangeComplete={setRegion}
          >
            {location && (
              <>
                <Marker
                  coordinate={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
                  }}
                  title="Your Location"
                  description="You are here"
                  pinColor="#CD1C18"
                />
               
              </>
            )}
          </MapView>
        )}
        {/* Floating Action Button */}
        <TouchableOpacity 
          style={styles.floatingButton} 
          onPress={sendData}
        >
          <MaterialIcons name="warning" size={35} color="#fff" />
        </TouchableOpacity>
      </ThemedView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  floatingButton: {
    position: 'absolute',
    bottom: height * 0.05, 
    right: width * 0.09, 
    backgroundColor: '#ff0000',
    width: width * 0.18, 
    height: width * 0.18, 
    borderRadius: (width * 0.18) / 2, 
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});