import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Home from '../Screens/Home';
import Favourites from '../Screens/Favourites';
import Trending from '../Screens/Trending';
import Profile from '../Screens/Profile';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
                let iconName;
                switch (route.name) {
                    case 'Home':
                        iconName = 'home';
                        break;
                    case 'Trending':
                        iconName = 'fire';
                        break;
                    case 'Favourites':
                        iconName = 'heart';
                        break;
                    case 'Profile':
                        iconName = 'user';
                        break;
                    default:
                        iconName = 'circle';
                        break;
                }
                return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#2196F3',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: {
                backgroundColor: '#000',
                borderTopWidth: 0,
            },
        })}
    >
        <Tab.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Tab.Screen name="Favourites" component={Favourites} options={{ headerShown: false }} />
        <Tab.Screen name="Trending" component={Trending} options={{ headerShown: false }} />
        <Tab.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
    </Tab.Navigator>
);

export default BottomTabNavigator;
