// import PushNotification from 'react-native-push-notification';

// PushNotification.configure({
//   // (required) Called when a remote or local notification is opened or received
//   onNotification: function(notification) {
//     //console.log('LOCAL NOTIFICATION ==>', notification)
//   },
//   popInitialNotification: true,
//   requestPermissions: true,
// });

// export const LocalNotification = payload => {
//   try {
//     PushNotification.presentLocalNotification({
//       autoCancel: true,
//       // bigText:
//       //     'This is local notification demo in React Native app. Only shown, when expanded.',
//       // subText: 'Local Notification Demo',
//       title: payload.notification.title,
//       message: payload.notification.body,
//       vibrate: true,
//       vibration: 300,
//       playSound: true,
//       priority: 'high',
//       soundName: 'default',
//     });
//   } catch (err) {
//     console.error(err);
//   }
// };
