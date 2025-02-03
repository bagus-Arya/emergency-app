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
import { getMachinesData, MachineData } from '@/services/apiGetMLogs'; 
import { postUserSosData, UserSosRequest } from '@/services/apiUserSos'; 

const { width, height } = Dimensions.get('window');

const LeafletMap = () => {
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null); 
  const [machines, setMachines] = useState<MachineData[]>([]);

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
          group_staff_fishermans_id: user.group_id, 
        };

        const response = await postUserSosData(sosData, user.id.toString());
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

  useEffect(() => {
    const fetchMachinesData = async () => {
      try {
        const response = await getMachinesData();
        setMachines(response.data);
      } catch (error : any) {
        Alert.alert('Error', error.message);
      }
    };

    fetchMachinesData();
  }, []);

  const colors = ['#FF5733', '#33FF57', '#3357FF', '#F1C40F', '#8E44AD', '#E74C3C', '#3498DB']; 

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

          L.tileLayer(' https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(map);

          var marker = L.marker([${location.coords.latitude}, ${location.coords.longitude}]).addTo(map)
            .bindPopup('${userName ? userName : "You are here!"}')
            .openPopup();

          const machines = ${JSON.stringify(machines)};
          const colors = ${JSON.stringify(colors)};
          machines.forEach((machine, index) => {
            const color = colors[index % colors.length]; 
            const machineMarker = L.marker([machine.lat, machine.lng], {
              radius: 8,
              fillColor: color,
              color: color,
              fillOpacity: 1,
              stroke: false
            }).addTo(map)
              .bindPopup('Machine ID: ' + machine.id);
          });
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#ff5722',
    borderRadius: 50,
    padding: 15,
  },
});

export default LeafletMap;