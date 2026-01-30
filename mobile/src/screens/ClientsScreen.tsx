import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import { useClients, useCreateClient } from '../hooks/use-clients';

export default function ClientsScreen() {
  const { data: clients, isLoading } = useClients();
  const create = useCreateClient();
  const [name, setName] = useState('');

  const handleCreate = async () => {
    if (!name) return;
    try {
      await create.mutateAsync({ name });
      setName('');
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clients</Text>
      <View style={styles.formRow}>
        <TextInput
          style={styles.input}
          placeholder="New client name"
          value={name}
          onChangeText={setName}
        />
        <Button title="Add" onPress={handleCreate} />
      </View>

      {isLoading ? <Text>Loading...</Text> : (
        <FlatList
          data={clients || []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemTitle}>{item.name}</Text>
              <Text style={styles.itemSub}>{item.email || item.phone || ''}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
  formRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 8, marginRight: 8, borderRadius: 6 },
  item: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  itemTitle: { fontSize: 16, fontWeight: '500' },
  itemSub: { color: '#666' }
});
