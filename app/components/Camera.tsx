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
          <WebView source={{ uri: 'http://192.168.1.123:5000' }} />
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