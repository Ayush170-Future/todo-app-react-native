import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserCreationScreen from './screens/UserCreation';
import MainNavigator from './navigation/MainNavigator';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('user')
      .then((storedUser) => {
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      })
      .catch((error) => {
        console.error('Error retrieving user from AsyncStorage:', error);
      });
  }, []);

  const handleUserCreation = (userData) => {
    setUser(userData);
  };

  if (!user) {
    return <UserCreationScreen onUserCreation={handleUserCreation} />;
  }

  return <MainNavigator />;
};

export default App;
