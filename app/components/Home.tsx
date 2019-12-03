import * as React from "react";
import { Image, StyleSheet, View } from "react-native";
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
        console.log("log out")
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
        alignItems: "center",
        justifyContent: "space-between"
      }
});

export default Home;