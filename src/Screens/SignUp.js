import React, { useState } from "react"
import { createUserWithEmailAndPassword } from "@firebase/auth"
import { View, Text, StyleSheet, Pressable } from "react-native"
import { Button, Dialog, Paragraph, Portal, TextInput } from "react-native-paper"
import { auth, db } from "../Firebase/firebase-config"
import { setDoc, doc } from "firebase/firestore"

const Signup = ({ navigation }) => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [showError, setShowError] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSignUp = async () => {
    if (error !== "") {
      setError("")
      setShowError(true)
    }

    if (password !== confirmPassword) {
      setError("Please make sure your passwords match.")
      setShowError(true);
      return;
    }

    if (firstName.trim().length === 0) { 
      setError("Please enter your first name.")
      setShowError(true);
      return;
    }

    if (lastName.trim().length === 0) {
      setError("Please enter your last name.")
      setShowError(true);
      return;
    }

    setLoading(true);
    setError("");
    setShowError(false);


    try {
      // Create user with email and password
      const newUser = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User created successfully:", newUser);
    
      await setDoc(doc(db, "users", newUser.user.uid), {
        firstName: firstName, 
        lastName: lastName,
        email: email,
        favourites: [],
        favouritesCount: 0
      });
      console.log("User data set in database successfully");

      navigation.navigate('Main', { screen: 'Home', params: { userId: newUser.user.uid } });
    } catch (error) {
      if (error.code) {
        if (error.code.includes("auth/weak-password")) {
          setError("Password must be at least 6 characters long.");
        } else if (error.code.includes("auth/email-already-in-use")) {
          setError("Email is already in use.");
        } else {
          setError("Unable to register. Please try again later.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    
      setShowError(true);
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Portal>
          <Dialog visible={showError} onDismiss={() => setShowError(false)}>
            <Dialog.Title>Error</Dialog.Title>
            <Dialog.Content>
              <Paragraph>{error}</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setShowError(false)}>Okay</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
    <View>
        <Text style={styles.createText}>Create </Text>
        <Text style={styles.accountText}>Account</Text>
      </View>
      <View style={styles.inputRow}>
      <TextInput
          label="First Name"
          value={firstName} 
          onChangeText={text => setFirstName(text)}
          theme={{ colors: { primary: '#2196F3', } }}
          style={styles.inputHalf}
        />
        <TextInput
          label="Last Name"
          value={lastName}
          onChangeText={text => setLastName(text)}
          theme={{ colors: { primary: '#2196F3', } }}
          style={styles.inputHalf1}
        />
      </View>
        <TextInput
          label="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          theme={{ colors: { primary: '#2196F3', } }}
          style={styles.input}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          secureTextEntry
          theme={{ colors: { primary: '#2196F3', } }}      
          style={styles.input}
        />
        <TextInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={text => setConfirmPassword(text)}
          secureTextEntry
          theme={{ colors: { primary: '#2196F3', } }}
          style={styles.input}
        />
      <Pressable style={styles.signupButton} onPress={handleSignUp}>
        <Text loading={loading}  style={styles.signupButtonText}>Sign Up</Text>
      </Pressable>
      <View style={styles.createTextContainer}>
          <Text style={{ fontSize: 16 }}>Already have an account?</Text>
          <Pressable onPress={() => navigation.navigate("Login")}>
            <Text style={styles.createButton}>Log In!</Text>
          </Pressable>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    backgroundColor: '#333',
    marginBottom: 20,
  },
    inputHalf: {
    flex: 1, 
    backgroundColor: '#333',
    marginRight: 10,
  },
  inputHalf1: {
    flex: 1,
    backgroundColor: '#333',
  },
  accountText: {
      fontSize: 48,
      fontWeight: 'bold',
      marginBottom: 24,
      color: '#2196F3',
    },
  createText: {
      fontSize: 36,
      marginBottom: 8,
      color: '#333',
    },
  createTextContainer: {
    flexDirection: 'row',
    marginTop: 10
  },
  createButton: {
    marginLeft: 5,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2196F3'
  },   
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  }, 
  signupButton: {
      backgroundColor: '#2196F3', 
      padding: 10,
      borderRadius: 50,
      alignSelf: 'center',
      width: '100%',
    },
    signupButtonText: {
      color: '#FFF', 
      textAlign: 'center',
      fontSize: 20,
      fontWeight: 'bold',
    },
});

export default Signup;