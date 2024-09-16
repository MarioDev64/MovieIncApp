import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { saveKey, getKey, removeKey } from '../utils/secureStorage';
import { login as loginAPI, logout as logoutAPI, createSession } from '../services/Authentication';
import { getUserProfile } from '../services/Account';
import { useNavigation } from '@react-navigation/native';
import eventEmitter, { EVENT_SESSION_EXPIRED } from '../utils/eventEmitter';
import SessionExpiredDialog from '../components/SessionExpiredDialog';
import { useMovieStore } from '../store/MovieStore';
import { UserProfile } from '../@types';

interface AuthContextData {
  isLoggedIn: boolean;
  isApproving: boolean;
  user: UserProfile | null;
  accountId: string | null;
  sessionId: string | null;
  login: () => Promise<string>;
  logout: () => Promise<void>;
  completeLogin: (requestToken: string) => Promise<void>;
  loading: boolean;
  handleSessionExpiration: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showSessionExpiredDialog, setShowSessionExpiredDialog] = useState<boolean>(false);
  const { loadFavorites, loadRated, clearStore } = useMovieStore();
  const navigation = useNavigation();

  const handleSessionExpiration = useCallback(async () => {
    setShowSessionExpiredDialog(true);
  }, []);

  useEffect(() => {
    const sessionExpiredListener = () => {
      handleSessionExpiration();
    };

    eventEmitter.on(EVENT_SESSION_EXPIRED, sessionExpiredListener);

    return () => {
      eventEmitter.off(EVENT_SESSION_EXPIRED, sessionExpiredListener);
    };
  }, [handleSessionExpiration]);

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
        
        // Load favorites and rated movies
        await loadFavorites(userProfile.id.toString(), storedSessionId);
        await loadRated(userProfile.id.toString(), storedSessionId);
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
  }, [handleSessionExpiration, loadFavorites, loadRated]);

  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  const login = async () => {
    clearStorage();
    setLoading(true);
    try {
      const requestToken = await loginAPI();
      setIsApproving(true);
      return requestToken;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const completeLogin = async (requestToken: string) => {
    setLoading(true);
    try {
      const newSessionId = await createSession(requestToken);
      await saveKey('userSessionId', newSessionId);
      const userProfile = await getUserProfile(newSessionId);
      setUser(userProfile);
      setAccountId(userProfile.id.toString());
      setSessionId(newSessionId);
      setIsLoggedIn(true);
      setIsApproving(false);
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
      clearStore();
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
    <AuthContext.Provider value={{ 
      isLoggedIn,
      isApproving, 
      user, 
      accountId, 
      sessionId, 
      login, 
      logout,
      completeLogin, 
      loading, 
      handleSessionExpiration 
    }}>
      {children}
      <SessionExpiredDialog 
        visible={showSessionExpiredDialog} 
        onDismiss={handleDialogDismiss}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);