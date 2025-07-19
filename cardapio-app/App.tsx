import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthProvider, AuthContext } from './context/AuthContext';

import Login from "./screens/login";
import DishListScreen from './screens/HomeScreen';
import DishDetailsScreen from './screens/DishDetailsScreen';
import CreateDishScreen from './screens/CreateDishScreen';
import EditDishScreen from './screens/EditDishScreen';
import Register from './screens/Register';


const Stack = createNativeStackNavigator();

// Rotas privadas (para usuários autenticados)
function AppStack() {
  return (
    <Stack.Navigator initialRouteName="DishList">
      <Stack.Screen name="DishList" component={DishListScreen} options={{ title: 'Cardápio' }} />
      <Stack.Screen name="DishDetails" component={DishDetailsScreen} options={{ title: 'Detalhes do Prato' }} />
      <Stack.Screen name="CreateDish" component={CreateDishScreen} options={{ title: 'Cadastrar Prato' }} />
      <Stack.Screen name="EditDish" component={EditDishScreen} options={{ title: 'Editar Prato' }} />
    </Stack.Navigator>
  );
}

// Rotas públicas (para quem ainda não está logado)
function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Register" component={Register} options={{ title: 'Cadastro' }} />
      <Stack.Screen name="Login" component={Login} options={{ title: 'Login' }} />
    </Stack.Navigator>
  );
}

// Define qual stack mostrar com base no login
function Routes() {
  const { token, loading } = useContext(AuthContext);

  if (loading) {
    return null; // Pode colocar um <Loading /> aqui
  }

  return (
    <NavigationContainer>
      {token ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}
