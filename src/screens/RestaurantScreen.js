import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Colors, Images } from '../constants';
import { RestaurantService, StaticImageService } from '../services';
import { Display } from '../utils';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import { BookmarkAction } from '../actions';
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

const RestaurantScreen = ({ route, navigation }) => {
  const { restaurantId } = route.params;
  const [restaurant, setRestaurant] = useState(null);
  const [selectedSubMenu, setSelectedSubMenu] = useState('Menu');

  useEffect(() => {
    fetchRestaurantDetails();
  }, []);


  const fetchRestaurantDetails = async () => {
    try {
      const response = await RestaurantService.getOneRestaurantById(restaurantId);
      if (response.status) {
        setRestaurant(response.data);
      } else {
        console.error('Failed to fetch restaurant details:', response.message);
      }
    } catch (error) {
      console.error('Error fetching restaurant details:', error);
    }
  };

  const dispatch = useDispatch();
  const isBookmarked = useSelector(
    state =>
      state?.bookmarkState?.bookmarks?.filter(
        item => item?.restaurantId === restaurantId,
      )?.length > 0,
  );
  const addBookmark = () => dispatch(BookmarkAction.addBookmark({ restaurantId }));
  const removeBookmark = () => dispatch(BookmarkAction.removeBookmark({ restaurantId }));

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

  const renderMenuItem = (item) => (
    <TouchableOpacity 
      key={item.id}
      style={styles.menuItem}
      onPress={() => navigation.navigate('Food', { foodId: item.id })}
    >
      <View style={styles.menuItemInfo}>
        <Text style={styles.menuItemName}>{item.name}</Text>
        <Text style={styles.menuItemDescription}>{item.description}</Text>
        <Text style={styles.menuItemPrice}>₹{item.price}</Text>
      </View>
      {item.image && (
        <Image 
          source={{ uri: decodeAndFormatImageUrl(item.image) }} 
          style={styles.menuItemImage} 
          defaultSource={Images.PLACEHOLDER_IMAGE}
        />
      )}
    </TouchableOpacity>
  );

  if (!fontsLoaded || !restaurant) {
    return <Text>Loading...</Text>;
  }

  const profilePictureUrl = decodeAndFormatImageUrl(restaurant.profile.profile_picture);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView>
        <View style={styles.imageContainer}>
          <Image
            style={styles.coverImage}
            source={{ uri: profilePictureUrl }}
            defaultSource={Images.PLACEHOLDER_IMAGE} // Add a placeholder image
          />
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
              <AntDesign name="arrowleft" size={24} color={Colors.DEFAULT_WHITE} />
            </TouchableOpacity>
            <TouchableOpacity onPress={isBookmarked ? removeBookmark : addBookmark} style={styles.headerButton}>
              <AntDesign
                name={isBookmarked ? "heart" : "hearto"}
                size={24}
                color={Colors.DEFAULT_YELLOW}
              />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.mainContainer}>
          <Text style={styles.titleText}>{restaurant.profile.full_name}</Text>
          <View style={styles.subHeaderContainer}>
            <View style={styles.rowAndCenter}>
              <FontAwesome name="star" size={20} color={Colors.DEFAULT_YELLOW} />
              <Text style={styles.ratingText}>4.2</Text>
              <Text style={styles.reviewsText}>(455 Reviews)</Text>
            </View>
            <View style={styles.rowAndCenter}>
              <FontAwesome name="phone" size={16} color={Colors.DEFAULT_GREY} />
              <Text style={styles.phoneText}>{restaurant.phone_number}</Text>
            </View>
          </View>
          <View style={styles.deliveryInfoContainer}>
            <View style={styles.deliveryInfo}>
              <Image source={Images.DELIVERY_CHARGE} style={styles.deliveryIcon} />
              <Text style={styles.deliveryText}>Free Delivery</Text>
            </View>
            <View style={styles.deliveryInfo}>
              <Image source={Images.DELIVERY_TIME} style={styles.deliveryIcon} />
              <Text style={styles.deliveryText}>{restaurant?.time || '30-40'} min</Text>
            </View>
          </View>
          
          <View style={styles.subMenuContainer}>
            {['Menu', 'Information', 'Reviews'].map(item => (
              <TouchableOpacity
                key={item}
                style={styles.subMenuButtonContainer}
                onPress={() => setSelectedSubMenu(item)}>
                <Text style={selectedSubMenu === item ? styles.subMenuButtonText : {...styles.subMenuButtonText, color: Colors.DEFAULT_GREY}}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {selectedSubMenu === 'Menu' && (
            <View style={styles.menuContainer}>
              {restaurant.menu_categories.map(category => (
                <View key={category.id} style={styles.categoryContainer}>
                  <Text style={styles.categoryTitle}>{category.name}</Text>
                  {category.subcategories.map(subcategory => (
                    <View key={subcategory.id}>
                      <Text style={styles.subcategoryTitle}>{subcategory.name}</Text>
                      {subcategory.menu_items.map(item => renderMenuItem(item))}
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}
          
          {selectedSubMenu === 'Information' && (
            <View style={styles.informationContainer}>
              <Text style={styles.informationText}>{restaurant.profile.bio}</Text>
              <Text style={styles.informationText}>Email: {restaurant.profile.email}</Text>
            </View>
          )}
          
          {selectedSubMenu === 'Reviews' && (
            <View style={styles.reviewsContainer}>
              <Text style={styles.reviewsText}>Reviews coming soon!</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.DEFAULT_WHITE,
  },
  imageContainer: {
    height: Display.setHeight(35),
    width: Display.setWidth(100),
  },
  coverImage: {
    height: '100%',
    width: '100%',
  },
  headerContainer: {
    position: 'absolute',
    top: StatusBar.currentHeight + 20, // Moved down by 20 pixels
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  mainContainer: {
    backgroundColor: Colors.DEFAULT_WHITE,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  titleText: {
    fontSize: 28,
    fontFamily: 'Poppins Semi Bold',
    color: Colors.DEFAULT_BLACK,
    marginBottom: 10,
  },
  subHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  rowAndCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 14,
    fontFamily: 'Poppins Bold',
    color: Colors.DEFAULT_BLACK,
  },
  reviewsText: {
    fontSize: 14,
    fontFamily: 'Poppins Medium',
    color: Colors.DEFAULT_BLACK,
    marginLeft: 5,
  },
  phoneText: {
    fontSize: 14,
    fontFamily: 'Poppins Medium',
    color: Colors.DEFAULT_BLACK,
    marginLeft: 5,
  },
  deliveryInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  deliveryText: {
    fontSize: 14,
    fontFamily: 'Poppins Medium',
    color: Colors.DEFAULT_BLACK,
  },
  subMenuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    paddingVertical: 16,
    borderColor: Colors.DEFAULT_GREY,
  },
  subMenuButtonContainer: {
    paddingVertical: 8,
    width: Display.setWidth(30),
    alignItems: 'center',
  },
  subMenuButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins Semi Bold',
    color: Colors.DEFAULT_BLACK,
  },
  menuContainer: {
    paddingVertical: 10,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 20,
    fontFamily: 'Poppins Bold',
    marginTop: 16,
    marginBottom: 10,
    color: Colors.DEFAULT_BLACK,
  },
  subcategoryTitle: {
    fontSize: 18,
    fontFamily: 'Poppins Semi Bold',
    marginTop: 12,
    marginBottom: 8,
    color: Colors.DEFAULT_BLACK,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.LIGHT_GREY2,
  },
  menuItemInfo: {
    flex: 1,
  },
  menuItemName: {
    fontSize: 16,
    fontFamily: 'Poppins Medium',
    color: Colors.DEFAULT_BLACK,
  },
  menuItemDescription: {
    fontSize: 14,
    fontFamily: 'Poppins Regular',
    color: Colors.DEFAULT_GREY,
    marginTop: 4,
  },
  menuItemPrice: {
    fontSize: 16,
    fontFamily: 'Poppins Semi Bold',
    color: Colors.DEFAULT_BLACK,
    marginTop: 4,
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginLeft: 10,
  },
  informationContainer: {
    padding: 16,
  },
  informationText: {
    fontSize: 14,
    fontFamily: 'Poppins Regular',
    color: Colors.DEFAULT_BLACK,
    marginBottom: 10,
  },
  reviewsContainer: {
    padding: 16,
  },
});


export default RestaurantScreen;