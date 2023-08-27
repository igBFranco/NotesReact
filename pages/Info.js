import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

export default function Info({ route, navigation }) {

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '', 
    });
  }, [navigation]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Informações
            </Text>
            <View style={styles.content}>
                <Text style={styles.secondary}>Aplicativo desenvolvido utilizando React Native e SQLite, por Igor Bueno Franco como Trabalho de Conclusão de Curso de Engenharia de Software</Text>
                <Text style={styles.primary}>Universidade do Constestado</Text>
                <Text>Campus Mafra - 2023</Text>
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
    content: { 
      alignItems: 'center',
      marginTop: 20,
    },
    primary: {
      fontWeight: 'bold',
      padding: 10,
    },
    secondary: {  
      padding: 10,
      textAlign : 'center',
    }
    
  });