import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Colors, Images} from '../constants';
import {Display} from '../utils';
import { useFonts } from 'expo-font';

const decodeAndFormatImageUrl = (encodedUrl) => {
  try {
    const encodedPart = encodedUrl.split('/media/')[1];
    const decodedUrl = decodeURIComponent(encodedPart);
    return decodedUrl;
  } catch (error) {
    console.error('Error decoding image URL:', error);
    return null;
  }
};

const RestaurantMediumCard = ({profile, time, distance, tags, onPress, id}) => {
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

  const profilePictureUrl = decodeAndFormatImageUrl(profile?.profile_picture);

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(id)}>
      <View>
        <Image
          source={{uri: profilePictureUrl}}
          style={styles.posterStyle}
          defaultSource={Images.PLACEHOLDER_IMAGE}
        />
      </View>
      <View style={styles.labelContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{profile?.full_name || 'Restaurant Name'}</Text>
          <View style={styles.rowAndCenter}>
            <FontAwesome name="star" size={12} color={Colors.DEFAULT_YELLOW} />
            <Text style={styles.ratingText}>4.2</Text>
            <Text style={styles.reviewsText}>({233})</Text>
          </View>
        </View>
        <Text style={styles.tagsText}>{tags?.join(' • ')}</Text>
        <View style={styles.deliveryDetailsContainer}>
          <View style={styles.rowAndCenter}>
            <Image
              source={Images.DELIVERY_CHARGE}
              style={styles.deliveryDetailsIcon}
            />
            <Text style={styles.deliveryDetailsText}>₹30 Delivery</Text>
          </View>
          <View style={styles.rowAndCenter}>
            <Image
              source={Images.DELIVERY_TIME}
              style={styles.deliveryDetailsIcon}
            />
            <Text style={styles.deliveryDetailsText}>{time} min</Text>
          </View>
          <View style={styles.rowAndCenter}>
            <FontAwesome name="map-marker" size={16} color={Colors.DEFAULT_GREY} />
            <Text style={styles.deliveryDetailsText}>{distance}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    elevation: 1,
    borderRadius: 8,
    backgroundColor: Colors.DEFAULT_WHITE,
    marginTop: 8,
    padding: 10,
  },
  posterStyle: {
    width: Display.setWidth(20),
    height: Display.setWidth(20),
    borderRadius: 10,
    marginRight: 10,
  },
  labelContainer: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deliveryDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  titleText: {
    fontSize: 16,
    fontFamily: 'Poppins Bold',
    color: Colors.DEFAULT_BLACK,
  },
  tagsText: {
    fontSize: 12,
    fontFamily: 'Poppins Medium',
    color: Colors.DEFAULT_GREY,
    marginBottom: 7,
  },
  deliveryDetailsText: {
    marginLeft: 3,
    fontSize: 12,
    lineHeight: 12 * 1.4,
    fontFamily: 'Poppins Semi Bold',
    color: Colors.DEFAULT_BLACK,
  },
  deliveryDetailsIcon: {
    height: 16,
    width: 16,
  },
  rowAndCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 10,
    lineHeight: 10 * 1.4,
    fontFamily: 'Poppins Bold',
    color: Colors.DEFAULT_BLACK,
  },
  reviewsText: {
    fontSize: 10,
    lineHeight: 10 * 1.4,
    fontFamily: 'Poppins Medium',
    color: Colors.DEFAULT_BLACK,
  },
});

export default RestaurantMediumCard;