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
      this.props.navigation.navigate('Camera');

    };
  
  render() { 
    const {
        email
      } = this.state;

    return (
      <View style={styles.container}>

        <View style={styles.webview}>
          <WebView source={{ uri: 'https://facebook.github.io/react-native/' }} />
        </View>
        <View style={styles.buttons}>
          <Button
              label={strings.VIEWCAM}
              onPress={this.handleViewcamPress}
            />
          <Button
            label={strings.SETTINGS}
            onPress={this.handleSettingsPress}
          />
          <Button
              label={strings.LOGOUT}
              onPress={this.handleLogoutPress}
          />
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop :"10%",
        backgroundColor: colors.WHITE,
        alignItems: "center",
        justifyContent: "space-between"
      },
    webview:{
      flex: 2,
      width:"80%"
    },
    buttons:{
      flex: 1,
      width:"80%",
      alignItems:"flex-end",
      marginTop:"10%",
      justifyContent:"flex-end"
    }
});

export default Home;