import * as React from "react";
import { Image, StyleSheet, View,Alert ,Text} from "react-native";
import Button from "./Button";
import FormTextInput from "./FormTextInput";
import colors from "../config/colors";
import strings from "../config/strings";
var Vibration = require('react-native-vibration');

import {
  Stitch,
  RemoteMongoClient,
  AnonymousCredential,
  UserPasswordCredential,
  UserPasswordAuthProviderClient
} from "mongodb-stitch-react-native-sdk";

const APP_ID = "babymon-jsvil";
const DURATION = 500;

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
  static navigationOptions = {
    header: null
  }

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
    const credential = new UserPasswordCredential(this.state.email, this.state.password)
  
    this.state.client.auth.loginWithCredential(credential).then(user => {
      console.log(`Successfully logged in as user ${user.id}`);
      this.setState({ currentUserId: user.id })
    }).then( ()=> this.props.navigation.navigate('Home')
    ).catch(err => {
      console.log(`Failed to log with the information: ${err}`);
      Alert.alert(
        'Wrong Credentials !',
        'Please check your credentials',
        [
          {
            text: 'Ok',
            onPress: () => console.log('Ok Pressed'),
            style: 'cancel',
          },
        ],
        {cancelable: false},
      ); 
      this.setState({ currentUserId: undefined })
    });
  };

  handleSignupPress = () => {
    console.log("Sign up button pressed");
    const emailPasswordClient = Stitch.defaultAppClient.auth.getProviderClient(UserPasswordAuthProviderClient.factory);
    emailPasswordClient.registerWithEmail(this.state.email, this.state.password)
    .then(() => console.log("Successfully sent account confirmation email!"))
    .catch(err => 
      {
      if (this.state.password.length < 6 )  {
        Alert.alert(
          'Password too short ! !',
          'Password should be between 6 and 128 characters',
          [
            {
              text: 'Ok',
              onPress: () => console.log('Ok Pressed'),
              style: 'cancel',
            },
          ],
          {cancelable: false},
        ); 
      }
      else{
        console.error("Error registering new user:", err)}
    });
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
        
        <View style={styles.form}>

          <Text style={styles.title}>
            Login
          </Text>
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
  title:{
    alignItems: "center",
    fontFamily:'Kollektif',
    fontSize:48,
    marginBottom:"15%",

  },
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    alignItems: "center",
    justifyContent: "space-between"
  },
  form: {
    flex: 1,
    justifyContent: "center",
    width: "80%",
    textAlign : "left",

  }
});

export default LoginScreen;