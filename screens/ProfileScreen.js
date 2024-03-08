import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const test_dp = require("../assets/test_dp.png");

const ProfileScreen = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user from AsyncStorage
    const getUserFromStorage = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error fetching user from AsyncStorage:', error);
      }
    };
    getUserFromStorage();
  }, []);

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <View style={styles.profileContainer}>
            {user.profileImageUrl ? (
              <Image source={{ uri: user.profileImageUrl }} style={styles.profileImage} />
            ) : (
              <Image source={test_dp} style={styles.profileImage} />
            )}
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </>
      ) : (
        <Text>No user data available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#98d86b",
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 17
  },
  userEmail: {
    fontSize: 18,
    color: 'gray',
    marginTop: 12
  },
});

export default ProfileScreen;
