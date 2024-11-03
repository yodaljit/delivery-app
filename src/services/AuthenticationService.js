import axios from 'axios';
import {ApiContants} from '../constants';
import {getToken} from '../Store';
import {authHeader} from '../utils/Generator';

// Ensure the base URL is correctly set
const AuthRequest = axios.create({
  baseURL: ApiContants.BACKEND_API.BASE_API_URL,
});

const register = async user => {
  if (!user?.username || !user?.email || !user?.password) {
    return {status: false, message: 'Please fill up all fields'};
  }
  try {
    let requestBody = {
      username: user?.username,
      email: user?.email,
      password: user?.password,
    };
    let registerResponse = await AuthRequest.post(
      ApiContants.BACKEND_API.REGISTER,
      requestBody,
    );
    return registerResponse?.data;
  } catch (error) {
    return {status: false, message: 'Oops! Something went wrong'};
  }
};

const sendOtp = async (phoneNumber) => {
  try {
    const response = await AuthRequest.post(ApiContants.BACKEND_API.LOGIN, {
      phone_number: phoneNumber
    });
    return response;
  } catch (error) {
    console.error('Error in sendOtp:', error);
    return { status: false, message: 'Failed to send OTP' };
  }
};

const verifyOtp = async (phoneNumber, otp) => {
  try {
    const response = await AuthRequest.post(ApiContants.BACKEND_API.VERIFY_LOGIN, { phone_number: phoneNumber, otp: otp });
    if (response.status === 200) {
      return {
        status: true,
        data: {
          token: response.data.token,
          userId: response.data.user_id,
          phoneNumber: response.data.phone_number,
          userType: response.data.user_type,
          isNewUser: response.data.is_new_user
        }
      };
    } else {
      return { status: false, message: response.data.error || 'Verification failed' };
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { status: false, message: error.response?.data?.error || 'Failed to verify OTP' };
  }
};

const checkUserExist = async (type, value) => {
  try {
    let params = {[type]: value};
    let userCheckResponse = await AuthRequest.get(
      ApiContants.BACKEND_API.USER_EXIST,
      {params},
    );
    return userCheckResponse?.data;
  } catch (error) {
    return {status: false, message: 'Oops! Something went wrong'};
  }
};

const refreshToken = async () => {
  try {
    let tokenResponse = await AuthRequest.post(
      ApiContants.BACKEND_API.REFRESH_TOKEN,
      {headers: authHeader(getToken())},
    );
    if (tokenResponse?.status === 200) {
      return {status: true, data: tokenResponse?.data};
    } else {
      return {status: false};
    }
  } catch (error) {
    return {status: false, message: 'Oops! Something went wrong'};
  }
};

const getAddresses = async () => {
  try {
    const response = await axios.get(`${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.GET_ADDRESSES}`);
    if (response?.status === 200) {
      return {
        status: true,
        message: 'Addresses fetched successfully',
        data: response?.data,
      };
    } else {
      return {
        status: false,
        message: 'Addresses fetch failed',
      };
    }
  } catch (error) {
    return {
      status: false,
      message: 'Addresses fetch failed',
      error,
    };
  }
};

const getStates = async () => {
  try {
    const token = await getToken(); // Assuming getToken() returns a Promise
    const response = await axios.get(
      `${ApiContants.BACKEND_API.BASE_API_URL}/api/auth/states`,
      {
        headers: authHeader(token)
      }
    );
    if (response?.status === 200) {
      return {
        status: true,
        message: 'States fetched successfully',
        data: response?.data,
      };
    } else {
      return {
        status: false,
        message: 'States fetch failed',
      };
    }
  } catch (error) {
    console.error('Error fetching states:', error.response || error);
    return {
      status: false,
      message: 'States fetch failed',
      error: error.response?.data || error.message,
    };
  }
};

const addAddress = async (addressData) => {
  try {
    const response = await axios.post(
      `${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.GET_ADDRESSES}`,
      addressData
    );
    if (response?.status === 201) {
      return {
        status: true,
        message: 'Address added successfully',
        data: response?.data,
      };
    } else {
      return {
        status: false,
        message: 'Failed to add address',
      };
    }
  } catch (error) {
    return {
      status: false,
      message: 'Failed to add address',
      error,
    };
  }
};

const login = async (phoneNumber, password) => {
  try {
    const response = await axios.post(`${ApiContants.BACKEND_API.BASE_API_URL}${ApiContants.BACKEND_API.VENDOR_DELIVERY_LOGIN}`, {
      phone_number: phoneNumber,
      password: password,
    });
    if (response?.status === 200) {
    return {
      status: true,
      data: {
        token: response.data.token,
        userId: response.data.user_id,
        phoneNumber: response.data.phone_number,
        userType: response.data.user_type,
        }
      };
    } else {
    return {
      status: false,
      message: 'Invalid credentials',
    };
  }
  } catch (error) {
    return {
      status: false,
      message: error.response?.data?.message || 'An error occurred during login',
    };
  }
};

export default {register, sendOtp, verifyOtp, checkUserExist, refreshToken, getAddresses, getStates, addAddress, login};
