import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Button, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { DatabaseConnection } from '../database'; 

const db = DatabaseConnection.getConnection();


export default function NoteDetailScreen({ route, navigation }) {
  const { title, text, id, image, date, location } = route.params;
  const [selectedLocation, setSelectedLocation] = useState(location);

  const locationFromString = location
    ? {
        latitude: parseFloat(location.split(',')[0]),
        longitude: parseFloat(location.split(',')[1]),
      }
    : null;

  const handleLocationPick = (event) => {
    const coordinate = event.nativeEvent.coordinate;
    setSelectedLocation(coordinate);
  };

  const deleteNote = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM table_note WHERE note_id = ?',
        [id],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            Alert.alert('Nota Excluída', 'A Nota foi excluída com sucesso.');
            navigation.goBack(); 
          } else {
            Alert.alert('Error', 'Failed to delete the note.');
          }
        }
      );
    });
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerRight: () => (
        <Button title="Editar" onPress={()=>{}} style={{marginRight: 10}} />
      ),
    });
  }, [navigation]);

    return (
      <>
        <View style={styles.container}>
          <Text style={styles.title}>
            {title}
          </Text>
          <Text style={styles.content}>
            {text}
          </Text>
          {image && 
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} />
          </View>
          }
          {locationFromString && 
            <MapView
            mapType='satellite'
            style={{ height: 200, borderRadius: 8, marginBottom: 12,}}
            showsUserLocation={true}
            minZoomLevel={15}
            initialRegion={{
              latitude: locationFromString.latitude,
              longitude: locationFromString.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onPress={handleLocationPick}
            >
              {locationFromString && <Marker coordinate={locationFromString} />}
            </MapView>
          }
          <Text>
            {date}
          </Text>
        </View>
        <View style={styles.bottomBar}>
          <TouchableOpacity onPress={() => {}}/>
          <TouchableOpacity onPress={() => deleteNote()}>
            <Image source={require('../assets/trash.png')} style={{width: 35, height: 35, marginRight: 10, marginBottom: 25}}/>
          </TouchableOpacity>
        </View>
      </>
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
    marginBottom: 20,
  },
  content: {
    fontSize: 17,
    marginBottom: 20,
    textAlign: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    alignContent: 'center',
  },
  imageContainer: { 
    alignItems: 'center',
  },
  bottomBar: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center', 
    padding: 10,
    backgroundColor: '#F2F2F7',
  },
});
