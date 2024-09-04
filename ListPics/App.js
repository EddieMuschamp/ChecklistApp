import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import GalleryScreen from './screens/GalleryScreen';
import ListScreen from './screens/ListScreen';
import TaskScreen from './screens/TaskScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './slice';

const store = configureStore({
  reducer: rootReducer
});

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainStack() {
  
  return (
    <Stack.Navigator initialRouteName="List">
      <Stack.Screen name="Lists" component={ListScreen} />
      <Stack.Screen name="Tasks" component={TaskScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Lists and Tasks" component={MainStack} />
          <Tab.Screen name="Gallery" component={GalleryScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
