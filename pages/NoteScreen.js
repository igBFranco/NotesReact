import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Button, TouchableOpacity, Text, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';


export default function NoteScreen({ route, navigation }) {
  const [noteTitle, setNoteTitle] = useState('');
  const [noteText, setNoteText] = useState('');
  const [noteImage, setNoteImage] = useState(null);
  const [noteDate, setNoteDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(true);

  const handleSaveNote = () => {
    if (noteText || noteImage) {
      route.params.onSave({ title: noteTitle, text: noteText, image: noteImage, date: noteDate });
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

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerRight: () => (
        <Button title="Save Note" onPress={handleSaveNote} />
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
      <View style={styles.locationBox}>
       <TouchableOpacity style={styles.locationButton}>
        <Image source={require('../assets/mappin.and.ellipse.png')} style={{width: 25, height: 25, marginRight: 10}}/>
        <Text style={styles.imageButtonText}>Selecione a Localização</Text>
       </TouchableOpacity>
      </View>
      <Button title="Save Note" onPress={handleSaveNote} />
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
    height: 45,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  locationButton: {
    flexDirection: 'row',
  },
});
