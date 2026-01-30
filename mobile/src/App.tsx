import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaView, StatusBar } from 'react-native';
import { RootStack } from './navigation';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar />
          <RootStack />
        </SafeAreaView>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
