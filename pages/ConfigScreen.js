import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Switch, Text, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

export default function ConfigScreen({ route, navigation }) {
  const [isAuthenticationEnabled, setIsAuthenticationEnabled] = useState(false);

  useEffect(() => {
    loadAuthenticationSetting();
  }, []);

  const loadAuthenticationSetting = async () => {
    try {
      const storedValue = await AsyncStorage.getItem('authenticationEnabled');
      if (storedValue !== null) {
        setIsAuthenticationEnabled(JSON.parse(storedValue));
      }
    } catch (error) {
      console.error('Error loading authentication setting:', error);
    }
  };

  const toggleAuthentication = async () => {
    if (isAuthenticationEnabled) {
      const authResult = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to disable biometric lock',
      });

      if (authResult.success) {
        setIsAuthenticationEnabled(!isAuthenticationEnabled);
        saveAuthenticationSetting(!isAuthenticationEnabled);
      }
    } else {
      setIsAuthenticationEnabled(!isAuthenticationEnabled);
      saveAuthenticationSetting(!isAuthenticationEnabled);
    }
  };

  const saveAuthenticationSetting = async (value) => {
    try {
      await AsyncStorage.setItem('authenticationEnabled', JSON.stringify(value));
    } catch (error) {
      console.error('Error saving authentication setting:', error);
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerRight: () => (
        <View>
          <TouchableOpacity onPress={() => navigation.navigate('Info')}>
            <Image
              source={require('../assets/person.text.rectangle.png')}
              style={{ width: 30, height: 30, marginRight: 20 }}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>
      <View style={styles.toggleOption}>
        <Text>Bloqueio por Biometria</Text>
        <Switch value={isAuthenticationEnabled} onValueChange={toggleAuthentication} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F2F2F7',
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
  },
  toggleOption: {
    marginTop: 10,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
