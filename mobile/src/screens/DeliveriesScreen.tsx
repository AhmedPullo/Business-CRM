import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DeliveriesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deliveries</Text>
      <Text>Manage deliveries here (dev-mode).</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
});
