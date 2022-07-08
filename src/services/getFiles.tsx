import React from 'react';
import { FilesProps } from '../utils/Interfaces';
import api from './api';

interface FileAttatchedProps extends FilesProps {
  isAttachedToProject?: boolean
}

export async function getFiles(userId) {

  let libraryFiles: FileAttatchedProps[] = [];
  let result: string = '';

  await api
  .get(`list_files_from_library.php?userId=${userId}`)
  .then((response) => {
    if (response.data.response === 'Success') {
      libraryFiles = response.data.files;
      result = 'Success';
      
    } else {
      const result = {
        result: 0
      }
    }
  })

  const resultFinal = {
    libraryFiles: libraryFiles,
    result: result
  }

  return resultFinal;
}