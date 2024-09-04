import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert, PermissionsAndroid, Button } from 'react-native';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, CameraType } from "expo-camera";
import * as FileSystem from "expo-file-system"; 

const PHOTOS_DIR = FileSystem.documentDirectory + "CPD_Photos";

async function requestCameraPermissions(requestPermission) {
  try {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === null) {
      await requestPermission();
    } else if (status.granted === false) {
      Alert.alert(
        'Permission Denied',
        'Permission to use the camera has been denied.',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false }
      );
    }
  } catch (err) {
    console.warn(err);
  }
}

async function ensureDirExists() {
  try {
    const info = await FileSystem.getInfoAsync(PHOTOS_DIR);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(PHOTOS_DIR, { intermediates: true });
      console.log('Created directory:', PHOTOS_DIR);
    } else if (info.isDirectory) {
      console.log('Directory already exists:', PHOTOS_DIR);
    } else {
      console.warn(`${PHOTOS_DIR} is not a directory`);
    }
  } catch (err) {
    console.warn('Error while checking/creating directory:', err);
  }
}

export default function CameraScreen({ onPictureTaken }) {
  const [status, requestPermission] = Camera.useCameraPermissions();
  const cameraRef = useRef(null);

  const takePicture = useCallback(async () => {
    if (cameraRef.current) {
      try {
        const { uri } = await cameraRef.current.takePictureAsync();
        const saveURI = `${PHOTOS_DIR}/${Date.now()}.jpg`;
        await FileSystem.moveAsync({ from: uri, to: saveURI });
        console.log('Photo saved to:', saveURI);
        onPictureTaken(saveURI);
      } catch (err) {
        console.warn('Error while taking photo:', err);
      }
    } else {
      console.warn('Camera ref not set!');
    }
  }, []);

  useEffect(() => {
    requestCameraPermissions();
    ensureDirExists();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} ref={cameraRef} type={CameraType.front} />
      <Button title="Capture Photo" onPress={takePicture} />
    </View>
  );
}
