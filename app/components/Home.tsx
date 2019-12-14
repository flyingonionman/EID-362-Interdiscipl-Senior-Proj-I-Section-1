import * as React from "react";
import { Image, StyleSheet, View,Alert,BackHandler} from "react-native";
import WebView from "react-native-webview";
import Button from "./Button";
import colors from "../config/colors";
import strings from "../config/strings";


interface State {
    email: string;
  }

class Home extends React.Component<{}, State> {

    constructor(props) {
      super(props)
    }

    static navigationOptions = {
        header: null
      }

    readonly state: State = {
        email: ""
      };
      
    componentDidMount() {
      BackHandler.addEventListener('hardwareBackPress', this.backPress)
    }

    componentWillUnmount() {
      BackHandler.removeEventListener('hardwareBackPress', this.backPress)
    }

    backPress = () => true

    handleLogoutPress = () => {
        console.log("log out");
        Alert.alert(
          'Log Out',
          'Are you sure you want to log out?',
          [
            {
              text: 'Yes',
              onPress: () => this.props.navigation.navigate('Login')
              ,
              style: 'cancel',
            },
            {
              text: 'No',
              style: 'cancel',
            },
          ],
          {cancelable: false},
        ); 
    };
     
    handleSettingsPress = () => {
      console.log("Settings");
    };
      
    handleViewcamPress = () => {
      console.log("View camera");

    };
  
  render() { 
    const {
        email
      } = this.state;

    return (
      <View style={styles.container}>
        <Button
            label={strings.LOGOUT}
            onPress={this.handleLogoutPress}
          />
        <Button
            label={strings.SETTINGS}
            onPress={this.handleSettingsPress}
          />
        <Button
            label={strings.VIEWCAM}
            onPress={this.handleViewcamPress}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop :0,
        backgroundColor: colors.WHITE,
        alignItems: "center",
        justifyContent: "space-between"
      }
});

export default Home;