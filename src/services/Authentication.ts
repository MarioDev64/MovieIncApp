import { Linking } from 'react-native';
import { axiosInstance } from './';

export const createSession = async (token: string) => {
  try {
    const sesionResponse = await axiosInstance.post('/authentication/session/new', {
      request_token: token,
    });

    return sesionResponse.data.session_id;
  } catch (err) {
    throw new Error('Login failed: ' + err);
  }
};

export const validateRequestToken = async (username: string, password: string, requestToken: string) => {
  await axiosInstance.post('/authentication/token/validate_with_login', {
    username,
    password,
    request_token: requestToken,
  });
};

export const login = async () => {
  try {
    const requestToken = await getRequestToken();
    await approveRequestToken(requestToken)
    return requestToken;
  } catch (err) {
    throw err;
  }
};

export const logout = async (sessionId: string) => {
  try {
    const logoutResponse = await axiosInstance.delete('/authentication/session', {
      data: {
        session_id: sessionId,
      },
    });

    return logoutResponse.data.success;
  } catch (err) {
    throw new Error('Logout failed: ' + err);
  }
};

export const approveRequestToken = async (requestToken: string) => {
  try{
    const url = `https://www.themoviedb.org/authenticate/${requestToken}`;
    const canOpen = await Linking.canOpenURL(url);
    canOpen && await Linking.openURL(url);
  }catch(err){
    console.log(err);
  }
};

export const getRequestToken = async () => {
  const response = await axiosInstance.get('/authentication/token/new');
  return response.data.request_token;
};