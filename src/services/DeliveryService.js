import axios from 'axios';
import {ApiContants} from '../constants';
import {authHeader} from '../utils/Generator';
import {getToken} from '../Store';


const getDeliveryPersonAvailability = async () => {
  try {
    const response = await axios.get(`${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.DELIVERY_PERSON_AVAILABILITY}`,{
        headers: authHeader(getToken()),
      },
    );
    console.log("Response Data");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching delivery person availability:', error);
    throw error;
  }
};

const updateDeliveryPersonAvailability = async (isAvailable) => {
  try {
    const response = await axios.patch(
      `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.DELIVERY_PERSON_AVAILABILITY}`,
      { is_available: isAvailable },
      {
        headers: authHeader(getToken()),
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error updating delivery person availability:', error);
    throw error;
  }
};

export default {
  getDeliveryPersonAvailability,
  updateDeliveryPersonAvailability,
};

