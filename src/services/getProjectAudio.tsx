import React from 'react';
import { FilesProps } from '../utils/Interfaces';
import api from './api';



export async function getProjectAudio(userId, projectId) {

  let projectAudioMsg: string;
  let result: string = '';

  await api
  .get(`getProjectAudio.php?userId=${userId}&projectId=${projectId}`)
  .then((response) => {
    if (response.data.response === 'Success') {
      projectAudioMsg = response.data.audios[0];
      result = 'Success';
      
    } else {
      const result = {
        result: 0
      }
    }
  })

  const resultFinal = {
    projectAudioMsg: projectAudioMsg,
    result: result
  }

  return resultFinal;
}