import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { saveKey, getKey, removeKey } from '../utils/secureStorage';
import { login as loginAPI, logout as logoutAPI, getSesionId } from '../services/Authentication';
import { getUserProfile } from '../services/Account';
import { useNavigation } from '@react-navigation/native';
import SessionExpiredDialog from '../components/SessionExpiredDialog';
import { UserProfile } from '../@types';

interface AuthContextData {
  isLoggedIn: boolean;
  user: UserProfile | null;
  accountId: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  handleSessionExpiration: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSessionExpiredDialog, setShowSessionExpiredDialog] = useState(false);
  const navigation = useNavigation();

  const handleSessionExpiration = useCallback(async () => {
    setShowSessionExpiredDialog(true);
  }, []);

  const handleDialogDismiss = useCallback(async () => {
    setShowSessionExpiredDialog(false);
    await logout();
    navigation.navigate('Login' as never);
  }, [navigation]);

  const checkLoginStatus = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getKey('userToken');
      const sessionId = await getKey('userSessionId');
      if (token && sessionId) {
        const userProfile = await getUserProfile(sessionId);
        setUser(userProfile);
        setAccountId(userProfile.id.toString());
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setAccountId(null);
        setIsLoggedIn(false);
      }
    } catch (error: any) {
      if (error.isSessionExpired) {
        await handleSessionExpiration();
      } else {
        console.error('Error checking login status:', error);
        setUser(null);
        setAccountId(null);
        setIsLoggedIn(false);
      }
    } finally {
      setLoading(false);
    }
  }, [handleSessionExpiration]);

  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  const login = async (username: string, password: string) => {
    clearStorage();
    setLoading(true);
    try {
      const response = await loginAPI(username, password);
      if(response.success){
        const token = response.request_token;
        const sessionId = await getSesionId(token);
        await saveKey('userToken', token);
        await saveKey('userSessionId', sessionId);
        const userProfile = await getUserProfile(sessionId);
        setUser(userProfile);
        setAccountId(userProfile.id.toString());
        setIsLoggedIn(true);
      }
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const sessionId = await getKey('userSessionId');
      if (sessionId) {
        await logoutAPI(sessionId);
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      clearStorage();
      setUser(null);
      setAccountId(null);
      setIsLoggedIn(false);
      setLoading(false);
    }
  };

  const clearStorage = () => {
    removeKey('userToken');
    removeKey('refreshToken');
    removeKey('userSessionId');
    setUser(null);
    setAccountId(null);
    setIsLoggedIn(false);
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, accountId, login, logout, loading, handleSessionExpiration }}>
      {children}
      <SessionExpiredDialog 
        visible={showSessionExpiredDialog} 
        onDismiss={handleDialogDismiss}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);