import React, { useState } from 'react';
import { View, StyleSheet, Switch, Text, TouchableOpacity, Image } from 'react-native';

export default function ConfigScreen({ route, navigation }) {

  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
  };

    React.useLayoutEffect(() => {
        navigation.setOptions({
          headerTitle: '', 
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('Info')}>
              <Image source={require('../assets/person.text.rectangle.png')} style={{width: 30, height: 30, marginRight: 20}}/>
            </TouchableOpacity>
          ),
        });
      }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
          Configurações
      </Text>
      <View style={styles.toggleOption}>
          <Text>Bloqueio por Biometria</Text>
          <Switch
          value={isEnabled}
          onValueChange={toggleSwitch}
          />
      </View>
    </View>
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
  },
  toggleOption: {
    marginTop: 10,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
  }
});
