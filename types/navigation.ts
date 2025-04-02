import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainApp: undefined;
};

export type AuthStackNavigationProp = NativeStackNavigationProp<RootStackParamList>; 
