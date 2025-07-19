import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        if (isTokenExpired(storedToken)) {
          await clearToken();
        } else {
          setToken(storedToken);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar token:', error);
      await clearToken();
    } finally {
      setLoading(false);
    }
  };

  const clearToken = async () => {
    try {
      await AsyncStorage.removeItem('token');
    } catch (error) {
      console.error('Erro ao limpar token:', error);
    }
    setToken(null);
  };

  useEffect(() => {
    loadToken();
  }, []);
  
  const isTokenExpired = (token) => {
    try {
      const [, payloadBase64] = token.split('.');
      const payload = JSON.parse(atob(payloadBase64));
     
      return payload.exp * 1000 < Date.now();
    } catch {
      return true; 
    }
  };

  const signIn = async (newToken) => {
    try {
      await AsyncStorage.setItem('token', newToken);
      setToken(newToken);
    } catch (error) {
      console.error('Erro ao salvar token:', error);
    }
  };

  const signOut = async () => {
    await clearToken();
  };

  return (
    <AuthContext.Provider value={{ token, signIn, signOut, loading, clearToken }}>
      {children}
    </AuthContext.Provider>
  );
};
