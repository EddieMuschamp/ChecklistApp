import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen({ completedListsCount }) {
  const [completedTasksCount, setCompletedTasksCount] = useState(0);

  useEffect(() => {
    // Load the completed tasks count from storage on component mount
    loadCompletedTasksCount();
  }, []);

  const loadCompletedTasksCount = async () => {
    try {
      const value = await AsyncStorage.getItem('completedTasksCount');
      if (value !== null) {
        setCompletedTasksCount(parseInt(value));
      }
    } catch (error) {
      console.log('Error loading completed tasks count:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Profile</Text>
      <Text style={styles.text}>Completed Lists: {completedListsCount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
});
