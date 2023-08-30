import React from 'react';
import { View, Text, Image } from 'react-native';

export default function NoteDetailScreen({ route, navigation }) {
  const { title, text, id, image, date } = route.params;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: { title },
    });
  }, [navigation]);

    return (
      <View>
        <Text>
          {title}
        </Text>
        <Text>
          {text}
        </Text>
        <Text>
          {date.toString()}
        </Text>
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      </View>
    );
}
