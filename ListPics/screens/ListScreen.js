import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { addImage } from '../slice';
import { useDispatch } from 'react-redux';

export default function ListScreen({ navigation}) {
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState('');
  const [imageUri, setImageUri] = useState('');
  const dispatch = useDispatch();

  const handleAddList = async () => {
    let newImageUri = '';
    if (imageUri === '') {
      // Ask the user to take a picture if they didn't select one
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
      if (permissionResult.granted === false) {
        Alert.alert('Permission to access camera roll is required!');
        return;
      }
  
      const result = await ImagePicker.launchCameraAsync();
      if (result.canceled) {
        return;
      }
  
      newImageUri = result.assets[0].uri;
      setImageUri(newImageUri);
    } else {
      newImageUri = imageUri;
    }
  
    // Dispatch the addImage action to add the new image to the state
    dispatch(addImage(newImageUri));
  
    const newList = {
      id: Date.now().toString(),
      name: newListName,
      imageUri: newImageUri,
      tasks: []
    };
    setLists([...lists, newList]);
    setNewListName('');
    setImageUri('');
  };
  
  const handleListPress = (list) => {
    navigation.navigate('Tasks', { list, imageUri });
  };

  const handleDeleteList = async (list) => {
    try {
      // Remove the list from storage
      await AsyncStorage.removeItem(list.id);
  
      // Remove the list from state
      setLists(lists.filter(item => item.id !== list.id));

    } catch (error) {
      // Show an error message
      Alert.alert('Error', 'Failed to delete list');
    }
  };
  
  const handleListLongPress = (list) => {
    Alert.alert(
      'Delete List',
      `Are you sure you want to delete "${list.name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => handleDeleteList(list)
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="New list name"
        value={newListName}
        onChangeText={setNewListName}
      />
      {imageUri && <Image source={{ assets: imageUri }} style={styles.imagePreview} />}
      <TouchableOpacity style={styles.button} onPress={handleAddList}>
        <Text style={styles.buttonText}>Add List</Text>
      </TouchableOpacity>
      <View style={styles.listsContainer}>
        {lists.map(list => (
          <TouchableOpacity
            key={list.id}
            style={styles.listItem}
            onPress={() => handleListPress(list)}
            onLongPress={() => handleListLongPress(list)}
          >
            <Text style={styles.listItemText}>{list.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  listsContainer: {
    flex: 1,
  },
  listItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  listItemText: {
    fontSize: 18,
  },
});