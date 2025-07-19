import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker'; 
import { AuthContext } from '../context/AuthContext';

export default function EditDishScreen({ route, navigation }) {
  const { id } = route.params;
  const { token } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [disponivel, setDisponivel] = useState(true); 
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function fetchDish() {
    try {
      const res = await fetch(`http://localhost:3000/api/dishes/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Erro ao buscar prato');
      const data = await res.json();
      setName(data.nome);
      setDescription(data.descricao);
      setPrice(data.preco.toString());
      setDisponivel(data.disponivel);
    } catch (err) {
      Alert.alert('Erro', err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDish();
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:3000/api/dishes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: name,
          descricao: description,
          preco: parseFloat(price),
          disponivel: disponivel, 
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erro ao salvar prato');
      }

      Alert.alert('Sucesso', 'Prato atualizado!');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Erro', err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <ActivityIndicator size="large" style={styles.loader} />;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome do Prato</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nome"
      />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={description}
        onChangeText={setDescription}
        placeholder="Descrição"
        multiline
      />

      <Text style={styles.label}>Preço</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        placeholder="Preço"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Disponível</Text>
      <Picker
        selectedValue={disponivel ? 'sim' : 'nao'}
        onValueChange={(value) => setDisponivel(value === 'sim')}
        style={styles.input}
      >
        <Picker.Item label="Sim" value="sim" />
        <Picker.Item label="Não" value="nao" />
      </Picker>

      <Button title={saving ? "Salvando..." : "Salvar"} onPress={handleSave} disabled={saving} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
});
