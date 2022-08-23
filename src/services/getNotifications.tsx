import React from 'react';
import { NotificationsProps } from '../utils/Interfaces';
import api from './api';


export async function getNotifications(userId) {

  let notificacoes: NotificationsProps[] = [];
  let result: string = '';

  await api
  .get(`get_notifications.php?userId=${userId}`)
  .then((response) => {
    if (response.data.response === 'Success') {
      notificacoes = response.data.notificacoes;
      result = 'Success';
      
    } else {
      const result = {
        result: 0
      }
    }
  })

  const resultFinal = {
    notificacoes: notificacoes,
    result: result
  }

  return resultFinal;
}