import React, { useEffect, useState, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Image,
  Text,
  Alert, 
  Animated,
  FlatList,
  Linking,
  ScrollView,
  TouchableOpacity 
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MaterialIcons } from '@expo/vector-icons'; 
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColor } from '@/hooks/useThemeColor';
import { User, logout } from '@/services/apiAuth';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSosData } from '@/services/apiGetSos'; 
import { getLatestData } from '@/services/apiMSos';

export default function Home() {
  interface SosData {
    lat: string;
    lng: string;
    group_staff_fishermans_id: number;
    staff_nm: string;
  }

  interface MachineData {
    lat: string;
    lng: string;
    host_id: number;
    machine_name: number; 
  }

  const [loading, setLoading] = useState(true);
  const [user, setUser ] = useState<User | null>(null);
  const [sosData, setSosData] = useState<SosData[]>([]); 
  const [latestData, setLatestData] = useState<MachineData[]>([]);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const animatedStyle = {
    transform: [{ rotate: rotateInterpolate }],
  };

  const backgroundColor = useThemeColor({}, 'background');
  
  useEffect(() => {
    const loadUser  = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          setUser (JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false); 
      }
    };

    loadUser ();
  }, []);

  useEffect(() => {
    const fetchSosData = async () => {
      if (user) {
        try {
          const response = await getSosData(user.id.toString()); // Fetch SOS data using user ID
          if (response.success) {
            setSosData(response.data); 
          } else {
            Alert.alert('Error', response.message);
          }
        } catch (error) {
          Alert.alert('Error', 'Unable to retrieve data');
        }
      }
    };

    fetchSosData();
  }, [user]);

  useEffect(() => {
    const fetchLatestData = async () => {
      if (user) {
        try {
          const data = await getLatestData(); 
          setLatestData(data); 
        } catch (error) {
          Alert.alert('Error', 'No data from machine');
        }
      }
    };

    fetchLatestData();
  }, [user]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      await logout();
      
      Alert.alert("Hore", "Kamu berhasil Keluar.", [
        {
          text: "OK",
          onPress: () => {
            router.replace('/login');
          },
        },
      ]);
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Logout Failed", "An error occurred while logging out.");
    }
  };

  const openMaps = (lat: string, lng: string) => {
    const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    Linking.openURL(mapUrl).catch(err => console.error("An error occurred", err));
  };

  const renderItemSos = ({ item }: { item: SosData }) => (
    <TouchableOpacity onPress={() => openMaps(item.lat, item.lng)}>
      <ThemedView 
        style={backgroundColor === '#fff' ? styles.emergencyContLight : styles.emergencyCont}
      >
        <ThemedView 
          style={backgroundColor === '#fff' ? styles.emergencyItemLight : styles.emergencyItem}
        >
          <ThemedText style={styles.emergencyTitle}>{item.staff_nm}</ThemedText>
          <ThemedText style={styles.emergencyDescription}>Lat: {item.lat}, Lng: {item.lng}</ThemedText>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );
  
  const renderItemMachine = ({ item }: { item: MachineData }) => (
    <TouchableOpacity onPress={() => openMaps(item.lat, item.lng)}>
      <ThemedView 
        style={backgroundColor === '#fff' ? styles.emergencyContLight : styles.emergencyCont}
      >
        <ThemedView 
          style={backgroundColor === '#fff' ? styles.emergencyItemLight : styles.emergencyItem}
        >
          <ThemedText style={styles.emergencyTitle}>Machine: {item.machine_name}</ThemedText>
          <ThemedText style={styles.emergencyDescription}>Lat: {item.lat}, Lng: {item.lng}</ThemedText>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ThemedText>Loading...</ThemedText>
      </View>
    );
  }

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
                <ThemedText style={styles.headerText} type="subtitle">Hi, {user ? user.name : 'Guest'}</ThemedText>
                <ThemedText style={styles.headerText} type="kicker">Kelompok Nelayan {user ? user.group_name : 'Please log in'}</ThemedText>
              </View>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
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
                    25 januari 2025
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
          <ScrollView showsVerticalScrollIndicator={false}>
            <ThemedText type='subtitle'>DARURAT</ThemedText>

            <FlatList
              data={sosData} 
              keyExtractor={(item, index) => `${item.group_staff_fishermans_id}-${index}`}
              renderItem={renderItemSos} 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.emergencyList}
              scrollEnabled={false}
            />

            <ThemedText type='subtitle'>MACHINE DATA</ThemedText>

            <FlatList
              data={latestData} 
              keyExtractor={(item, index) => `${item.host_id}-${index}`}
              renderItem={renderItemMachine} 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.emergencyList}
              scrollEnabled={false}
            />
          </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: 'rgba(255, 166, 166, 0.3)',
    borderRadius: 15,
    padding: 15,
    marginVertical: 8,
    width: '100%',
  },
  emergencyItemLight: {
    backgroundColor: 'rgba(255, 0, 0, 0.46)',
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