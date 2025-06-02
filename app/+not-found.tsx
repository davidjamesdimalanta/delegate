import { Link, Stack } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ThemedView 
        style={styles.container}
        lightColor="#F5F5F5"
        darkColor="#000000"
        spacing="md"
        padding="lg"
        margin="none"
        elevation="none"
        borderRadius="none"
      >
        <ThemedText 
          type="title"
          style={{}}
          lightColor="#1C1B1F"
          darkColor="#E6E1E5"
          variant="headlineMedium"
          medicalVariant={null}
        >
          This screen does not exist.
        </ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText 
            type="link"
            style={{}}
            lightColor="#1976D2"
            darkColor="#90CAF9"
            variant="bodyMedium"
            medicalVariant={null}
          >
            Go to home screen!
          </ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
