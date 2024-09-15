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
  sessionId: string | null;
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
  const [sessionId, setSessionId] = useState<string | null>(null);
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
      const storedSessionId = await getKey('userSessionId');
      if (token && storedSessionId) {
        const userProfile = await getUserProfile(storedSessionId);
        setUser(userProfile);
        setAccountId(userProfile.id.toString());
        setSessionId(storedSessionId);
        setIsLoggedIn(true);
      } else {
        clearStorage();
      }
    } catch (error: any) {
      if (error.isSessionExpired) {
        await handleSessionExpiration();
      } else {
        console.error('Error checking login status:', error);
        clearStorage();
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
        const newSessionId = await getSesionId(token);
        await saveKey('userToken', token);
        await saveKey('userSessionId', newSessionId);
        const userProfile = await getUserProfile(newSessionId);
        setUser(userProfile);
        setAccountId(userProfile.id.toString());
        setSessionId(newSessionId);
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
      if (sessionId) {
        await logoutAPI(sessionId);
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      clearStorage();
    }
  };

  const clearStorage = () => {
    removeKey('userToken');
    removeKey('refreshToken');
    removeKey('userSessionId');
    setUser(null);
    setAccountId(null);
    setSessionId(null);
    setIsLoggedIn(false);
    setLoading(false);
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, accountId, sessionId, login, logout, loading, handleSessionExpiration }}>
      {children}
      <SessionExpiredDialog 
        visible={showSessionExpiredDialog} 
        onDismiss={handleDialogDismiss}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);