import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { useAuth } from './src/Auth/AuthProvider';
import AuthStack from './src/Navigation/AuthStack';
import AppStack from './src/Navigation/AppStack';


const AppNavigator = () => {
  const { currentUser } = useAuth();

  return (
    <PaperProvider>
      <NavigationContainer>
        {currentUser ? <AppStack /> : <AuthStack />}
      </NavigationContainer>
    </PaperProvider>
  );
};

export default AppNavigator;
