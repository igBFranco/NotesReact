import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Button, TouchableOpacity, Text, Image, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { DatabaseConnection } from '../database';
import { set } from 'date-fns';
import { even } from 'react-native-flex-layout';

const db = DatabaseConnection.getConnection();


export default function NoteEditScreen({ route, navigation }) {
  const { title, text, image, date, location, noteId } = route.params;

  const [noteTitle, setNoteTitle] = useState('');
  const [noteText, setNoteText] = useState('');
  const [noteImage, setNoteImage] = useState('');
  const [noteDate, setNoteDate] = useState(new Date());
  const [selectedLocation, setSelectedLocation] = useState();
  const [showDatePicker, setShowDatePicker] = useState(true);
  const [currentLocation, setCurrentLocation] = useState('');


  const locationFromString = location
    ? {
        latitude: parseFloat(location.split(',')[0]),
        longitude: parseFloat(location.split(',')[1]),
      }
    : null;

  const dateFromString = date 
    ? new Date(date) 
    : new Date();
  
  useEffect(() => {
    updateAllStates(title, text, image, dateFromString, locationFromString);

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão de localização negada');
        return;
      }
      const location = await Location.getCurrentPositionAsync();
      setCurrentLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });
    })();
  }, []);

  let updateAllStates = (title, text, image, date, location) => {
    setNoteTitle(title);
    setNoteText(text);
    setNoteImage(image);
    setNoteDate(dateFromString);
    setSelectedLocation(locationFromString);
  };

  const handleSaveNote = () => {
    if (noteText || noteImage) {
     console.log(noteDate);
     console.log(noteTitle);
     console.log(image);

      const locationString = selectedLocation
      ? `${selectedLocation.latitude},${selectedLocation.longitude}`
      : '';

      db.transaction(function (tx) {
        tx.executeSql(
          'UPDATE table_note SET title=?, text=?, image=?, date=?, location=? WHERE note_id=?',
          [noteTitle, noteText, noteImage, noteDate.toString(), locationString, noteId],
          function (tx, results) {
            if (results.rowsAffected > 0) {
              Alert.alert(
                'Success!',
                'Note updated successfully!',
                [
                  {
                    text: 'Ok',
                    onPress: () => navigation.navigate('Home'),
                  },
                ],
                { cancelable: false }
              );
            } else {
              console.error('Error: No rows affected during update.');
              alert('Error while trying to update the note!');
            }
          },
          function (tx, error) {
            console.error('Error executing SQL:', error);
            alert('Error while trying to update the note!');
          }
        );
      });
    }
  };

  const handleDatePicker = (event, selectedDate) => {
    const currentDate = selectedDate || noteDate;
    setShowDatePicker(false);
    setNoteDate(currentDate);
  };  

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (result.assets.length > 0) {
        const selectedImage = result.assets[0];
        setNoteImage(selectedImage.uri);
      }
    }
  };

  const handleCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (result.assets.length > 0) {
        const selectedImage = result.assets[0];
        setNoteImage(selectedImage.uri);
      }
    }
  };

  const handleLocationPick = (event) => {
    const coordinate = event.nativeEvent.coordinate;
    setSelectedLocation(coordinate);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerRight: () => (
        <Button title="Salvar" onPress={() => handleSaveNote()} />
      ),
    });
  }, [navigation]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.titleBox}>
        <Text style={styles.title}>Editar Nota</Text>
        <Button title="Salvar" onPress={() => handleSaveNote()} />
      </View>
      <Text style={styles.formTitle}>TÍTULO</Text>
      <TextInput
        style={styles.input}
        placeholder=""
        value={noteTitle}
        onChangeText={
          (noteTitle) => setNoteTitle(noteTitle)
        }
      />
      <Text style={styles.formTitle}>CONTEÚDO</Text>
      <TextInput
        style={styles.input}
        placeholder=""
        value={noteText}
        onChangeText={setNoteText}
      />
      <Text style={styles.formTitle}>DATA</Text>
      <View style={styles.dateBox}>
          <DateTimePicker
            style={styles.input}
            value={noteDate}
            mode="datetime"
            display="default"
            onChange={handleDatePicker}
          />
      </View>
      <Text style={styles.formTitle}>IMAGEM</Text>
      <View style={styles.imageBox}>
        <TouchableOpacity style={styles.imageButton} onPress={handleCamera}>
          <Image source={require('../assets/camera.png')} style={{width: 25, height: 25, marginRight: 10}}/>
          <Text style={styles.imageButtonText}>Abrir Câmera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.imageButton} onPress={handlePickImage}>
          <Image source={require('../assets/camera.on.rectangle.png')} style={{width: 25, height: 25,  marginRight: 10}}/>
          <Text style={styles.imageButtonText}>Escolher Imagem</Text>
        </TouchableOpacity>
        {noteImage && <Image source={{ uri: noteImage }} style={styles.image} />}
      </View>
      <Text style={styles.formTitle}>LOCALIZAÇÃO </Text>
      <View style={styles.locationBox}>
       <TouchableOpacity style={styles.locationButton} >
        <Image source={require('../assets/mappin.and.ellipse.png')} style={{width: 25, height: 25, marginRight: 10}}/>
        <Text style={styles.imageButtonText}>Selecione a Localização</Text>
       </TouchableOpacity>
       {location ? <MapView
        mapType='satellite'
        style={styles.map}
        showsUserLocation={true}
        minZoomLevel={15}
        initialRegion={{
          // latitude: selectedLocation ? selectedLocation.latitude : -26.13300,
          // longitude: selectedLocation ? selectedLocation.longitude : -49.80896,
          latitude: selectedLocation ? selectedLocation.latitude : parseFloat(location.split(',')[0]),
          longitude: selectedLocation ? selectedLocation.longitude : parseFloat(location.split(',')[1]),
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={handleLocationPick} 
        >
        {selectedLocation && <Marker coordinate={selectedLocation} />}
        </MapView> 
        : 
        <MapView
          mapType='satellite'
          style={styles.map}
          showsUserLocation={true}
          minZoomLevel={15}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={handleLocationPick} 
        >
          {selectedLocation && <Marker coordinate={selectedLocation} />}
        </MapView>
      }
      </View>
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F2F2F7',
  },
  titleBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',

  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formTitle: {
    color: '#8E8E93',
    paddingBottom: 10,
    paddingLeft: 10
  },
  input: {
    height: 45,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    paddingLeft: 10
  },
  dateBox: {
    height: 45,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
  },
  imageBox: {
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 12,
  },
  imageButton: {
    paddingVertical: 12,
    flexDirection: 'row',
  },
  imageButtonText: {
    color: '#007AFF',
    fontSize: 17,
  },
  locationBox: {
    height: 250,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  locationButton: {
    flexDirection: 'row',
  },
  map: {
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  saveButton: {
    marginBottom: 20
  }
});
