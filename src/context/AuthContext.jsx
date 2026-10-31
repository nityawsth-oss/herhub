import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('herhub_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('herhub_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('herhub_user');
    }
  }, [user]);

  const login = (emailOrPhone, password) => {
    // Demo verification
    const newUser = {
      name: emailOrPhone.includes('@') ? emailOrPhone.split('@')[0].toUpperCase() : 'Neha Patel',
      email: emailOrPhone.includes('@') ? emailOrPhone : 'neha.patel@safeher.org',
      phone: !emailOrPhone.includes('@') ? emailOrPhone : '+91 75240 72395',
      emergencyContactName: 'Maa (Emergency Guardian)',
      emergencyContactPhone: '+91 98111 22334',
      avatarInitial: emailOrPhone.charAt(0).toUpperCase() || 'N',
      loginTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      safetyPIN: '112'
    };
    setUser(newUser);
    setAuthModalOpen(false);
    return { success: true };
  };

  const signup = ({ name, email, phone, emergencyContactName, emergencyContactPhone, password }) => {
    const newUser = {
      name: name || 'Neha Patel',
      email: email || 'neha.patel@safeher.org',
      phone: phone || '+91 75240 72395',
      emergencyContactName: emergencyContactName || 'Mom',
      emergencyContactPhone: emergencyContactPhone || '+91 98111 22334',
      avatarInitial: (name || 'N').charAt(0).toUpperCase(),
      loginTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      safetyPIN: '112'
    };
    setUser(newUser);
    setAuthModalOpen(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const openAuthModal = () => setAuthModalOpen(true);
  const closeAuthModal = () => setAuthModalOpen(false);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoggedIn: Boolean(user), 
        login, 
        signup, 
        logout, 
        authModalOpen, 
        openAuthModal, 
        closeAuthModal 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
