import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Colors } from '../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AuthenticationService from '../services/AuthenticationService';

const AddNewAddressScreen = ({ navigation }) => {
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [stateId, setStateId] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [states, setStates] = useState([]);

  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      const response = await AuthenticationService.getStates();
      if (response.status) {
        setStates(response.data);
      }
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  const handleAddAddress = async () => {
    if (!addressLine1 || !city || !stateId || !postalCode) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const addressData = {
      address_line1: addressLine1,
      address_line2: addressLine2,
      city,
      state_id: stateId,
      country: 'India',
      postal_code: postalCode,
      is_default: isDefault,
    };

    try {
      const response = await AuthenticationService.addAddress(addressData);
      if (response.status) {
        Alert.alert('Success', 'Address added successfully');
        navigation.goBack();
      } else {
        Alert.alert('Error', response.message || 'Failed to add address');
      }
    } catch (error) {
      console.error('Error adding address:', error);
      Alert.alert('Error', 'An error occurred while adding the address');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={Colors.DEFAULT_WHITE} barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.DEFAULT_BLACK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Address</Text>
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Address Line 1 *</Text>
          <TextInput
            style={styles.input}
            value={addressLine1}
            onChangeText={setAddressLine1}
            placeholder="Enter your address"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Address Line 2</Text>
          <TextInput
            style={styles.input}
            value={addressLine2}
            onChangeText={setAddressLine2}
            placeholder="Apartment, suite, etc. (optional)"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>City *</Text>
          <TextInput
            style={styles.input}
            value={city}
            onChangeText={setCity}
            placeholder="Enter city name"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>State *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={stateId}
              onValueChange={(itemValue) => setStateId(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select State" value="" />
              {states.map((state) => (
                <Picker.Item key={state.id} label={state.name} value={state.id} />
              ))}
            </Picker>
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Postal Code *</Text>
          <TextInput
            style={styles.input}
            value={postalCode}
            onChangeText={setPostalCode}
            placeholder="Enter postal code"
            keyboardType="numeric"
          />
        </View>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setIsDefault(!isDefault)}
        >
          <View style={[styles.checkbox, isDefault && styles.checked]} />
          <Text style={styles.checkboxLabel}>Set as default address</Text>
        </TouchableOpacity>
      </ScrollView>
      <TouchableOpacity style={styles.addButton} onPress={handleAddAddress}>
        <Text style={styles.addButtonText}>Add Address</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
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
  container: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Poppins Medium',
    color: Colors.DEFAULT_GREY,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.LIGHT_GREY2,
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Poppins Regular',
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.LIGHT_GREY2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: Colors.DEFAULT_GREY,
    borderRadius: 4,
    marginRight: 8,
  },
  checked: {
    backgroundColor: Colors.DEFAULT_GREEN,
  },
  checkboxLabel: {
    fontFamily: 'Poppins Regular',
    fontSize: 16,
    color: Colors.DEFAULT_BLACK,
  },
  addButton: {
    backgroundColor: Colors.DEFAULT_GREEN,
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: Colors.DEFAULT_WHITE,
    fontFamily: 'Poppins Semi Bold',
    fontSize: 16,
  },
});

export default AddNewAddressScreen;