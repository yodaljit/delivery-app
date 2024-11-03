import {ApiContants} from '../constants';
import axios from 'axios';
import {authHeader} from '../utils/Generator';
import {getToken} from '../Store';

const getRestaurants = async (params = {}) => {
  try {
    let restaurantResponse = await axios.get(
      `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.RESTAURANT}`,
      {
        headers: authHeader(getToken()),
        params: params,
      },
    );
    if (restaurantResponse?.status === 200) {
      return {
        status: true,
        message: `Restaurant data fetched`,
        data: restaurantResponse?.data,
      };
    } else {
      return {
        status: false,
        message: `Restaurant data not found`,
      };
    }
  } catch (error) {
    return {
      status: false,
      message: `Restaurant data not found`,
    };
  }
};

const getOneRestaurantById = async restaurantId => {
  try {
    let restaurantResponse = await axios.get(
      `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.RESTAURANT_DETAIL}${restaurantId}/`,
      {
        headers: authHeader(getToken()),
      },
    );
    if (restaurantResponse?.status === 200) {
      return {
        status: true,
        message: `Restaurant data fetched`,
        data: restaurantResponse?.data,
      };
    } else {
      return {
        status: false,
        message: `Restaurant data not found`,
      };
    }
  } catch (error) {
    return {
      status: false,
      message: `Restaurant data not found`,
    };
  }
};

export default {getRestaurants, getOneRestaurantById};
