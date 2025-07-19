import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext'; // importa o contexto

export default function CreateDishScreen({ navigation }) {
  const { token } = useContext(AuthContext); // pega o token
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [categoria, setCategoria] = useState('');
  const [disponivel, setDisponivel] = useState(true);

  const handleSubmit = () => {
    const precoNum = parseFloat(preco);
    if (!nome || !descricao || !categoria || isNaN(precoNum) || precoNum <= 0) {
      Alert.alert('Erro', 'Preencha todos os campos corretamente');
      return;
    }

    fetch('http://localhost:3000/api/dishes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nome, descricao, preco: precoNum, categoria, disponivel }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Erro ao cadastrar prato');
        return res.json();
      })
      .then(() => {
        Alert.alert('Sucesso', 'Prato cadastrado');
        navigation.goBack();
      })
      .catch(err => Alert.alert('Erro', err.message));
  };

  return (
    <View style={styles.container}>
      <Text>Nome:</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} />
      <Text>Descrição:</Text>
      <TextInput style={styles.input} value={descricao} onChangeText={setDescricao} />
      <Text>Preço:</Text>
      <TextInput style={styles.input} value={preco} onChangeText={setPreco} keyboardType="numeric" />
      <Text>Categoria:</Text>
      <TextInput style={styles.input} value={categoria} onChangeText={setCategoria} />
      <Button title="Cadastrar" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 15, padding: 8, borderRadius: 4 },
});
