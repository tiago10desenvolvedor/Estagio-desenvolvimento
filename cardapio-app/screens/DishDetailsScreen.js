import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Button,
  Platform,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useIsFocused } from '@react-navigation/native';

export default function DishDetailsScreen({ route, navigation }) {
  const { id } = route.params;
  const { token, signOut } = useContext(AuthContext);

  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const isFocused = useIsFocused();

  const fetchDish = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/dishes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        showAlert('Sessão expirada', 'Por favor, faça login novamente.');
        signOut();
        navigation.navigate('Login');
        return;
      }

      if (!res.ok) {
        throw new Error('Erro ao buscar prato');
      }

      const data = await res.json();
      setDish(data);
    } catch (error) {
      console.error('Erro ao buscar prato:', error);
      showAlert('Erro', 'Não foi possível carregar os detalhes do prato.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchDish();
    }
  }, [id, isFocused]);

  const showAlert = (title, message) => {
    if (Platform.OS === 'web') {
      alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleDelete = async () => {
    let confirmed = false;

    if (Platform.OS === 'web') {
      confirmed = window.confirm('Tem certeza que deseja deletar este prato?');
    } else {
      confirmed = await new Promise((resolve) => {
        Alert.alert(
          'Confirmar exclusão',
          'Tem certeza que deseja deletar este prato?',
          [
            { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
            { text: 'Deletar', style: 'destructive', onPress: () => resolve(true) },
          ]
        );
      });
    }

    if (!confirmed) return;

    try {
      setUpdating(true);
      const res = await fetch(`http://localhost:3000/api/dishes/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        showAlert('Sessão expirada', 'Por favor, faça login novamente.');
        signOut();
        navigation.navigate('Login');
        return;
      }

      if (!res.ok) {
        throw new Error('Erro ao deletar prato');
      }

      showAlert('Sucesso', 'Prato deletado com sucesso.');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      showAlert('Erro', 'Não foi possível deletar o prato.');
    } finally {
      setUpdating(false);
    }
  };

  const toggleAvailability = async () => {
    if (!dish) return;
    try {
      setUpdating(true);
      const res = await fetch(
        `http://localhost:3000/api/dishes/${id}/disponibilidade`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ disponivel: !dish.disponivel }),
        }
      );

      if (res.status === 401) {
        showAlert('Sessão expirada', 'Por favor, faça login novamente.');
        signOut();
        navigation.navigate('Login');
        return;
      }

      if (!res.ok) {
        throw new Error('Erro ao atualizar disponibilidade');
      }

      const updatedDish = await res.json();
      setDish(updatedDish);
      showAlert(
        'Sucesso',
        `Disponibilidade alterada para: ${updatedDish.disponivel ? 'Sim' : 'Não'}`
      );
    } catch (error) {
      console.error(error);
      showAlert('Erro', 'Não foi possível alterar a disponibilidade.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />
    );

  if (!dish) return <Text>Prato não encontrado</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{dish.nome}</Text>
      <Text>Descrição: {dish.descricao}</Text>
      <Text>Categoria: {dish.categoria}</Text>
      <Text>Preço: R$ {(dish.preco ?? 0).toFixed(2)}</Text>
      <Text>Disponível: {dish.disponivel ? 'Sim' : 'Não'}</Text>

      <View style={styles.buttonsContainer}>
        <Button
          title="Editar"
          onPress={() => navigation.navigate('EditDish', { id })}
          disabled={updating}
        />

        <Button
          title="Deletar"
          onPress={handleDelete}
          color="red"
          disabled={updating}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  buttonsContainer: {
    marginTop: 30,
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 80,
  },
});
