import * as React from "react";
import { Image, StyleSheet, View,Alert,BackHandler,AsyncStorage } from "react-native";
import WebView from "react-native-webview";
import Button from "./Button";
import colors from "../config/colors";
import strings from "../config/strings";
import firebase from 'react-native-firebase';


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

      
    async checkPermission() {
      const enabled = await firebase.messaging().hasPermission();
      if (enabled) {
        console.log('ooga token');
          this.getToken();
      } else {
          this.requestPermission();
      }
    }

    async getToken() {
      let fcmToken = await AsyncStorage.getItem('fcmToken');
      console.log(fcmToken);

      if (!fcmToken) {
          fcmToken = await firebase.messaging().getToken();
          if (fcmToken) {
              // user has a device token
              console.log('got token');
              await AsyncStorage.setItem('fcmToken', fcmToken);
          }
      }
    }
    
    async requestPermission() {
      try {
          await firebase.messaging().requestPermission();
          console.log('ooga rejected');
          this.getToken();
      } catch (error) {
          // User has rejected permissions
          console.log('permission rejected');
      }
    }

    componentDidMount() {
      BackHandler.addEventListener('hardwareBackPress', this.backPress);
      this.checkPermission();
      this.createNotificationListeners(); //add this line

    }

    componentWillUnmount() {
      BackHandler.removeEventListener('hardwareBackPress', this.backPress);
      this.notificationListener();
      this.notificationOpenedListener();
    }

    async createNotificationListeners() {
      /*
      * Triggered when a particular notification has been received in foreground
      * */
      console.log("lol I'm fucked")

      this.notificationListener = firebase.notifications().onNotification((notification) => {

          const { title, body } = notification;
          this.showAlert(title, body);
      });
    
      /*
      * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
      * */
      this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
          const { title, body } = notificationOpen.notification;
          this.showAlert(title, body);
      });
    
      /*
      * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
      * */
      const notificationOpen = await firebase.notifications().getInitialNotification();
      if (notificationOpen) {
          const { title, body } = notificationOpen.notification;
          this.showAlert(title, body);
      }
      /*
      * Triggered for data only payload in foreground
      * */
      this.messageListener = firebase.messaging().onMessage((message) => {
        //process data message
        console.log(JSON.stringify(message));
      });
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
  
    showAlert(title, body) {
      console.log('Kill me')
      Alert.alert(
        title, body,
        [
            { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false },
      );
    }
  render() { 
    const {
        email
      } = this.state;

    return (
      <View style={styles.container}>

        <View style={styles.webview}>
          <WebView source={{ uri: 'https://google.com' }} />
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