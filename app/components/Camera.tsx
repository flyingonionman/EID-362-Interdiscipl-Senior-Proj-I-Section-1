import * as React from "react";
import { Image, StyleSheet, View } from "react-native";
import WebView from "react-native-webview";
import Button from "./Button";
import colors from "../config/colors";
import strings from "../config/strings";


interface State {
    email: string;
  }

class Home extends React.Component<{}, State> {
    static navigationOptions = {
        header: null
      }

    readonly state: State = {
        email: ""
      };

    handleLogoutPress = () => {
        console.log("log out");
        this.props.navigation.navigate('Login')
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
        <WebView source={{ uri: 'https://google.com' }} />

        <Button
            label={strings.SETTINGS}
            onPress={this.handleLogoutPress}
          />
        <Button
            label={strings.VIEWCAM}
            onPress={this.handleSettingsPress}
          />
        <Button
            label={strings.LOGOUT}
            onPress={this.handleViewcamPress}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: .1,
        marginTop : 12,
        backgroundColor: colors.WHITE,
        alignItems: "center",
        justifyContent: "space-between"
      }
});

export default Home;