import React, { useState } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { TextInput } from 'react-native-paper';
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "../Firebase/firebase-config"

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showError, setShowError] = useState(false);
    const [loading, setLoading] = useState(false);

    const login = async () => {
        if (error !== '') {
            setError('');
        }

        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('Login successful with:', email);

            // Fetch user details from Firestore
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const userDetails = docSnap.data();
                navigation.navigate('Main', { screen: 'Home', params: { userId: user.uid, firstName: userDetails.firstName } }); // Adjusted to pass more details
            } else {
                console.log("User data not found in Firestore.");
                setError('User data not found. Please contact support.');
                setShowError(true);
            }
        } catch (error) {
            console.error(error);

            // Handling specific authentication errors
            if (error.code) {
                if (error.code.includes("auth/user-not-found") || error.code.includes("auth/wrong-password")) {
                    setError("Invalid email or password.");
                } else {
                    setError("Unable to login. Please try again later.");
                }
            } else {
                // Handle the case where error.code is undefined
                setError("An unexpected error occurred. Please try again.");
            }

            setShowError(true);
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>Welcome to</Text>
            <Text style={styles.appName}>My Trailers</Text>
            <TextInput
                label="Email"
                theme={{ colors: { primary: '#2196F3', } }}
                style={styles.input}
                onChangeText={setEmail}
                value={email}
            />
            <TextInput
                label="Password"
                secureTextEntry
                outlineColor='#2196F3'
                theme={{ colors: { primary: '#2196F3', } }}
                style={styles.input}
                onChangeText={setPassword}
                value={password}
            />
            <Pressable style={styles.loginButton} onPress={login}>
                <Text loading={loading} style={styles.loginButtonText}>Log In</Text>
            </Pressable>
            <View style={styles.signUpPrompt}>
                <Text>Don't have an account?</Text>
                <Pressable onPress={() => navigation.navigate('SignUp')}>
                    <Text style={styles.signUpText}>Create one!</Text>
                </Pressable>
            </View>
            {showError && <Text style={styles.errorText}>{error}</Text>}
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
    createTextContainer: {
        flexDirection: "row",
        marginTop: 10
    },
    createButton: {
        marginLeft: 5,
        fontWeight: "bold",
        fontSize: 16
    },
    welcomeText: {
        fontSize: 36,
        marginBottom: 8,
        color: '#333',
    },
    appName: {
        fontSize: 48,
        fontWeight: 'bold',
        marginBottom: 24,
        color: '#2196F3',
    },
    loginButton: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 50,
        alignSelf: 'center',
        width: '100%',
    },
    loginButtonText: {
        color: '#FFF',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    },
    signUpPrompt: {
        flexDirection: 'row',
        marginTop: 16,
    },
    signUpText: {
        fontWeight: 'bold',
        marginLeft: 4,
        color: '#2196F3',

    },
});

export default Login;
