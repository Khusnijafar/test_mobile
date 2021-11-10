import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import CoursesScreen from '../screens/Courses';
import DetailCourseScreen from '../screens/DetailCourse';

const navOptionHandler = () => ({
  headerShown: false,
});

const Stack = createNativeStackNavigator();

const Routes: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Courses"
        screenOptions={navOptionHandler}>
        <Stack.Screen name="Courses" component={CoursesScreen} />
        <Stack.Screen name="DetailCourse" component={DetailCourseScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
