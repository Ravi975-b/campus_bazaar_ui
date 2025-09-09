import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('campusBazarUser'));
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  const login = (userData) => {

    localStorage.setItem('campusBazarUser', JSON.stringify(userData));
    setCurrentUser(userData);
  };

  const register = (userData) => {

    localStorage.setItem('campusBazarUser', JSON.stringify(userData));
    setCurrentUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('campusBazarUser');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return React.useContext(AuthContext);
};
