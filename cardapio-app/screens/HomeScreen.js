import React, { useState, useContext, useCallback, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';


export default function DishListScreen({ navigation }) {
  const [dishes, setDishes] = useState([]);
  const { token, signOut } = useContext(AuthContext);

  useEffect(() => {
    if (!token) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  }, [token]);

  const fetchDishes = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/dishes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar pratos');
      }

      const data = await response.json();
      setDishes(data);
    } catch (error) {
      console.error('Erro ao carregar pratos:', error.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (token) {
        fetchDishes();
      }
    }, [token])
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View style={styles.buttonWrapper}>
        <Button
          title="Deslogar"
          onPress={() => {
            signOut();
            
          }}
          color="red"
        />
      </View>

      <View style={styles.buttonWrapper}>
        <Button
          title="Cadastrar Novo Prato"
          onPress={() => navigation.navigate('CreateDish')}
        />
      </View>

      <FlatList
        data={dishes}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('DishDetails', { id: item.id })}>
            <Text style={{ fontSize: 18, marginVertical: 10 }}>{item.nome}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonWrapper: {
    marginBottom: 12,
  },
});
