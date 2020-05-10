import LoginScreen from "./components/LoginScreen";
import Home from "./components/Home";
import Camera from "./components/Camera";
import Search from "./components/Search";
import Setting from "./components/Setting";

import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

const MainNavigator = createStackNavigator({
  Login: {screen: LoginScreen},
  Home: {screen: Home},
  Camera:{screen:Camera},
  Search:{screen:Search},
  Setting:{screen:Setting}

},
{
  initialRouteName: 'Login',
  headerMode: 'screen' ,
});

const App = createAppContainer(MainNavigator);

export default App;