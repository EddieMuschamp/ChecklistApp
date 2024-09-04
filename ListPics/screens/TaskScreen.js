import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, StyleSheet, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addImage } from '../slice';
import { useDispatch } from 'react-redux';

export default function TasksScreen({ route, navigation }) {
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();
  const list = route.params.list;

  useEffect(() => {
    async function getTasksAndImageFromStorage() {
      try {
        const tasksString = await AsyncStorage.getItem(`tasks_${list.id}`);
        if (tasksString !== null) {
          setTasks(JSON.parse(tasksString));
        }
  
        const imageUri = await AsyncStorage.getItem(`image_${list.id}`);
        if (imageUri !== null) {
          setImage(imageUri);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getTasksAndImageFromStorage();
  }, [list.id]);
  
  useEffect(() => {
    async function saveTasksAndImageToStorage() {
      try {
        await AsyncStorage.setItem(`tasks_${list.id}`, JSON.stringify(tasks));
        if (image) {
          await AsyncStorage.setItem(`image_${list.id}`, image);
        } else {
          await AsyncStorage.removeItem(`image_${list.id}`);
        }
      } catch (error) {
        console.log(error);
      }
    }
    saveTasksAndImageToStorage();
  }, [list.id, tasks, image]);
  

  const handleAddTask = () => {
    if (newTaskName === '') {
      return;
    }
    const newTask = {
      id: Date.now().toString(),
      name: newTaskName,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setNewTaskName('');
  };

  const handleDeleteTask = (task) => {
    setTasks(tasks.filter((item) => item.id !== task.id));
  };

  const handleTaskLongPress = (task) => {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${task.name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => handleDeleteTask(task),
        },
      ]
    );
  };

  const handleToggleTask = (task) => {
    const updatedTasks = tasks.map((item) => {
      if (item.id === task.id) {
        return { ...item, completed: !item.completed };
      } else {
        return item;
      }
    });
    setTasks(updatedTasks);
  };

  const handleTakePicture = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
  
    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      dispatch(addImage(imageUri));
      setImage(imageUri);
      const listId = list.id;
      const taskListString = await AsyncStorage.getItem('taskList');
      const taskList = JSON.parse(taskListString) || [];
      const updatedTaskList = taskList.map((task) => {
        if (task.id === listId) {
          return {
            ...task,
            imageUri: imageUri,
          };
        }
        return task;
      });
      await AsyncStorage.setItem('taskList', JSON.stringify(updatedTaskList));
    }
  };
  
 return (
  <View style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.title}>{list.name}</Text>
    </View>
    <TextInput
      style={styles.input}
      placeholder="New task name"
      value={newTaskName}
      onChangeText={setNewTaskName}
    />
    <TouchableOpacity style={styles.button} onPress={handleAddTask}>
      <Text style={styles.buttonText}>Add Task</Text>
    </TouchableOpacity>
    <ScrollView style={styles.tasksContainer}>
      {tasks.map((task) => (
        <TouchableOpacity
          key={task.id}
          style={styles.taskItem}
          onPress={() => handleToggleTask(task)}
          onLongPress={() => handleTaskLongPress(task)}
        >
          <Text
            style={[
              styles.taskItemText,
              task.completed && styles.completedTaskItemText,
            ]}
          >
            {task.name}
          </Text>
          <TouchableOpacity onPress={() => handleTaskLongPress(task)}>
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    
    <Image source={{ uri: list.imageUri }} style={styles.image} />
    {tasks.every((task) => task.completed) && (
      <View style={styles.imageContainer}>
        {!image && (
          <TouchableOpacity style={styles.button} onPress={handleTakePicture}>
            <Text style={styles.buttonText}>Take a picture of your completed list!</Text>
          </TouchableOpacity>
        )}
        {image && (
          <Image source={{ uri: image }} style={styles.bottomImage} />
        )}
      </View>
    )}
    </ScrollView>
  </View>
);

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    margin: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 4,
    padding: 10,
    marginVertical: 20,
    alignSelf: 'stretch',
    marginHorizontal: 20,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 4,
    alignSelf: 'stretch',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  tasksContainer: {
    alignSelf: 'stretch',
    flex: 1,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  taskItemText: {
    fontSize: 18,
    flex: 1,
  },
  completedTaskItemText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  cameraButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 4,
    alignSelf: 'center',
    marginTop: 10,
  },
  cameraButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  bottomImage: {
    width: 100,
    height: 100,
    margin: 10,
  },
});