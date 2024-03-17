import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Image, Pressable, Modal, FlatList, SafeAreaView, ScrollView } from 'react-native';
import { useAuth } from '../Auth/AuthProvider';
import { db } from "../Firebase/firebase-config";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigation } from '@react-navigation/native';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import Icon from 'react-native-vector-icons/FontAwesome5';

const AVATARS = [
    'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
    'https://cdn.pixabay.com/photo/2016/12/13/21/20/alien-1905155_1280.png',
    'https://cdn.pixabay.com/photo/2022/08/25/04/48/geometric-art-7409280_1280.png',
    'https://cdn.pixabay.com/photo/2013/07/12/18/35/alien-153542_1280.png',
    'https://cdn.pixabay.com/photo/2017/02/01/11/17/alien-2029727_1280.png',
    'https://cdn.pixabay.com/photo/2017/02/20/23/12/colorful-background-2084164_1280.jpg',
];

const Profile = () => {
    const { currentUser, logout } = useAuth();
    const [userDetails, setUserDetails] = useState(null);
    const [profilePic, setProfilePic] = useState(AVATARS[0]);
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();
    const [newPassword, setNewPassword] = useState('');
    const [confirmUpdateModalVisible, setConfirmUpdateModalVisible] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [isEditingPassword, setIsEditingPassword] = useState(false);


    
    useEffect(() => {
        fetchUserData();
    }, [currentUser]);

    const fetchUserData = async () => {
        if (currentUser) {
            const docRef = doc(db, "users", currentUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setUserDetails(docSnap.data());
                setProfilePic(docSnap.data().profilePicture || AVATARS[0]);
            } else {
                console.log("No such document!");
            }
        }
    };

    const selectProfilePicture = async (url) => {
        setProfilePic(url);
        setModalVisible(false);

        const userRef = doc(db, "users", currentUser.uid);
        await setDoc(userRef, { profilePicture: url }, { merge: true });
    };

    const renderAvatarItem = ({ item }) => (
        <Pressable onPress={() => selectProfilePicture(item)}>
            <Image source={{ uri: item }} style={styles.avatar} />
        </Pressable>
    );

    // Function to re-authenticate the user
    const reauthenticate = async (currentPassword) => {
        const user = currentUser; // The current user object
        const credential = EmailAuthProvider.credential(
            user.email, 
            currentPassword 
        );
        console.log('Current Password:', currentPassword); 
    
        if (!currentPassword) {
            console.error('Missing current password.');
            return false;
        }
    
        try {
            await reauthenticateWithCredential(user, credential);
            console.log('Re-authentication successful.');
            return true;
        } catch (error) {
            console.error('Error during re-authentication:', error);
            return false;
        }
    };
    
    const handleUpdatePassword = async () => {
        if (!currentUser || !currentPassword || !newPassword) {
            console.log('No user logged in, current password is not provided, or new password is empty.');
            return;
        }
    
        if (newPassword.length < 6) {
            console.log('Password must be at least 6 characters.');
            return;
        }
    
        const isAuthenticated = await reauthenticate(currentPassword);
        if (!isAuthenticated) {
            console.log('Re-authentication failed. Cannot update password.');
            return;
        }
    
        try {
            // Use Firebase's updatePassword function to update the user's password.
            await updatePassword(currentUser, newPassword);
            console.log('Password updated successfully');
    
            setNewPassword('');
            setCurrentPassword('');
    
        } catch (error) {
            console.error("Error updating password:", error);
        }
    };
    
      const handleConfirmUpdates = async () => {
        setConfirmUpdateModalVisible(true);
      };

      const proceedWithUpdate = async () => {
        // Your existing update logic here...
        if (isEditingPassword && newPassword) {
            await handleUpdatePassword();
        }
    
        // After updating, reset the states to exit edit mode and clear password fields
        setIsEditingPassword(false); // Stops the editing mode for the password
        setCurrentPassword(''); // Clears the current password input
        setNewPassword(''); // Clears the new password input
        setConfirmUpdateModalVisible(false); // Close the confirmation modal
    };
    

    const cancelUpdate = () => {
        setConfirmUpdateModalVisible(false);
    };

    const handleLogout = async () => {
        try {
            await logout();
            console.log('Logout successful with:', currentUser);
            navigation.navigate('Login');
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#333' }}>
            <ScrollView>
            <View style={styles.centeredTitle}>
                <Text style={styles.title}>Profile</Text>
                <Pressable onPress={() => setIsEditingPassword(!isEditingPassword)}>
                    <Icon name="edit" size={25} color="#FFF" style={styles.icon} />
                </Pressable>
            </View>
            <View style={styles.container}>
                <View style={styles.profilePicContainer}>
                    <Image source={{ uri: profilePic }} style={styles.profilePic} />
                    <Pressable onPress={() => setModalVisible(true)}>
                        <Text style={styles.changePicText}>Change Picture</Text>
                    </Pressable>
                </View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(!modalVisible)}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <FlatList
                                data={AVATARS}
                                renderItem={renderAvatarItem}
                                keyExtractor={(item, index) => index.toString()}
                                numColumns={3} // Set 3 items per row
                            />
                            <Button style={styles.logout} title="Close" onPress={() => setModalVisible(false)} />
                        </View>
                    </View>
                </Modal>

                {userDetails && (
                <View style={styles.detailView}>
                    <Text style={styles.detailsLabel}>First Name:</Text>
                    <Text style={styles.detailsRow}>{userDetails.firstName}</Text>
                    <Text style={styles.detailsLabel}>Last Name:</Text>
                    <Text style={styles.detailsRow}>{userDetails.lastName}</Text>
                    <Text style={styles.detailsLabel}>Email:</Text>
                    <Text style={styles.detailsRow}>{userDetails.email}</Text>
                    <Text style={styles.detailsLabel}>Password:</Text>
                    {isEditingPassword ? (
                        <>
                            <TextInput
                                style={styles.detailsRow}
                                onChangeText={setNewPassword}
                                value={newPassword}
                                placeholder="New password"
                                secureTextEntry={true}
                            />
                            <TextInput
                                secureTextEntry={true}
                                style={styles.detailsRow}
                                placeholder="Current password"
                                onChangeText={setCurrentPassword}
                                value={currentPassword}
                            />
                            {(isEditingPassword) && (
                        <Button title="Confirm" onPress={handleConfirmUpdates} />
                    )}
                    <Button title="Cancel" onPress={() => {
                        setIsEditingPassword(false);
                        setNewPassword(''); // Clear the newPassword input
                        setCurrentPassword(''); // Clear the currentPassword input
                    }} />
                        </>
                    ) : (
                        <Text style={styles.detailsRow}>{'••••••'}</Text> // For security, don't display the real password
                    )}
                    <View>
                    
                    <Pressable onPress={() => setIsEditingPassword(true)} style={styles.detailsLabel}>
                    <Icon name="edit" size={25} color="#FFF" style={styles.icon}/>
                    </Pressable>
                    </View>
                </View>                    
                )}

                {/* Confirmation Modal */}
                <Modal
                        animationType="slide"
                        transparent={true}
                        visible={confirmUpdateModalVisible}
                        onRequestClose={() => setConfirmUpdateModalVisible(false)}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                {/* Your questions and information */}
                                <Text>Are you sure you want to update your details?</Text>
                                {/* For demonstration, add your specific questions here */}
                                
                                {/* Confirm and Cancel Buttons */}
                                <Button title="Confirm" onPress={proceedWithUpdate} />
                                <Button title="Cancel" onPress={cancelUpdate} />
                            </View>
                        </View>
                    </Modal>
                
                
                <Pressable style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </Pressable>
            </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#333',
    },
    profilePicContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    profilePic: {
        width: 180,
        height: 180,
        borderRadius: 90,
    },
    centeredTitle: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        marginTop: 10,
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        alignItems: "center",
        width: '90%',
        shadowOpacity: 60,
        borderRadius: 20,
    },
    avatarPressable: {
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        margin: 10,
    },
    detailView: {
        alignSelf: 'flex-start',
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 50
    },
    detailsRow: {
        flexDirection: 'row',
        marginBottom: 10,
        padding: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: '#FFF',
        fontSize: 18,
    },
    detailsLabel: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    detailsValue: {
        color: '#FFF',
        fontSize: 18,
        marginLeft: 10,
    },
    changePicText: {
        color: '#2196F3',
        fontSize: 16,
        marginVertical: 8,
    },
    logoutButton: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 50,
        alignSelf: 'center',
        width: '40%',
        height: '7%',
    },
    logoutButtonText: {
        color: '#FFF',
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
    },
});


export default Profile;
