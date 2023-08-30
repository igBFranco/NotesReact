import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity , VirtualizedList} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const NoteList = ({ notes }) => {
  const navigation = useNavigation(); // Get the navigation object

  const renderListItem = ({ item, index }) => {
    const handleNotePress = () => {
      navigation.navigate('NoteDetail', { title: item.title, text: item.text, id: item.id, imagem: item.image, date: item.date });
    };

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
      <TouchableOpacity onPress={handleNotePress}>
        <View style={listItemStyle}>
          <Text>{item.title}</Text>
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
