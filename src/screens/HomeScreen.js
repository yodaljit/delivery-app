import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Animated,
  FlatList,
} from 'react-native';
import { Colors } from '../constants';
import { Separator } from '../components';
import { useFonts } from 'expo-font';
import { DeliveryService } from '../services';

const HomeScreen = ({ navigation }) => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [newOrders, setNewOrders] = useState([]);
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [animation] = useState(new Animated.Value(0));
  const [isLoading, setIsLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    'Poppins Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'Poppins Bold': require('../assets/fonts/Poppins-Bold.ttf'),
  });

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const data = await DeliveryService.getDeliveryPersonAvailability();
        setIsAvailable(data.is_available);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching availability:', error);
        setIsLoading(false);
      }
    };

    fetchAvailability();

    // TODO: Set up socket connection for real-time order notifications
    const mockNewOrders = [
      { id: '1', restaurant: 'Pizza Place', destination: '123 Main St' },
      { id: '2', restaurant: 'Burger Joint', destination: '456 Elm St' },
    ];
    setNewOrders(mockNewOrders);
  }, []);

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isAvailable ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isAvailable]);

  const handleToggleAvailability = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const updatedData = await DeliveryService.updateDeliveryPersonAvailability(!isAvailable);
      setIsAvailable(updatedData.is_available);
    } catch (error) {
      console.error('Error updating availability:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptOrder = (order) => {
    setNewOrders(newOrders.filter(o => o.id !== order.id));
    setAcceptedOrders([...acceptedOrders, order]);
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    // TODO: Implement logic to update order status
    console.log(`Updating order ${orderId} to status: ${newStatus}`);
  };

  const toggleBackgroundColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.DEFAULT_GREY, Colors.DEFAULT_YELLOW]
  });

  const toggleCirclePosition = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22]
  });

  if (!fontsLoaded) {
    return null;
  }

  const renderNewOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderText}>{item.restaurant} → {item.destination}</Text>
      <TouchableOpacity 
        style={styles.acceptButton} 
        onPress={() => handleAcceptOrder(item)}
      >
        <Text style={styles.acceptButtonText}>Accept</Text>
      </TouchableOpacity>
    </View>
  );

  const renderAcceptedOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderText}>{item.restaurant} → {item.destination}</Text>
      <TouchableOpacity 
        style={styles.statusButton} 
        onPress={() => handleUpdateOrderStatus(item.id, 'Picked Up')}
      >
        <Text style={styles.statusButtonText}>Update Status</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>New Orders</Text>
      <FlatList
        data={newOrders}
        renderItem={renderNewOrderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No new orders</Text>}
        scrollEnabled={false}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.DEFAULT_GREEN}
        translucent
      />
      <Separator height={StatusBar.currentHeight} />
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Dashboard</Text>
        <View style={styles.onlineToggleContainer}>
          <Text style={styles.onlineText}>{isAvailable ? 'Available' : 'Unavailable'}</Text>
          <TouchableOpacity onPress={handleToggleAvailability} activeOpacity={0.8} disabled={isLoading}>
            <Animated.View style={[
              styles.toggleButton,
              { backgroundColor: toggleBackgroundColor }
            ]}>
              <Animated.View style={[
                styles.toggleCircle,
                { transform: [{ translateX: toggleCirclePosition }] }
              ]} />
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        style={styles.contentContainer}
        ListHeaderComponent={renderHeader}
        data={acceptedOrders}
        renderItem={renderAcceptedOrderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Accepted Orders</Text>
            <Text style={styles.emptyText}>No accepted orders</Text>
          </View>
        }
        ListHeaderComponentStyle={styles.listHeaderStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.SECONDARY_WHITE,
  },
  headerContainer: {
    backgroundColor: Colors.DEFAULT_GREEN,
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    color: Colors.DEFAULT_WHITE,
    fontSize: 20,
    fontFamily: 'Poppins Bold',
  },
  onlineToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineText: {
    color: Colors.DEFAULT_WHITE,
    marginRight: 10,
    fontFamily: 'Poppins Medium',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins Bold',
    marginBottom: 10,
    color: Colors.DEFAULT_BLACK,
  },
  orderItem: {
    backgroundColor: Colors.DEFAULT_WHITE,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderText: {
    fontFamily: 'Poppins Medium',
    fontSize: 14,
    color: Colors.DEFAULT_BLACK,
  },
  acceptButton: {
    backgroundColor: Colors.DEFAULT_GREEN,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  acceptButtonText: {
    color: Colors.DEFAULT_WHITE,
    fontFamily: 'Poppins Medium',
  },
  statusButton: {
    backgroundColor: Colors.DEFAULT_YELLOW,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  statusButtonText: {
    color: Colors.DEFAULT_BLACK,
    fontFamily: 'Poppins Medium',
  },
  emptyText: {
    fontFamily: 'Poppins Medium',
    fontSize: 14,
    color: Colors.DEFAULT_GREY,
    textAlign: 'center',
  },
  switchBorder: {
    borderWidth: 1,
    borderColor: Colors.DEFAULT_BLACK,
    borderRadius: 16,
    padding: 1,
  },
  toggleButton: {
    width: 50,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.DEFAULT_BLACK,
  },
  toggleCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.DEFAULT_WHITE,
  },
  listHeaderStyle: {
    marginBottom: 20,
  },
});

export default HomeScreen;
