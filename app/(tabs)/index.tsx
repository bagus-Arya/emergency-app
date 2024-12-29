import React, { useEffect, useState, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Image,
  Text,
  Linking, 
  Alert, 
  Animated,
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
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Sample data for the image map simulation
  const imageMapData: ListItem[] = [
    { id: '1', title: 'Location 1', description: 'Description for Location 1' },
    { id: '2', title: 'Location 2', description: 'Description for Location 2' },
    { id: '3', title: 'Location 3', description: 'Description for Location 3' },
  ];

  // Interpolate the rotation value
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const animatedStyle = {
    transform: [{ rotate: rotateInterpolate }],
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
            <View>
              <ThemedText style={styles.headerText} type="subtitle">Hi, heo</ThemedText>
              <ThemedText style={styles.headerText} type="kicker">Kelompok nelayan Wisnu Rejeki</ThemedText>
            </View>
            <TouchableOpacity style={styles.logoutButton}>
              <MaterialIcons name='logout' size={30} color="#fff" />
            </TouchableOpacity>
          </View>
              <View style={styles.weatherContainerRoot}>   
                <LinearGradient
                  colors={['#38b6ff', '#1E90FF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradient}
                >
              <View style={styles.rowReload}>
                <Text style={styles.condition}>
                  20 des 2024
                </Text> 
                <TouchableOpacity>
                  <Animated.View style={animatedStyle}>
                    <MaterialIcons name='loop' size={20} color="#fff" />
                  </Animated.View>
                </TouchableOpacity>
              </View>
  
              <View style={styles.weatherContainer}>  
                {/* Weather Details */}
                <View style={styles.weatherRow}>
                  <View style={styles.weatherDetailContainer}>
                    <Image 
                      source={require('@/assets/icon/Raining.png')} 
                      style={styles.iconSmall} 
                      resizeMode="contain" 
                    />
                    <ThemedText style={styles.weatherText}>Hujan</ThemedText>
                    <ThemedText style={styles.weatherDetail}>20 °C</ThemedText>
                  </View>
                  <View style={styles.weatherDetailContainer}>
                    <Image 
                      source={require('@/assets/icon/angin-icon.png')} 
                      style={styles.iconSmall} 
                      resizeMode="contain" 
                    />
                    <ThemedText style={styles.weatherText}>Kencang</ThemedText>
                    <ThemedText style={styles.weatherDetail}>50 km/h</ThemedText>
                  </View>
                  <View style={styles.weatherDetailContainer}>
                    <Image 
                      source={require('@/assets/icon/kelembaban-icon.png')} 
                      style={styles.iconSmall} 
                      resizeMode="contain" 
                    />
                    <ThemedText style={styles.weatherText}>Lembab</ThemedText>
                    <ThemedText style={styles.weatherDetail}>30 %</ThemedText>
                  </View>
                  <View style={styles.weatherDetailContainer}>
                    <Image 
                      source={require('@/assets/icon/tekananudara-icon.png')} 
                      style={styles.iconSmall} 
                      resizeMode="contain" 
                    />
                    <ThemedText style={styles.weatherText}>Sedang</ThemedText>
                    <ThemedText style={styles.weatherDetail}>500 mBar</ThemedText>
                  </View>
                </View>
                </View>
              </LinearGradient>
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
    right: width * 0.09, 
    backgroundColor: '#ff0000',
    width: width * 0.18, 
    height: width * 0.18, 
    borderRadius: (width * 0.15) / 2, 
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  iconSmall:{
    width: 25,
    height: 25,
    marginBottom: 10,
  },
  weatherRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  reloadRow:{
    flexDirection: 'row',
    justifyContent: 'center',
  },
  weatherContainerRoot: {
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  weatherContainer:{
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  weatherDetailContainer: {
    alignItems: 'center',
  },
  weatherDetail: {
    color: '#FFFFFF',
    fontSize: 15,
    textAlign: 'center',
  },
  weatherText: {
    color: '#FFFFFF',
    fontSize: 11,
    textAlign: 'center',
  },
  condition: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  rowReload: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});