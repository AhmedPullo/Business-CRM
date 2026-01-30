import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingScreen from '../screens/LandingScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ClientsScreen from '../screens/ClientsScreen';
import InvoicesScreen from '../screens/InvoicesScreen';
import DeliveriesScreen from '../screens/DeliveriesScreen';

export type RootStackParamList = {
  Landing: undefined;
  Dashboard: undefined;
  Clients: undefined;
  Invoices: undefined;
  Deliveries: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootStack() {
  return (
    <Stack.Navigator initialRouteName="Landing">
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Clients" component={ClientsScreen} />
      <Stack.Screen name="Invoices" component={InvoicesScreen} />
      <Stack.Screen name="Deliveries" component={DeliveriesScreen} />
    </Stack.Navigator>
  );
}

export default RootStack;
