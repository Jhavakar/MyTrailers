import React from 'react';
import { Provider } from 'react-redux';
import AppNavigator from './AppNavigator';
import { store } from './src/store/store.js'
import { AuthProvider } from './src/Auth/AuthProvider';


function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </Provider>
  );
}

export default App;
