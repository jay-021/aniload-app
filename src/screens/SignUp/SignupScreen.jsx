import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import * as yup from 'yup';
import axios from '../../Auth/axios';
// import axios from '../../Auth/axios';

const schema = yup.object().shape({
  name: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const SignUp = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = async () => {
    try {
      await schema.validate({ name, email, password }, { abortEarly: false });
      const payload = { name, email, password };

      const response = await axios.post(`/user/signup`, payload)
      if (response.status === 200) {
        handleLogin()
        handleClear()
        setErrors({});
        console.log("Signup successfully")
      }
      console.log(payload);
    } catch (error) {
      if (error.inner) {
        const validationErrors = {};
        error.inner.forEach((e) => {
          validationErrors[e.path] = e.message;
        });
        setErrors(validationErrors);
      } else {
        console.error("API error:", error);
        setErrors({ general: "Failed to sign in. Please try again." });
      }
    } 
  };

  const handleClear = () => {
    setName('')
    setEmail('')
    setPassword('')
    setErrors({})
  }

  const handleLogin = () => {
    navigation.navigate('Login');
    handleClear()
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      {errors.name && <Text style={styles.error}>{errors.name}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      {errors.email && <Text style={styles.error}>{errors.email}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry={true}
      />
      {errors.password && <Text style={styles.error}>{errors.password}</Text>}

      <TouchableOpacity style={styles.signupButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#0F0F0F', // Darker background color for better contrast
  },
  title: {
    fontSize: 28, // Increased font size for title
    marginBottom: 30, // Increased spacing between title and inputs
    color: '#FFFFFF', // Title color set to white
    textAlign: 'center'
  },
  input: {
    height: 50, // Increased input height
    width: '100%',
    borderColor: 'white', // Darker border color
    borderWidth: 1,
    marginBottom: 20, // Increased spacing between inputs
    paddingHorizontal: 15, // Increased padding for inputs
    backgroundColor: 'white', // Darker input background color
    color: 'black', // Text color set to white
    borderRadius: 8, // Rounded corners
  },
  loginButton: {
    backgroundColor: '#1E90FF', // Dark blue color for login button
    paddingVertical: 18, // Increased padding for buttons
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
    width: '100%',
    shadowColor: '#000', // Adding subtle shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5, // For Android shadow
  },
  signupButton: {
    backgroundColor: '#4CAF50', // Dark green color for sign-up button
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15, // Adjusted margin between buttons
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 18, // Increased font size for buttons
    fontWeight: 'bold', // Bold text for better visibility
  },
  error: {
    color: '#FF6347', // Red color for error messages
    marginBottom: 10, // Increased spacing for errors
    textAlign: 'left',
  },
});


export default SignUp;
