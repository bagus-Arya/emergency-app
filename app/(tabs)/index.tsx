import React, { useEffect, useState, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Image,
  Linking, 
  Alert, 
  Dimensions,
  TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MaterialIcons } from '@expo/vector-icons'; 
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import MapView, {Marker, Polyline} from 'react-native-maps';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

export default function Home() {
  interface ListItem {
    id: string;
    title: string;
    description: string;
  }

  const mapRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sample data for the image map simulation
  const imageMapData: ListItem[] = [
    { id: '1', title: 'Location 1', description: 'Description for Location 1' },
    { id: '2', title: 'Location 2', description: 'Description for Location 2' },
    { id: '3', title: 'Location 3', description: 'Description for Location 3' },
  ];

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const handleSOSPress = () => {
    if (location) {
      const lat = location.coords.latitude;
      const lng = location.coords.longitude;
      const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;
      Linking.openURL(mapUrl).catch(err => console.error("An error occurred", err));
    } else {
      console.log("Location not available");
    }
  };

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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.headerContainer}>
          <LinearGradient
            colors={['#38b6ff', '#1E90FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <View style={styles.welcomeHeader}>
              <ThemedText style={styles.headerText} type="subtitle">Hi, heo</ThemedText>
              <TouchableOpacity style={styles.logoutButton}>
                <MaterialIcons name='logout' size={30} color="#fff" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </ThemedView>

        {/* Image Map Simulation */}
        <View style={styles.imageMapContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/600x800.png?text=Your+Image+Map' }} // Replace with your image URL
            style={styles.imageMap}
          />
          {imageMapData.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[styles.mapArea, { top: `${Math.random() * 80}%`, left: `${Math.random() * 80}%` }]} // Random positioning for demo
              onPress={() => alert(item.description)}
            >
              <ThemedText style={styles.mapAreaText}>{item.title}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Floating Action Button */}
        <TouchableOpacity 
          style={styles.floatingButton} 
          onPress={sendData}
        >
          <MaterialIcons name="warning" size={24} color="#fff" />
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
  headerContainer: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  gradient: {
    padding: 20,
    paddingTop: 40,
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 15,
  },
  imageMapContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    flex: 1, 
  },
  imageMap: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    borderRadius: 15,
  },
  mapArea: {
    position: 'absolute',
    padding: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 5,
  },
  mapAreaText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  floatingButton : {
    position: 'absolute',
    bottom: height * 0.05, 
    right: width * 0.05, 
    backgroundColor: '#ff0000',
    width: width * 0.15, 
    height: width * 0.15, 
    borderRadius: (width * 0.15) / 2, 
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});