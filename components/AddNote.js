import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';

const AddNote = ({ onSave }) => {
  const [noteText, setNoteText] = useState('');

  const handleSave = () => {
    if (noteText.trim() !== '') {
      onSave(noteText);
      setNoteText('');
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Enter your note"
        value={noteText}
        onChangeText={(text) => setNoteText(text)}
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

export default AddNote;
