import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Landing'>;

export default function LandingScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Business CRM — Mobile (Dev mode)</Text>
      <Button title="Open Dashboard" onPress={() => navigation.navigate('Dashboard')} />
      <View style={{ height: 8 }} />
      <Button title="Clients" onPress={() => navigation.navigate('Clients')} />
      <View style={{ height: 8 }} />
      <Button title="Invoices" onPress={() => navigation.navigate('Invoices')} />
      <View style={{ height: 8 }} />
      <Button title="Deliveries" onPress={() => navigation.navigate('Deliveries')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
});
