import * as React from "react";
import { Image, StyleSheet, View } from "react-native";
import Button from "./Button";
import colors from "../config/colors";
import strings from "../config/strings";


interface State {
    email: string;
  }

class Home extends React.Component<{}, State> {
    readonly state: State = {
        email: ""
      };

  render() { 
    const {
        email
      } = this.state;

    return (
      <View style={styles.container}>
        <Button
            label={strings.HOME}
            onPress={this.handleLoginPress}
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