import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Colors } from '../constants';
import { Separator } from '../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getCartItems, addToCart, removeFromCart } from '../services/CartService';
import FoodService from '../services/FoodService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CartScreen = ({ navigation }) => {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deliveryAddress, setDeliveryAddress] = useState('Loading address...');
  const insets = useSafeAreaInsets();
  const [orderPlaced, setOrderPlaced] = useState(false);

  const isCartEmpty = !cartData || !cartData.items_by_vendor || cartData.items_by_vendor.length === 0;

  useEffect(() => {
    fetchCartData();
  }, []);

  const fetchCartData = async () => {
    setLoading(true);
    try {
      const response = await getCartItems();
      if (response.status) {
        setCartData(response.data);
        if (response.data.delivery_address) {
          setDeliveryAddress(response.data.delivery_address);
        }
      }
    } catch (error) {
      console.error('Error fetching cart data:', error);
    }
    setLoading(false);
  };

  const calculateTotal = () => {
    let total = 0;
    if (cartData && cartData.items_by_vendor) {
      cartData.items_by_vendor.forEach(vendor => {
        vendor.items.forEach(item => {
          total += parseFloat(item.menu_item.price) * item.quantity;
        });
      });
    }
    return total.toFixed(2);
  };

  const incrementQuantity = async (item) => {
    try {
      const response = await addToCart({ foodId: item.menu_item.id });
      if (response.status) {
        fetchCartData();
      }
    } catch (error) {
      console.error('Error incrementing quantity:', error);
    }
  };

  const decrementQuantity = async (item) => {
    try {
      const response = await removeFromCart({ foodId: item.id });
      if (response.status) {
        fetchCartData();
      }
    } catch (error) {
      console.error('Error decrementing quantity:', error);
    }
  };

  const truncateAddress = (address, maxLength = 20) => {
    if (address.length <= maxLength) return address;
    return address.substr(0, maxLength - 3) + '...';
  };

  const handleAddressPress = () => {
    navigation.navigate('Address', { 
      currentAddress: deliveryAddress,
      onAddressChange: (newAddress) => {
        setDeliveryAddress(newAddress);
      }
    });
  };

  const handlePlaceOrder = async () => {
    if (isCartEmpty) return; // Prevent placing order if cart is empty
    try {
      const response = await FoodService.placeOrder();
      if (response.status) {
        setOrderPlaced(true);
        setTimeout(() => {
          setOrderPlaced(false);
          navigation.navigate('Home');
        }, 2000); // Show animation for 2 seconds before navigating
      } else {
        // Alert.alert('Error', response.message);
        Alert.alert('Error', 'Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'Failed to place order. Please try again.');
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchCartData();
    });

    return unsubscribe;
  }, [navigation]);

  const renderCartItem = (item) => (
    <View key={item.id} style={styles.cartItem}>
      <Text style={styles.itemName}>{item.menu_item.name}</Text>
      <View style={styles.itemDetails}>
        <Text style={styles.itemPrice}>₹{item.menu_item.price}</Text>
        <View style={styles.quantityControl}>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => decrementQuantity(item)}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => incrementQuantity(item)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.DEFAULT_WHITE} translucent />
      <Separator height={StatusBar.currentHeight} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.DEFAULT_BLACK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.savingsContainer}>
          <Text style={styles.savingsText}>₹148 Saved</Text>
          <Text style={styles.savingsSubtext}>Includes Delivery Fees, Packaging Charges.</Text>
        </View>
        <TouchableOpacity style={styles.deliveryContainer} onPress={handleAddressPress}>
          <Ionicons name="location-outline" size={20} color={Colors.DEFAULT_BLACK} />
          <View style={styles.deliveryInfo}>
            <Text style={styles.deliveryText}>Deliver to</Text>
            <Text style={styles.deliveryAddress}>{truncateAddress(deliveryAddress)}</Text>
          </View>
          <MaterialIcons name="keyboard-arrow-down" size={24} color={Colors.DEFAULT_GREY} />
        </TouchableOpacity>
        {cartData && cartData.items_by_vendor && cartData.items_by_vendor.map((vendor, index) => (
          <View key={index}>
            <Text style={styles.vendorName}>{vendor.vendor.full_name}</Text>
            {vendor.items.map(renderCartItem)}
            <Separator height={1} color={Colors.LIGHT_GREY2} />
          </View>
        ))}
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalAmount}>₹{calculateTotal()}</Text>
        </View>
        <Separator height={140} />
      </ScrollView>
      <View style={[styles.bottomContainer, { bottom: 60 + insets.bottom }]}>
        <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
          <Text style={styles.placeOrderButtonText}>Place Order</Text>
        </TouchableOpacity>
      </View>
      {orderPlaced && (
        <Animatable.View 
          style={styles.orderPlacedContainer}
          animation="bounceIn"
          duration={1000}
        >
          <Animatable.Text 
            style={styles.orderPlacedText}
            animation="pulse" 
            easing="ease-out" 
            iterationCount="infinite"
          >
            Order Placed Successfully!
          </Animatable.Text>
        </Animatable.View>
      )}
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.DEFAULT_BLACK,
  },
  content: {
    flex: 1,
  },
  savingsContainer: {
    backgroundColor: Colors.LIGHT_GREEN,
    padding: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 8,
  },
  savingsText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.DEFAULT_GREEN,
  },
  savingsSubtext: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: Colors.DEFAULT_GREY,
  },
  deliveryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.LIGHT_GREY2,
    marginBottom: 10,
  },
  deliveryInfo: {
    flex: 1,
    marginLeft: 10,
  },
  deliveryText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: Colors.DEFAULT_GREY,
  },
  deliveryAddress: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.DEFAULT_BLACK,
  },
  vendorName: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.DEFAULT_BLACK,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  itemName: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: Colors.DEFAULT_BLACK,
    flex: 1,
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.DEFAULT_BLACK,
    marginRight: 10,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: Colors.DEFAULT_GREEN,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: Colors.DEFAULT_WHITE,
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  quantityText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: Colors.DEFAULT_BLACK,
    paddingHorizontal: 10,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.LIGHT_GREY2,
  },
  totalText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.DEFAULT_BLACK,
  },
  totalAmount: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.DEFAULT_GREEN,
  },
  bottomContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: Colors.DEFAULT_WHITE,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  placeOrderButton: {
    backgroundColor: Colors.DEFAULT_GREEN,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: Colors.LIGHT_GREY2,
  },
  placeOrderButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.DEFAULT_WHITE,
  },
  orderPlacedContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 999,
  },
  orderPlacedText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.DEFAULT_WHITE,
    textAlign: 'center',
  },
});

export default CartScreen;