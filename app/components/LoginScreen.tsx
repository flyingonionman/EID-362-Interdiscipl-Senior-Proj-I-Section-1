import * as React from "react";
import { Image, StyleSheet, View } from "react-native";
import Button from "./Button";
import FormTextInput from "./FormTextInput";
import imageLogo from "../assets/images/logo.png"
import colors from "../config/colors";
import strings from "../config/strings";

import {
  Stitch,
  RemoteMongoClient,
  AnonymousCredential
} from "mongodb-stitch-react-native-sdk";

const APP_ID = "babymon-jsvil";

interface State {
  email: string;
  password: string;
  emailTouched: boolean;
  passwordTouched: boolean;
  value:string;
  client:any;
}

class LoginScreen extends React.Component<{}, State> {
  passwordInputRef = React.createRef<FormTextInput>();
  readonly state: State = {
    email: "",
    password: "",
    value:"",
    client:"undefined",
    emailTouched: false,
    passwordTouched: false
  };

  handleEmailChange = (email: string) => {
    this.setState({ email: email });
  };

  handlePasswordChange = (password: string) => {
    this.setState({ password: password });
  };

  handleEmailBlur = () => {
    this.setState({ emailTouched: true });
  };

  handlePasswordBlur = () => {
    this.setState({ passwordTouched: true });
  };

  handleEmailSubmitPress = () => {
    if (this.passwordInputRef.current) {
      this.passwordInputRef.current.focus();
    }
  };

  handleLoginPress = () => {
    console.log("Login button pressed");
    this.state.client.auth.loginWithCredential(new AnonymousCredential()).then(user => {
      console.log(`Successfully logged in as user ${user.id}`);
      this.setState({ currentUserId: user.id })
    }).then( ()=> this.props.navigation.navigate('Home')
    ).catch(err => {
      console.log(`Failed to log in anonymously: ${err}`);
      this.setState({ currentUserId: undefined })
    });
  };

  handleSignupPress = () => {
    console.log("Sign up button pressed");
  };

  componentDidMount() {
    this._loadClient();
  }

  _loadClient() {
    Stitch.initializeDefaultAppClient('babymon-jsvil').then(client => {
      this.setState({ client });
 
      if(client.auth.isLoggedIn) {
        this.state.client.auth.logout().then(user => {
          console.log(`Successfully logged out`);
          this.setState({ currentUserId: undefined })
      })
      }
    });
  }
 

  render() {
    const {
      email,
      password,
      emailTouched,
      passwordTouched
    } = this.state;

    const emailError =
    !email && emailTouched
      ? strings.EMAIL_REQUIRED
      : undefined;
  const passwordError =
    !password && passwordTouched
      ? strings.PASSWORD_REQUIRED
      : undefined;

    return (
      <View style={styles.container}>
        <Image source={imageLogo} style={styles.logo} />
        <View style={styles.form}>
          <FormTextInput
            value={this.state.email}
            onChangeText={this.handleEmailChange}
            onSubmitEditing={this.handleEmailSubmitPress}
            placeholder={strings.EMAIL_PLACEHOLDER}
            autoCorrect={false}
            keyboardType="email-address"
            returnKeyType="next"
            onBlur={this.handleEmailBlur}
            error={emailError}
 
          />
          <FormTextInput
            ref={this.passwordInputRef}
            value={this.state.password}
            onChangeText={this.handlePasswordChange}
            placeholder={strings.PASSWORD_PLACEHOLDER}
            secureTextEntry={true}
            returnKeyType="done"
            onBlur={this.handlePasswordBlur}
            error={passwordError}
          />

          <Button
            label={strings.LOGIN}
            onPress={this.handleLoginPress}
            disabled={!email || !password}

          />

          <Button
            label={strings.SIGNUP}
            onPress={this.handleSignupPress}
          />
        </View>
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
  },
  logo: {
    flex: 1,
    width: "80%",
    resizeMode: "contain",
    alignSelf: "center"
  },
  form: {
    flex: 1,
    justifyContent: "center",
    width: "80%"
  }
});

export default LoginScreen;