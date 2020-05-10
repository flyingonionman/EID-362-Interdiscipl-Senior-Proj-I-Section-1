import * as React from "react";
import { Image, StyleSheet, View,Text } from "react-native";
import WebView from "react-native-webview";
import Button from "./Button";
import colors from "../config/colors";
import strings from "../config/strings";


interface State {
    email: string;
  }

class Setting extends React.Component<{}, State> {
    static navigationOptions = {
        header: null
      }

    readonly state: State = {
        email: ""
      };

    handleGohomePress = () => {
        console.log("log out");
        this.props.navigation.navigate('Home');
    };
  render() { 
    const {
        email
      } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.webview}>
            <Text>Change baby</Text>

        </View>

        <View style={styles.buttons}>
          <Button
              label={strings.GOHOME}
              onPress={this.handleGohomePress}
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
        flex: 3,
        width:"100%"
      },
      buttons:{
        flex: 1,
        width:"80%",
        alignItems:"flex-end",
        marginTop:"10%",
        justifyContent:"flex-end"
      }
});

export default Setting;