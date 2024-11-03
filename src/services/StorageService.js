import AsyncStorage from '@react-native-async-storage/async-storage';

const setFirstTimeUse = () => {
  return AsyncStorage.setItem('isFirstTimeUse', 'true');
};

const getFirstTimeUse = () => {
  return AsyncStorage.getItem('isFirstTimeUse');
};

const setToken = async (token) => {
  try {
    await AsyncStorage.setItem('token', token);
  } catch (error) {
    console.error('Error storing token:', error);
  }
};

const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    return token ? JSON.parse(token) : null;
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

export default { setFirstTimeUse, getFirstTimeUse, setToken, getToken };
