import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Button } from 'react-native';

export default function NoteScreen({ route, navigation }) {
  const [noteText, setNoteText] = useState('');

  const handleSaveNote = () => {
    if (noteText) {
      route.params.onSave(noteText);
      navigation.navigate('Home');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter your note..."
        value={noteText}
        onChangeText={setNoteText}
      />
      <Button title="Save Note" onPress={handleSaveNote} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});
