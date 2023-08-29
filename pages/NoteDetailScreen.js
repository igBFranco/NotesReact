import React from 'react';
import { View, Text } from 'react-native';

export default function NoteDetailScreen({ route }) {
  const { text, id } = route.params;

    return (
      <View>
        <Text>
          {text}
        </Text>
        <Text>
          {id}
        </Text>
      </View>
    );
}
