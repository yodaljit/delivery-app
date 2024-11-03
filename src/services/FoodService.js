import {ApiContants} from '../constants';
import axios from 'axios';
import {authHeader} from '../utils/Generator';
import {getToken} from '../Store';

const getOneFoodById = async foodId => {
  try {
    let foodResponse = await axios.get(
      `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.FOOD}/${foodId}`,
      {
        headers: authHeader(getToken()),
      },
    );
    if (foodResponse?.status === 200) {
      return {
        status: true,
        message: `Food data fetched`,
        data: foodResponse?.data
      };
    } else {
      return {
        status: false,
        message: `Food data not found`,
      };
    }
  } catch (error) {
    return {
      status: false,
      message: `Food data not found`,
    };
  }
};

const placeOrder = async () => {
  try {
    let response = await axios.post(
      `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.PLACE_ORDER}`,
      {}, // Empty body as the API doesn't seem to require any data in the request body
      {
        headers: authHeader(getToken()),
      },
    );
    if (response?.status === 201) {
      return {
        status: true,
        message: `Order placed successfully`,
        data: response?.data
      };
    } else {
      return {
        status: false,
        message: `Failed to place order`,
      };
    }
  } catch (error) {
    return {
      status: false,
      message: `Failed to place order: ${error.message}`,
    };
  }
};

export default {getOneFoodById, placeOrder};
