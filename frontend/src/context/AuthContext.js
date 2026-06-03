import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = process.env.REACT_APP_API_URL || '/api';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('kw_token'));

  axios.defaults.baseURL = API;

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get('/auth/me');
      setUser({ ...data.user, workerProfile: data.workerProfile });
    } catch (error) {
      localStorage.removeItem('kw_token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (phone, password) => {
    const { data } = await axios.post('/auth/login', { phone, password });
    localStorage.setItem('kw_token', data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (formData) => {
    const { data } = await axios.post('/auth/register', formData);
    localStorage.setItem('kw_token', data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('kw_token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
    toast.success('Logout ho gaye! Phir milenge 👋');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
