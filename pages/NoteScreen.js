import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Button, TouchableOpacity, Text, Image, ScrollView, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function NoteScreen({ route, navigation }) {
  const [noteTitle, setNoteTitle] = useState('');
  const [noteText, setNoteText] = useState('');
  const [noteImage, setNoteImage] = useState(null);
  const [noteDate, setNoteDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(true);
  
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão de localização negada');
        return;
      }
      const location = await Location.getCurrentPositionAsync();
      setSelectedLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });
    })();
  }, []);
  
  const [selectedLocation, setSelectedLocation] = useState(null);
  const handleSaveNote = () => {
    if (noteText || noteImage) {
      console.log('location', selectedLocation);
      console.log('image', noteImage);
      route.params.onSave({ title: noteTitle, text: noteText, image: noteImage, date: noteDate, location: selectedLocation });
      navigation.navigate('Home');
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

  const handleLocationPick = (event) => {
    const coordinate = event.nativeEvent.coordinate;
    setSelectedLocation(coordinate);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerRight: () => (
        <Button title="Salvar" onPress={handleSaveNote} />
      ),
    });
  }, [navigation]);
  //


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Adicionar Nota</Text>
      <Text style={styles.formTitle}>TÍTULO</Text>
      <TextInput
        style={styles.input}
        placeholder=""
        value={noteTitle}
        onChangeText={setNoteTitle}
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
        <TouchableOpacity style={styles.imageButton} onPress={handlePickImage}>
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
      <Button title="Salvar" onPress={handleSaveNote} style={styles.saveButton}/>
      <View style={styles.locationBox}>
       <TouchableOpacity style={styles.locationButton} >
        <Image source={require('../assets/mappin.and.ellipse.png')} style={{width: 25, height: 25, marginRight: 10}}/>
        <Text style={styles.imageButtonText}>Selecione a Localização</Text>
       </TouchableOpacity>
       <MapView
        mapType='satellite'
        style={styles.map}
        showsUserLocation={true}
        minZoomLevel={15}
        initialRegion={{
          latitude: selectedLocation ? selectedLocation.latitude : -26.13300,
          longitude: selectedLocation ? selectedLocation.longitude : -49.80896,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={handleLocationPick} 
      >
        {selectedLocation && <Marker coordinate={selectedLocation} />}
      </MapView>
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
