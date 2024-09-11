import { axiosInstance } from './';

export const getSesionId = async (token: string) => {
    try {
      const sesionResponse = await axiosInstance.post('/authentication/session/new', {
        request_token: token,
      });
  
      return sesionResponse.data.session_id;
    } catch (err) {
      throw new Error('Login failed: ' + err);
    }
};

export const login = async (username: string, password: string) => {
    try {
      const requestToken = await getRequestToken();
  
      const loginResponse = await axiosInstance.post(
        '/authentication/token/validate_with_login',
        {
          username,
          password,
          request_token: requestToken,
        }
      );

      return loginResponse.data;
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
  
export const getRequestToken = async () => {
    const response = await axiosInstance.get('/authentication/token/new');
    return response.data.request_token;
};