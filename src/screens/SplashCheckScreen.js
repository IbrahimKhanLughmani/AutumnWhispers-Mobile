import {useEffect, useContext} from 'react';
import {Context} from '../context/AuthContext';
import { StackActions, NavigationActions } from 'react-navigation';

const SplashCheckScreen = ({navigation}) => {
  const {splashScreen} = useContext(Context);
  const navigate_liveness = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'VerifyDetection', params: {root_nav: 'Login'} })],
  });
  const navigate_home = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Home' })],
  });
  const navigate_login = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Signin' })],
  });

  useEffect(() => {
    splashScreen(()=>navigation.dispatch(navigate_login), ()=>navigation.dispatch(navigate_home), ()=>navigation.dispatch(navigate_liveness));
  }, []);

  return null;
};

export default SplashCheckScreen;
