import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Alert, 
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  View
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { postUserSosData, UserSosRequest } from '@/services/apiUserSos'; 

const { width, height } = Dimensions.get('window');

const LeafletMap = () => {
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null); // State for user name

  const sendData = async () => {
    if (location) {
      const lat = location.coords.latitude;
      const lng = location.coords.longitude;

      try {
        const userData = await AsyncStorage.getItem('userData');
        if (!userData) {
          Alert.alert('Error', 'User  data not found. Please log in again.');
          return;
        }

        const user = JSON.parse(userData);
        const sosData: UserSosRequest = {
          lat,
          lng,
          group_staff_fishermans_id: user.group_id, // Assuming group_id is part of user data
        };

        const response = await postUserSosData(sosData, user.id.toString()); // Ensure user.id is a string
        Alert.alert('Success', response.message);
      } catch (error) {
        Alert.alert('Error', 'Unable to retrieve data');
      }
    } else {
      console.log("Location not available");
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        Alert.alert("Permission", "Denied.", [
          {
            text: "OK",
          },
        ]);
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    const loadUserName = async () => {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        setUserName(user.name); 
      }
    };

    loadUserName();
  }, []);

  const htmlContent = location ? `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Leaflet Map</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
        <style>
          #map {
            width: 100%;
            height: 100vh;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
        <script>
          var map = L.map('map').setView([${location.coords.latitude}, ${location.coords.longitude}], 13);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(map);

          var marker = L.marker([${location.coords.latitude}, ${location.coords.longitude}]).addTo(map)
            .bindPopup('${userName ? userName : "You are here!"}')
            .openPopup();
        </script>
      </body>
    </html>
  ` : '';

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
      ) : (
        <WebView
          originWhitelist={['*']}
          source={{ html: htmlContent }}
          style={{ width, height: height - 80 }} // Adjust height to leave space for the button
        />
      )}
      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.floatingButton} 
        onPress={sendData}
      >
        <MaterialIcons name="warning" size={35} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingIndicator: {
    position: 'absolute',
    top: height / 2 - 20,
    left: width / 2 - 20,
  },
  floatingButton: {
    position: 'absolute',
    bottom: height * 0.05, 
    right: width * 0.05, 
    backgroundColor: '#ff0000',
    width: width * 0.18, 
    height: width * 0.18, 
    borderRadius: (width * 0.18) / 2, 
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default LeafletMap;