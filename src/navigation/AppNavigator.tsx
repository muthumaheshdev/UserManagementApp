import React from 'react';

import {NavigationContainer} from '@react-navigation/native';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import UserListScreen from '../screens/UserListScreen';
import {RootStackParamList} from './types';
import UserDetailScreen from '../screens/UserDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="UserList"
          component={UserListScreen}
          options={{title: 'Users'}}
        />
        <Stack.Screen
          name="UserDetail"
          component={UserDetailScreen}
          options={{title: 'User Detail'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
