import {ApiContants} from '../constants';
import axios from 'axios';
import {authHeader} from '../utils/Generator';
import {getToken} from '../Store';

export const getCartItems = async () => {
  console.log(`CartService | getCartItems`);
  try {
    let response = await axios.get(
      `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.CART}`,
      {
        headers: authHeader(getToken()),
      },
    );
    if (response?.status === 200) {
      return {
        status: true,
        message: 'Cart data fetched',
        data: response?.data,
      };
    } else {
      return {
        status: false,
        message: 'Cart data not found',
      };
    }
  } catch (error) {
    console.error('CartService | getCartItems error:', error);
    return {
      status: false,
      message: 'Cart data not found',
    };
  }
};

export const addToCart = async ({foodId}) => {
  console.log(`CartService | addToCart | Sending request for foodId:`, foodId);
  try {
    let response = await axios.post(
      `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.CART}add/`,
      {
        menu_item: foodId,
        quantity: 1,
      },
      {
        headers: authHeader(getToken()),
      },
    );
    console.log('CartService | addToCart | Response:', response);
    if (response?.status === 201) {
      return {
        status: true,
        message: `Item added to cart successfully`,
        data: response?.data,
      };
    } else {
      return {
        status: false,
        message: `Item added to cart failed`,
      };
    }
  } catch (error) {
    console.error('CartService | addToCart | Error:', error);
    return {
      status: false,
      message: `Item added to cart failed: ${error.message}`,
    };
  }
};

export const removeFromCart = async ({foodId}) => {
  console.log(`CartService | removeFromCart | Sending request for foodId:`, foodId);
  try {
    let response = await axios.delete(
      `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.CART}remove/${foodId}/`,
      {
        headers: authHeader(getToken()),
      },
    );
    console.log('CartService | removeFromCart | Response:', response);
    if (response?.status === 200) {
      return {
        status: true,
        message: `Item removed from cart successfully`,
        data: response?.data,
      };
    } else {
      return {
        status: false,
        message: `Item removal from cart failed`,
      };
    }
  } catch (error) {
    console.error('CartService | removeFromCart | Error:', error);
    return {
      status: false,
      message: `Item removal from cart failed: ${error.message}`,
    };
  }
};

// Remove this line
// export default {getCartItems, addToCart, removeFromCart};