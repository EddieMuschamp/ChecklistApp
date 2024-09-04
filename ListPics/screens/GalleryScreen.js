import React from 'react';
import { StyleSheet, Image, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';

export default function GalleryScreen() {
  const images = useSelector((state) => state.imagesSlice.images);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {images.map((imageUri, index) => (
        <Image
          key={index}
          source={{ uri: imageUri }}
          style={styles.image}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
  },
});
