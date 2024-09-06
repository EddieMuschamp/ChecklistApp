# Task Management App

## Overview

The Task Management App is a React Native application that allows you to manage tasks within lists, capture images, and view completed tasks. It uses AsyncStorage for local data persistence and Redux for state management.

## Features

- **Task Management:** Add, update, and delete tasks.
- **Image Integration:** Capture and associate images with task lists.
- **Persistent Storage:** Store tasks and images locally using AsyncStorage.
- **Profile and Gallery:** View completed tasks and a gallery of images.

## Screens

### TasksScreen

- **Features:**
  - View and manage tasks.
  - Toggle task completion status.
  - Delete tasks with confirmation.
  - Capture and display an image related to the task list upon completing all tasks.

### ProfileScreen

- **Features:**
  - Display the number of completed task lists.
  - Load completed tasks count from AsyncStorage.

### ListScreen

- **Features:**
  - Create new task lists.
  - Add images to task lists.
  - Navigate to `TasksScreen` with the selected list.
  - Delete task lists with confirmation.

### GalleryScreen

- **Features:**
  - Display a gallery of all captured images.
  - Retrieve images from the Redux store.

### CameraScreen

- **Features:**
  - Capture photos using the device camera.
  - Save photos to local storage.
  - Utilize captured photos in the app.
