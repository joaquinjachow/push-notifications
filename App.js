import React, { useEffect, useState } from 'react';
import { View, Text, Button, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);

  useEffect(() => {
    const getPushToken = async () => {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
      const { status } = await Notifications.requestPermissionsAsync();
      console.log('Estado del permiso:', status);
      if (status === 'granted') {
        const token = await Notifications.getExpoPushTokenAsync();
        console.log('Token generado:', token.data);
        setExpoPushToken(token.data);
      } else {
        console.log('Permisos denegados para notificaciones');
      }
    };
    getPushToken();
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notificación recibida:', notification);
      setNotification(notification);
    });
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Respuesta a notificación:', response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []); // Dependencia vacía, se ejecuta solo al montar el componente

  const triggerNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "¡Notificación!",
        body: "Este es un mensaje de prueba.",
      },
      trigger: {
        seconds: 2,
      },
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Expo Push Token:</Text>
      <Text>{expoPushToken}</Text>
      <Button title="Activar notificación" onPress={triggerNotification} />
      <Text>Notificación recibida: {notification ? notification.request.content.body : 'Ninguna'}</Text>
    </View>
  );
}