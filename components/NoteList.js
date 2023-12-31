import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DatabaseConnection } from '../database';

const db = DatabaseConnection.getConnection();

const NoteList = ({ notes, loadNotes }) => {
  const navigation = useNavigation();

  const handleNotePress = (note) => {
    navigation.navigate('NoteDetail', {
      id: note.note_id,
      title: note.title,
      text: note.text,
      image: note.image,
      date: note.date,
      location: note.location,
    });
  };

  const deleteNote = (note) => {
    Alert.alert(
      'Excluir Nota',
      'Você tem certeza de que deseja excluir esta nota?',
      [
        {
          text: 'Cancelar',
          style: 'cancel', 
        },
        {
          text: 'Excluir',
          style: 'destructive', 
          onPress: () => {
            db.transaction((tx) => {
              tx.executeSql(
                'DELETE FROM table_note WHERE note_id = ?',
                [note.note_id],
                (tx, results) => {
                  if (results.rowsAffected > 0) {
                    Alert.alert(
                      'Nota Excluída',
                      'A Nota foi excluída com sucesso.'
                    );
                    loadNotes();
                  } else {
                    Alert.alert('Error', 'Failed to delete the note.');
                  }
                }
              );
            });
          },
        },
      ],
      { cancelable: true } 
    );
  };

  const renderListItem = ({ item, index }) => {
    const isFirstItem = index === 0;
    const isLastItem = index === notes.length - 1;

    const listItemStyle = {
      ...styles.listItem,
      borderTopLeftRadius: isFirstItem ? 10 : 0,
      borderTopRightRadius: isFirstItem ? 10 : 0,
      borderBottomLeftRadius: isLastItem ? 10 : 0,
      borderBottomRightRadius: isLastItem ? 10 : 0,
      borderBottomWidth: isLastItem ? 0 : 1,
    };

    return (
      <TouchableOpacity onPress={() => handleNotePress(item)} onLongPress={() => deleteNote(item)}>
        <View style={listItemStyle}>
          <Text style={{fontSize: 17}}>{item.title}</Text>
          <Image source={require('../assets/chevron.right.png')} style={{ width: 20, height: 20 }} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={notes}
      keyExtractor={(item) => item.note_id.toString()}
      renderItem={renderListItem}
      style={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  listItem: {
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#ffffff',
    borderColor: '#F2F2F7',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default NoteList;
