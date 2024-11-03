import * as CartService from '../services/CartService';

const types = {
  GET_CART_ITEMS: 'GET_CART_ITEMS',
  SET_IS_LOADING: 'SET_IS_LOADING',
};

export const addToCart = ({foodId}) => {
  return async dispatch => {
    try {
      const response = await CartService.addToCart({foodId});
      if (response.status) {
        dispatch({
          type: 'ADD_TO_CART',
          payload: {foodId, ...response.data},
        });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };
};

export const removeFromCart = ({foodId}) => {
  return async dispatch => {
    try {
      const response = await CartService.removeFromCart({foodId});
      if (response.status) {
        dispatch({
          type: 'REMOVE_FROM_CART',
          payload: {foodId},
        });
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };
};

const getCartItems = () => {
  return dispatch => {
    dispatch({
      type: types.SET_IS_LOADING,
      payload: true,
    });
    CartService.getCartItems()
      .then(cartResponse => {
        dispatch({
          type: types.GET_CART_ITEMS,
          payload: cartResponse?.data,
        });
        dispatch({
          type: types.SET_IS_LOADING,
          payload: false,
        });
      })
      .catch(() => {
        dispatch({
          type: types.SET_IS_LOADING,
          payload: false,
        });
      });
  };
};

export default {types, addToCart, removeFromCart, getCartItems};
