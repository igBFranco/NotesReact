import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Button, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { Spacer } from 'react-native-flex-layout';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import NoteList from './components/NoteList';
import NoteScreen from './pages/NoteScreen'; 
import ConfigScreen from './pages/ConfigScreen';
import Info from './pages/Info';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Note" component={NoteScreen} />
        <Stack.Screen name="Configurações" component={ConfigScreen}/>
        <Stack.Screen name="Info" component={Info} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HomeScreen({ navigation }) {
  const [notes, setNotes] = useState([]);

  const handleAddNote = (text) => {
    const newNote = { id: Date.now(), text };
    setNotes([...notes, newNote]);
    navigation.goBack(); 
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerRight: () => (
        <View style={{display: "flex", flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => navigation.navigate('Note', { onSave: handleAddNote })}>
            <Image source={require('./assets/plus.png')} style={{width: 30, height: 30, marginRight: 20}}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Configurações')}>
            <Image source={require('./assets/gear.png')} style={{width: 30, height: 30, marginRight: 20}}/>
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
        <ScrollView style={styles.view}>
          <Text style={styles.title}>
            Anotações
          </Text>
          <NoteList notes={notes}/>
        </ScrollView>
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
