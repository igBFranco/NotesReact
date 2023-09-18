import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DatabaseConnection } from '../database';

const db = DatabaseConnection.getConnection();

const NoteList = ({ notes }) => {
  const navigation = useNavigation(); // Get the navigation object

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

  const renderListItem = ({ item, index }) => {
    const isFirstItem = index === 0;
    const isLastItem = index === notes.length - 1;

    const listItemStyle = {
      ...styles.listItem,
      borderTopLeftRadius: isFirstItem ? 10 : 0,
      borderTopRightRadius: isFirstItem ? 10 : 0,
      borderBottomLeftRadius: isLastItem ? 10 : 0,
      borderBottomRightRadius: isLastItem ? 10 : 0,
    };

    return (
      <TouchableOpacity onPress={() => handleNotePress(item)}>
        <View style={listItemStyle}>
          <Text>{item.title}</Text>
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
    backgroundColor: '#ffffff',
  },
});

export default NoteList;
