import LoginScreen from "./components/LoginScreen";
import Home from "./components/Home";
import Camera from "./components/Camera";

import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

const MainNavigator = createStackNavigator({
  Login: {screen: LoginScreen},
  Home: {screen: Home},
  Camera:{screen:Camera}
},
{
  initialRouteName: 'Login',
  headerMode: 'screen' ,
});

const App = createAppContainer(MainNavigator);

export default App;