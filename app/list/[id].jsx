import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useContext, useLayoutEffect, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet
} from 'react-native';
import {
  Button,
  Card,
  Divider,
  Text,
  TextInput,
} from 'react-native-paper';
import { BillingContext } from '../../context/BillingContext';

export default function ListDetailScreen() {
  const { id } = useLocalSearchParams();
  const { lists, addItemToList } = useContext(BillingContext);
  const list = lists.find((l) => l.id === id);
  const navigation = useNavigation();

  const [item, setItem] = useState({ name: '', price: '', quantity: '' });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: list ? list.title : 'Billing List',
    });
  }, [list, navigation]);

  if (!list) return <Text style={styles.errorText}>List not found</Text>;

  const handleAddItem = () => {
    const newItem = {
      ...item,
      price: parseFloat(item.price),
      quantity: parseInt(item.quantity),
      date: new Date().toISOString(),
    };

    if (!newItem.name || isNaN(newItem.price) || isNaN(newItem.quantity)) {
      alert('Please fill all fields correctly');
      return;
    }

    addItemToList(list.id, newItem);
    setItem({ name: '', price: '', quantity: '' });
  };

  const totalListAmount = list.items.reduce(
    (sum, it) => sum + it.price * it.quantity,
    0
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}> */}
        <Text variant="headlineSmall" style={styles.title}>
          {list.title}
        </Text>

        <TextInput
          label="Item Name"
          value={item.name}
          onChangeText={(t) => setItem({ ...item, name: t })}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Price"
          keyboardType="numeric"
          value={item.price}
          onChangeText={(t) => setItem({ ...item, price: t })}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Quantity"
          keyboardType="numeric"
          value={item.quantity}
          onChangeText={(t) => setItem({ ...item, quantity: t })}
          style={styles.input}
          mode="outlined"
        />
        <Button mode="contained" onPress={handleAddItem} style={styles.button}>
          <Text style={{ color: '#333333' }}>Add Item</Text>
        </Button>

        <Divider style={styles.divider} />

        <Text variant="titleMedium" style={styles.totalText}>
          Total: ₹{totalListAmount.toFixed(2)}
        </Text>
        <ScrollView keyboardShouldPersistTaps="handled">
        <FlatList
          data={list.items}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Content>
                <Text variant="bodyLarge" style={styles.cardText}>
                  {item.name}
                </Text>
                <Text variant="bodySmall" style={styles.cardSubText}>
                  ₹{item.price} × {item.quantity} = ₹
                  {(item.price * item.quantity).toFixed(2)}
                </Text>
                <Text variant="labelSmall" style={styles.cardDate}>
                  {new Date(item.date).toLocaleString()}
                </Text>
              </Card.Content>
            </Card>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyList}>No items added yet.</Text>
          }
          style={{ marginTop: 10 }}
        />
        </ScrollView>
      {/* </ScrollView> */}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    padding: 10,
  },
  input: {
    marginBottom: 10,
    backgroundColor: '#2c2c2c',
  },
  button: {
    marginBottom: 20,
    backgroundColor: '#ffffff'
  },
  divider: {
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#2c2c2c',
    marginBottom: 10,
  },
  cardText: {
    color: '#ffffff',
  },
  cardSubText: {
    color: '#cccccc',
    marginTop: 4,
  },
  cardDate: {
    marginTop: 4,
    opacity: 0.5,
    color: '#aaa',
  },
  title: {
    color: '#ffffff',
    marginBottom: 10,
  },
  totalText: {
    color: '#ffffff',
    marginBottom: 10,
  },
  emptyList: {
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 18,
  },
});
