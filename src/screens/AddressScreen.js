import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Colors } from '../constants';
import * as Location from 'expo-location';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { AuthenticationService } from '../services';

const AddressScreen = ({ route, navigation }) => {
  const { currentAddress, onAddressChange } = route.params;
  const [addresses, setAddresses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    const response = await AuthenticationService.getAddresses();
    if (response.status) {
      setAddresses(response.data);
    }
  };

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Allow location access to auto-detect your address');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    let [place] = await Location.reverseGeocodeAsync(location.coords);
    
    if (place) {
      const newAddress = place.formattedAddress || place.district || place.city || 'Current Location';
      onAddressChange(newAddress);
      navigation.goBack();
    }
  };

  const handleSearch = () => {
    // Navigate to a new screen for address search and selection
    navigation.navigate('AddressSearch', { onAddressSelect: handleAddNewAddress });
  };

  const handleAddNewAddress = async (newAddress) => {
    // Here you would typically make an API call to add the new address
    // For now, we'll just add it to the local state
    const updatedAddresses = [...addresses, { id: Date.now(), address: newAddress, type: 'Other' }];
    setAddresses(updatedAddresses);
    onAddressChange(newAddress);
    navigation.goBack();
  };

  const renderAddressItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.addressItem} 
      onPress={() => {
        onAddressChange(item.address);
        navigation.goBack();
      }}
    >
      <View style={styles.addressIcon}>
        <Ionicons name={item.type === 'Home' ? 'home-outline' : 'briefcase-outline'} size={24} color={Colors.DEFAULT_GREY} />
      </View>
      <View style={styles.addressDetails}>
        <Text style={styles.addressType}>{item.type}</Text>
        <Text style={styles.addressText} numberOfLines={2}>{item.address}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.DEFAULT_WHITE} barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.DEFAULT_BLACK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select a delivery address</Text>
      </View>
      <TouchableOpacity style={styles.searchBar} onPress={handleSearch}>
        <Ionicons name="search-outline" size={20} color={Colors.DEFAULT_GREY} />
        <Text style={styles.searchText}>Search for area, street name...</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton} onPress={getCurrentLocation}>
        <MaterialIcons name="my-location" size={24} color={Colors.DEFAULT_GREEN} />
        <Text style={styles.optionText}>Use current location</Text>
        <Ionicons name="chevron-forward" size={24} color={Colors.DEFAULT_GREY} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('AddNewAddress', { onAddressAdd: handleAddNewAddress })}>
        <Ionicons name="add-circle-outline" size={24} color={Colors.DEFAULT_GREEN} />
        <Text style={styles.optionText}>Add Address</Text>
        <Ionicons name="chevron-forward" size={24} color={Colors.DEFAULT_GREY} />
      </TouchableOpacity>
      <View style={styles.savedAddressesHeader}>
        <Text style={styles.savedAddressesTitle}>SAVED ADDRESSES</Text>
      </View>
      <FlatList
        data={addresses}
        renderItem={renderAddressItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.DEFAULT_WHITE,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LIGHT_GREY2,
  },
  headerTitle: {
    marginLeft: 16,
    fontSize: 18,
    fontFamily: 'Poppins Semi Bold',
    color: Colors.DEFAULT_BLACK,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    margin: 16,
    backgroundColor: Colors.LIGHT_GREY2,
    borderRadius: 8,
  },
  searchText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Poppins Regular',
    color: Colors.DEFAULT_GREY,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LIGHT_GREY2,
  },
  optionText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    fontFamily: 'Poppins Medium',
    color: Colors.DEFAULT_BLACK,
  },
  savedAddressesHeader: {
    padding: 16,
    backgroundColor: Colors.LIGHT_GREY2,
  },
  savedAddressesTitle: {
    fontSize: 14,
    fontFamily: 'Poppins Semi Bold',
    color: Colors.DEFAULT_GREY,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LIGHT_GREY2,
  },
  addressIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.LIGHT_GREY2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressDetails: {
    flex: 1,
    marginLeft: 16,
  },
  addressType: {
    fontSize: 16,
    fontFamily: 'Poppins Semi Bold',
    color: Colors.DEFAULT_BLACK,
  },
  addressText: {
    fontSize: 14,
    fontFamily: 'Poppins Regular',
    color: Colors.DEFAULT_GREY,
  },
});

export default AddressScreen;