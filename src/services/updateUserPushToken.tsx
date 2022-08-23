import React from 'react';
import api from './api';

export async function updateUserPushToken(userId, token) {
  let result = '';

  await api
  .post(`update_user_push_notification.php?userId=${userId}`, {
    token: token
  })
  .then((response) => {
    console.log(`UpdateUserPushToken -> ${JSON.stringify(response.data)}`)
    if (response.data.response === 'Success') {
      
      result = 'Success';
      
    } else {
      const result = {
        result: 0
      }
    }
  })

  const resultFinal = {
    result: result
  }

  return resultFinal;
}