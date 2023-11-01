import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Button, SafeAreaView, TouchableOpacity, Image, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';  
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import NoteList from './components/NoteList';
import NoteScreen from './pages/NoteScreen'; 
import NoteDetailScreen from './pages/NoteDetailScreen';
import ConfigScreen from './pages/ConfigScreen';
import Info from './pages/Info';
import { StatusBar } from 'expo-status-bar';
import { DatabaseConnection } from './database';
import NoteEditScreen from './pages/NoteEditScreen';
import PerformanceStats from "react-native-performance-stats";

const db = DatabaseConnection.getConnection();
const Stack = createStackNavigator();

export default function App() {
  const [isAuthenticationEnabled, setIsAuthenticationEnabled] = useState(false);
  const [initialRoute, setInitialRoute] = useState('Authentication');

  useEffect(() => {
    loadAuthenticationSetting();
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='table_note'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          //console.log(res.rows.item(0));
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS table_note', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_note (note_id INTEGER PRIMARY KEY AUTOINCREMENT, title VARCHAR(20), text VARCHAR(500), image VARCHAR(500), date VARCHAR(50), location VARCHAR(500))',
              []
            );
          }
        }
      );
    });
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
        <Stack.Screen name="NoteEdit" component={NoteEditScreen} />
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
      return navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
      //return navigation.navigate('Home');
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

  React.useLayoutEffect(() => {
    navigation.setOptions({headerShown: false});
  }, [navigation]);

  return (
    <SafeAreaView style={styles.containerBlocked}>
      <View style={styles.block}>
        <View style={styles.centered}>
            <Image source={require('./assets/lock.png')} style={{width: 50, height: 50}}/>
            <Text style={styles.blockedTitle}>
              Notas Bloqueadas
            </Text>
            <Button title="Entrar" onPress={handleAuthentication}/>
        </View>
      </View>
    </SafeAreaView>
  );
}

function HomeScreen({ navigation }) {
  const [notes, setNotes] = useState([]);
  const isFocused = useIsFocused();

  const loadNotes = async () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM table_note',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          //console.log(temp);
          setNotes(temp);
        }
      );
    });
  };

  useEffect(() => {
    if (isFocused) {
      loadNotes();
    }
  }, [isFocused]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerRight: () => (
        <View style={{display: "flex", flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => navigation.navigate('Note')}>
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
          <NoteList notes={notes} loadNotes={loadNotes}/>
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
    marginBottom: 10,
  },
  blockedTitle: {
    fontSize: 25,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  containerBlocked: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#ffffffff',
  },
  enterButton: {
    borderRadius: 8,
    borderColor: '#000000',
    borderWidth: 1,
    padding: 10,
    marginTop: 20,
  },
  block: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
