const authHeader = (token) => {
  console.log('Token:', token);
    if (token) {
      return {
        Authorization: `TOKEN ${token.token}`, // Changed from 'Bearer' to 'TOKEN'
      };
    } else {
      return {};
    }
  };
export {authHeader};
