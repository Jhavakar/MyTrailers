import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import Movie from '../Screens/Movie';
import Search from '../Screens/Search';
import LatestMovies from '../Screens/LatestMovies';
import ViewAll from '../Screens/ViewAll';
import VideoPlayer from '../Components/VideoPlayer';

const Stack = createNativeStackNavigator();

const AppStack = () => (
    <Stack.Navigator initialRouteName="Main">
        <Stack.Screen name="Main" component={BottomTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Movie" component={Movie} options={{ headerShown: false }} />
        <Stack.Screen name="Search" component={Search} options={{ headerShown: false }} />
        <Stack.Screen name="LatestMovies" component={LatestMovies} options={{ headerShown: false }} />
        <Stack.Screen name="ViewAll" component={ViewAll} options={{ headerShown: false }} />
        <Stack.Screen name="VideoPlayer" component={VideoPlayer} options={{ headerShown: false }} />
    </Stack.Navigator>
);

export default AppStack;
