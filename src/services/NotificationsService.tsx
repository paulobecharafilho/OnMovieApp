import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, Button, Platform } from 'react-native';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Subscription } from 'expo-modules-core';
import api from './api';
import { getNotifications } from './getNotifications';
import AsyncStorage from '@react-native-async-storage/async-storage';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const BACKGROUND_FETCH_TASK = 'background-fetch';

const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';
const BACKGROUND_TASK_SUCCESSFUL = 'Background task successfully ran!';
const BACKGROUND_TEST_INFO = `To test background notification handling:\n(1) Background the app.\n(2) Send a push notification from your terminal. The push token can be found in your logs, and the command to send a notification can be found at https://docs.expo.dev/push-notifications/sending-notifications/#http2-api. On iOS, you need to include "_contentAvailable": "true" in your payload.\n(3) After receiving the notification, check your terminal for:\n"${BACKGROUND_TASK_SUCCESSFUL}"`;

TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({data, error}) => {
  console.log(BACKGROUND_TASK_SUCCESSFUL);
  console.log(`Data -> ${data}`);
});


// 1. Define the task by providing a name and the function that should be executed
// Note: This needs to be called in the global scope (e.g outside of your React components)
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async (userId) => {
  let notificacoes = [];

  // console.log(`@notifications -> Iniciando BackgroundFetch com userId = ${userId}`)
  
  getNotifications(Number(userId))
  .then((response) => {
    console.log(`@notifications -> recebido do getNotifications : ${JSON.stringify(response)}`)
  })

  // Be sure to return the successful result type!
  // return BackgroundFetch.BackgroundFetchResult.NewData;
  return notificacoes;
});

// 2. Register the task at some point in your app by providing the same name, and some configuration options for how the background fetch should behave
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 60, //A cada 01 minuto
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  });
}

// 3. (Optional) Unregister tasks by specifying the task name
// This will cancel any future background fetch calls that match the given name
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
async function unregisterBackgroundFetchAsync() {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}

export default function NotificationsService() {

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState({});
  const notificationListener = useRef<Subscription | undefined>();
  const responseListener = useRef<Subscription | undefined>();

  
  const [isRegistered, setIsRegistered] = React.useState(false);
  const [status, setStatus] = React.useState(null);

  React.useEffect(() => {
    checkStatusAsync();
    

    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);


  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    return token;
  }

  const checkStatusAsync = async () => {
    const status = await BackgroundFetch.getStatusAsync();
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
    setStatus(status);
    setIsRegistered(isRegistered);
  };

  const toggleFetchTask = async () => {
    if (isRegistered) {
      await unregisterBackgroundFetchAsync();
    } else {
      await registerBackgroundFetchAsync();
    }

    checkStatusAsync();
  };

}
