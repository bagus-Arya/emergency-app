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
  FlatList,
  TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MaterialIcons } from '@expo/vector-icons'; 
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { useThemeColor } from '@/hooks/useThemeColor';

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

  const emergencyContacts: ListItem[] = [
    { id: '1', title: 'Emergency Services', description: 'Call 112' },
    { id: '2', title: 'Local Police', description: 'Call 110' },
    { id: '3', title: 'Fire Department', description: 'Call 113' },
    { id: '4', title: 'Ambulance', description: 'Call 118' },
    { id: '5', title: 'Ambulance', description: 'Call 118' },
    { id: '6', title: 'Ambulance', description: 'Call 118' },
    { id: '7', title: 'Ambulance', description: 'Call 118' },
    { id: '8', title: 'Ambulance', description: 'Call 118' },
    { id: '9', title: 'Ambulance', description: 'Call 118' },
    { id: '10', title: 'Ambulance', description: 'Call 118' },
  ];

  // Interpolate the rotation value
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const animatedStyle = {
    transform: [{ rotate: rotateInterpolate }],
  };

  const backgroundColor = useThemeColor({}, 'background');

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
                <View style={styles.statusContainer}>
                  <View style={styles.statusIndicator} />
                  <Text style={styles.statusText}>Machine Active</Text>
                </View>
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

        <ThemedView style={styles.sosContainer}>
          <ThemedText type='subtitle'>DARURAT</ThemedText>
          <FlatList
            data={emergencyContacts}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <ThemedView 
              style={backgroundColor === '#fff' ? styles.emergencyContLight : styles.emergencyCont}
              >
                <ThemedView 
                style={backgroundColor === '#fff' ? styles.emergencyItemLight : styles.emergencyItem}
                >
                  <ThemedText style={styles.emergencyTitle}>{item.title}</ThemedText>
                  <ThemedText style={styles.emergencyDescription}>{item.description}</ThemedText>
                </ThemedView>
              </ThemedView>
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.emergencyList}
          />
        </ThemedView>

      </ThemedView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  headerContainer: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  gradient: {
    padding: 20,
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 35
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
  rowReload: {
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
  emergencyList: {
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  emergencyItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 15,
    padding: 15,
    marginVertical: 8,
    width: '100%',
  },
  emergencyItemLight: {
    backgroundColor: 'rgba(0, 119, 255, 0.15)',
    borderRadius: 15,
    padding: 15,
    width: '100%',
  },  
  emergencyCont: {
    borderRadius: 15,
    width: '100%',
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  emergencyContLight: {
    borderRadius: 15,
    width: '100%',
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },  
  emergencyTitle: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 5,
  },
  emergencyDescription: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },  
  sosContainer: {
    flex: 1,
    padding: 20,
  }
});