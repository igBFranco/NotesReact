import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Button, SafeAreaView, TouchableOpacity, Image, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';  
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { Spacer } from 'react-native-flex-layout';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import NoteList from './components/NoteList';
import NoteScreen from './pages/NoteScreen'; 
import NoteDetailScreen from './pages/NoteDetailScreen';
import ConfigScreen from './pages/ConfigScreen';
import Info from './pages/Info';
import { StatusBar } from 'expo-status-bar';

const Stack = createStackNavigator();

export default function App() {
  const [isAuthenticationEnabled, setIsAuthenticationEnabled] = useState(false);
  const [initialRoute, setInitialRoute] = useState('Authentication');

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


  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="Authentication">
          {props => (
          <AuthenticationScreen
          {...props}
          isAuthenticationEnabled={isAuthenticationEnabled}
          setIsAuthenticationEnabled={setIsAuthenticationEnabled}
        />
          )}
        </Stack.Screen>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Note" component={NoteScreen} />
        <Stack.Screen name="Configurações" component={ConfigScreen}/>
        <Stack.Screen name="Info" component={Info} />
        <Stack.Screen name="NoteDetail" component={NoteDetailScreen} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

function AuthenticationScreen({ navigation, isAuthenticationEnabled }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  async function verifyAvailableAuthentication() {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    //console.log(compatible);

    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    //console.log(types.map(type => LocalAuthentication.AuthenticationType[type]));
}

  useEffect(() => {
    verifyAvailableAuthentication();
  },[]);

  async function handleAuthentication() {
    const isBiometricEnrolled = await LocalAuthentication.isEnrolledAsync();
    console.log(isBiometricEnrolled);

    if (!isBiometricEnrolled) {
      return Alert.alert('Login', 'Biometria não cadastrada');
    }

    if (!isAuthenticationEnabled) {
      return navigation.navigate('Home');
    } 

    const auth = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Autenticação necessária',
      cancelLabel: 'Cancelar',
      fallbackLabel: 'Biometria Não Reconhecida',
    });

    if (auth.success) {
      if (isAuthenticationEnabled) {
        setIsAuthenticated(true);
        navigation.navigate('Home');
      } else {
        setIsAuthenticated(true);
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.toolbar}>
        <View style={styles.toolbarContent}>
            <ScrollView style={styles.view}>
              <Button title="entrar" onPress={handleAuthentication} />
            </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

function HomeScreen({ navigation }) {
  const [notes, setNotes] = useState([]);

  const loadNotes = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem('notes');
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleAddNote = async (note) => {
  const newNote = { 
    id: Date.now(), ...note}; // Include image in the note
  const updatedNotes = [...notes, newNote];
  setNotes(updatedNotes);

  try {
    await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
  } catch (error) {
    console.error('Error saving notes:', error);
  }

    //navigation.goBack();
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerRight: () => (
        <View style={{display: "flex", flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => navigation.navigate('Note', { onSave: handleAddNote })}>
            <Image source={require('./assets/plus.png')} style={{width: 30, height: 30, marginRight: 16}}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Configurações')}>
            <Image source={require('./assets/gear.png')} style={{width: 30, height: 30, marginRight: 16}}/>
          </TouchableOpacity>
        </View>
      ),
      headerLeft: () => (
        <Button title="Editar" onPress={() => {}} style={styles.editButton}/>      
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.toolbar}>
        <View style={styles.toolbarContent}>         
        </View>
        <View style={styles.view}>
          <Text style={styles.title}>
            Anotações
          </Text>
          <NoteList notes={notes}/>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#F2F2F7',
  },
  toolbar: {
    padding: 0,
  },
  toolbarContent: {
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10
  },
  editButton: {
    marginLeft: 16,
  },
  configButton: {
    
  },
  view: {
    padding: 20
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
  }
});
