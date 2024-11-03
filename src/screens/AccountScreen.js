import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Separator } from '../components';
import { Colors } from '../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Display } from '../utils';
import { useDispatch } from 'react-redux';
import UserService from '../services/UserService';
import { GeneralAction } from '../actions';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { StorageService } from '../services';

const decodeAndFormatImageUrl = (encodedUrl) => {
  if (!encodedUrl) return null;
  try {
    const encodedPart = encodedUrl.split('/media/')[1];
    const decodedUrl = decodeURIComponent(encodedPart);
    return decodedUrl;
  } catch (error) {
    console.error('Error decoding image URL:', error);
    return null;
  }
};


const AccountScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await UserService.getUserData();
      if (response.status) {
        setUserData(response.data);
      } else {
        console.error('Failed to fetch user data:', response.message);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const logout = () => {
    StorageService.setToken('').then(() => {
      dispatch(GeneralAction.setToken(''));
      dispatch(GeneralAction.setUserData(null));
    });
  };

  const [fontsLoaded] = useFonts({
    'Poppins Black': require('../assets/fonts/Poppins-Black.ttf'),
    'Poppins Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Poppins Extra Bold': require('../assets/fonts/Poppins-ExtraBold.ttf'),
    'Poppins Extra Light': require('../assets/fonts/Poppins-ExtraLight.ttf'),
    'Poppins Light': require('../assets/fonts/Poppins-Light.ttf'),
    'Poppins Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'Poppins Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins Semi Bold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins Thin': require('../assets/fonts/Poppins-Thin.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.DEFAULT_GREEN}
        translucent
      />
      <Separator height={StatusBar.currentHeight} />
      <View style={styles.backgroundCurvedContainer} />
      <View style={styles.headerContainer}>
        <Ionicons
          name="chevron-back-outline"
          size={20}
          color={Colors.DEFAULT_WHITE}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerText}>Account</Text>
        <View style={styles.emptyView} />
      </View>
      <View style={styles.profileHeaderContainer}>
        <View style={styles.profileImageContainer}>
          <Image
            style={styles.profileImage}
            source={{ uri: decodeAndFormatImageUrl(userData?.profile?.profile_picture) || 'default_avatar_image_url' }}
          />
        </View>
        <View style={styles.profileTextContainer}>
          <Text style={styles.nameText}>{userData?.profile?.full_name || 'User'}</Text>
          <Text style={styles.phoneText}>{userData?.phone_number || 'Phone number not available'}</Text>
          <Text style={styles.emailText}>{userData?.profile?.email || 'Email not available'}</Text>
          <Text style={styles.userTypeText}>{userData?.user_type || 'User type not available'}</Text>
        </View>
      </View>
      <View style={styles.menuContainer}>
        <TouchableOpacity 
          style={styles.menuItem} 
          activeOpacity={0.8}
          onPress={() => navigation.navigate('OrderHistory')}
        >
          <View style={styles.menuIcon}>
            <MaterialCommunityIcons
              name="truck-fast-outline"
              size={18}
              color={Colors.DEFAULT_GREEN}
            />
          </View>
          <Text style={styles.menuText}>Delivered {'\n'}Orders</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.mainContainer}>
        <View style={styles.sectionContainer}>
          <TouchableOpacity
            style={styles.sectionTextContainer}
            activeOpacity={0.8}
            onPress={() => {}}
          >
            <MaterialCommunityIcons
              name="account-question-outline"
              size={18}
              color={Colors.DEFAULT_GREEN}
            />
            <Text style={styles.sectionText}>Raise a Request</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.sectionContainer}>
          <TouchableOpacity
            style={styles.sectionTextContainer}
            activeOpacity={0.8}
            onPress={() => logout()}>
            <MaterialCommunityIcons
              name="logout"
              size={18}
              color={Colors.DEFAULT_GREEN}
            />
            <Text style={styles.sectionText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.SECONDARY_WHITE,
  },
  backgroundCurvedContainer: {
    backgroundColor: Colors.DEFAULT_GREEN,
    height: 2000,
    position: 'absolute',
    top: -1 * (2000 - 230),
    width: 2000,
    borderRadius: 2000,
    alignSelf: 'center',
    zIndex: -1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 20,
    fontFamily: 'Poppins Medium',
    lineHeight: 20 * 1.4,
    color: Colors.DEFAULT_WHITE,
  },
  profileHeaderContainer: {
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  profileImageContainer: {
    backgroundColor: Colors.DEFAULT_WHITE,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 1,
    elevation: 3,
  },
  profileImage: {
    width: Display.setWidth(15),
    height: Display.setWidth(15),
    borderRadius: 32,
  },
  profileTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  nameText: {
    fontSize: 18,
    fontFamily: 'Poppins Semi Bold',
    lineHeight: 18 * 1.4,
    color: Colors.DEFAULT_WHITE,
  },
  phoneText: {
    fontSize: 14,
    fontFamily: 'Poppins Regular',
    color: Colors.DEFAULT_WHITE,
  },
  emailText: {
    fontSize: 12,
    fontFamily: 'Poppins Regular',
    color: Colors.DEFAULT_WHITE,
  },
  userTypeText: {
    fontSize: 12,
    fontFamily: 'Poppins Regular',
    color: Colors.DEFAULT_WHITE,
  },
  menuContainer: {
    backgroundColor: Colors.DEFAULT_WHITE,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 20,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  menuItem: {
    flex: 1,
    alignItems: 'center',
  },
  menuIcon: {
    backgroundColor: Colors.LIGHT_GREEN,
    height: Display.setWidth(8),
    width: Display.setWidth(8),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 32,
  },
  menuText: {
    fontSize: 12,
    fontFamily: 'Poppins Semi Bold',
    lineHeight: 12 * 1.4,
    color: Colors.DEFAULT_BLACK,
    textAlign: 'center',
    marginTop: 5,
  },
  mainContainer: {
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: Colors.DEFAULT_WHITE,
    elevation: 3,
    paddingHorizontal: 20,
    borderRadius: 10,
    paddingBottom: 20,
  },
  sectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  sectionTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionText: {
    fontSize: 13,
    fontFamily: 'Poppins Regular',
    color: Colors.INACTIVE_GREY,
    marginLeft: 10,
  },
});

export default AccountScreen;
