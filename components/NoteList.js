import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const NoteList = ({ notes }) => {
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
      <TouchableOpacity>
        <View style={listItemStyle}>
          <Text>{item.text}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={notes}
      keyExtractor={(item) => item.id.toString()}
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
