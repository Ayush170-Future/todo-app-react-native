import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const UserCreationScreen = ({ onUserCreation }) => {
  // state variables for name, email, profileUrl
  const [name, setName] = useState(''); 
  const [email, setEmail] = useState('');
  const [profileUrl, setProfileUrl] = useState('');

  // Function to handle user creation
  const handleUserCreation = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check if the name is not empty
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    // Check if the email is not empty and matches the email format
    if (!email.trim() || !emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Store the user data in AsyncStorage
    AsyncStorage.setItem('user', JSON.stringify({ name, email, profileUrl }))
      .then(() => {
        // If data is stored successfully, invoke the onUserCreation callback with user data
        onUserCreation({ name, email, profileUrl });
      })
      .catch((error) => {
        console.error('Error saving user to AsyncStorage:', error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create User</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        keyboardType="email-address"
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your profile URL"
        onChangeText={(text) => setProfileUrl(text)}
      />
      <TouchableOpacity style={styles.button} onPress={handleUserCreation}>
        <Text style={styles.buttonText}>Create User</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: windowWidth * 0.1,
    backgroundColor: "#edf1ff",
  },
  title: {
    fontSize: windowWidth * 0.1,
    marginBottom: windowHeight * 0.05,
    fontWeight: 'bold',
  },
  input: {
    height: windowHeight * 0.05,
    borderColor: 'black',
    borderBottomWidth: 1,
    marginBottom: windowHeight * 0.04,
    width: '100%',
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#98d86b",
    padding: windowWidth * 0.03,
    marginHorizontal: windowWidth * 0.05,
    marginVertical: windowHeight * 0.04,
    borderRadius: windowWidth * 0.03,
    elevation: 5,
    borderWidth: 1,
    borderColor: "black",
    shadowColor: "rgba(0, 0, 0, 0.75)",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: windowWidth * 0.012,
  },
  buttonText: {
    color: "#FFF",
    fontSize: windowWidth * 0.06,
  },
});

export default UserCreationScreen;
