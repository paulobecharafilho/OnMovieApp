import React from 'react';
import { ChatProps } from '../utils/Interfaces';
import api from './api';


export async function getChat(projectId) {

  let chats: ChatProps[] = [];
  let result: string = '';

  await api
  .get(`/api_chat/chat.php?projectId=${projectId}`)
  .then((response) => {
    if (response.data.response === 'Success') {
      chats = response.data.chats;
      result = 'Success';
      
    } else {
      const result = {
        result: 0
      }
    }
  })

  const resultFinal = {
    chats: chats,
    result: result
  }

  return resultFinal;
}