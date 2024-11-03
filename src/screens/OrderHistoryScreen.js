import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Separator } from '../components';
import { Colors, ApiContants } from '../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Display } from '../utils';
import axios from 'axios';
import { getToken } from '../Store';
import { authHeader } from '../utils/Generator';

const OrderHistoryScreen = ({ navigation }) => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const token = await getToken();
      let response = await axios.get(
        `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.MY_DELIVERIES}`,
        {
          headers: authHeader(token),
        }
      );
      if (response?.status === 200) {
        setDeliveries(response.data);
        setLoading(false);
      } else {
        console.error('Failed to fetch deliveries');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const showDetails = (delivery) => {
    setSelectedDelivery(delivery);
    setModalVisible(true);
  };

  const renderDeliveryItem = ({ item }) => (
    <TouchableOpacity style={styles.orderItem} onPress={() => showDetails(item)}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderIdText}>Order #{item.order}</Text>
        <Text style={styles.orderDateText}>{formatDate(item.assigned_at)}</Text>
      </View>
      <Text style={styles.outletNameText}>{item.outlet_name}</Text>
      <Text style={styles.totalAmountText}>Total: ₹{item.order_total_amount}</Text>
      <Text style={styles.statusText}>Status: {item.status}</Text>
    </TouchableOpacity>
  );

  const renderDetailsModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView style={styles.modalScrollView}>
            <Text style={styles.modalTitle}>Order Details</Text>
            {selectedDelivery && (
              <>
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Order Information</Text>
                  <Text style={styles.modalText}>Order ID: #{selectedDelivery.order}</Text>
                  <Text style={styles.modalText}>Total Amount: ₹{selectedDelivery.order_total_amount}</Text>
                  <Text style={styles.modalText}>Outlet: {selectedDelivery.outlet_name}</Text>
                  <Text style={styles.modalText}>Status: {selectedDelivery.status}</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Customer Information</Text>
                  <Text style={styles.modalText}>Name: {selectedDelivery.customer_name}</Text>
                  <Text style={styles.modalText}>Phone: {selectedDelivery.customer_phone}</Text>
                </View>
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Delivery Timeline</Text>
                  <Text style={styles.modalText}>Assigned: {formatDate(selectedDelivery.assigned_at)}</Text>
                  {selectedDelivery.picked_up_at && (
                    <Text style={styles.modalText}>Picked Up: {formatDate(selectedDelivery.picked_up_at)}</Text>
                  )}
                  {selectedDelivery.delivered_at && (
                    <Text style={styles.modalText}>Delivered: {formatDate(selectedDelivery.delivered_at)}</Text>
                  )}
                </View>
                {selectedDelivery.notes && (
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Notes</Text>
                    <Text style={styles.modalText}>{selectedDelivery.notes}</Text>
                  </View>
                )}
              </>
            )}
          </ScrollView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.DEFAULT_GREEN}
        translucent
      />
      <Separator height={StatusBar.currentHeight} />
      <View style={styles.headerContainer}>
        <Ionicons
          name="chevron-back-outline"
          size={20}
          color={Colors.DEFAULT_BLACK}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerText}>Order History</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.DEFAULT_GREEN} />
      ) : (
        <FlatList
          data={deliveries}
          renderItem={renderDeliveryItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.orderList}
        />
      )}
      {renderDetailsModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.SECONDARY_WHITE,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.DEFAULT_WHITE,
  },
  headerText: {
    fontSize: 20,
    fontFamily: 'Poppins-Medium',
    lineHeight: 20 * 1.4,
    width: Display.setWidth(80),
    textAlign: 'center',
  },
  orderList: {
    padding: 20,
    paddingBottom: 80, // Add padding at the bottom to prevent content from being hidden behind the tab bar
  },
  orderItem: {
    backgroundColor: Colors.DEFAULT_WHITE,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  orderIdText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.DEFAULT_BLACK,
  },
  orderDateText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: Colors.INACTIVE_GREY,
  },
  outletNameText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: Colors.DEFAULT_GREEN,
    marginBottom: 5,
  },
  totalAmountText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.DEFAULT_BLACK,
    marginBottom: 5,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: Colors.DEFAULT_YELLOW,
    marginBottom: 10,
  },
  detailsButton: {
    backgroundColor: Colors.LIGHT_GREEN,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  detailsButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: Colors.DEFAULT_GREEN,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.DEFAULT_WHITE,
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    marginBottom: 20,
    color: Colors.DEFAULT_BLACK,
  },
  modalText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: Colors.DEFAULT_BLACK,
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: Colors.DEFAULT_GREEN,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.DEFAULT_WHITE,
  },
  modalScrollView: {
    maxHeight: '80%',
  },
  modalSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    marginBottom: 10,
  },
});

export default OrderHistoryScreen;
