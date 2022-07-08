import React from 'react';
import { FilesProps } from '../utils/Interfaces';
import api from './api';

interface FileAttatchedProps extends FilesProps {
  isAttachedToProject?: boolean
}

export async function getProjetctFiles(userId, projectId) {

  let libraryDependenciesFiles: FileAttatchedProps[] = [];
  let result: string = '';

  await api
  .get(`list_files_from_library_dependencies.php?userId=${userId}&projectId=${projectId}`)
  .then((response) => {
    if (response.data.response === 'Success') {
      libraryDependenciesFiles = response.data.files;
      result = 'Success';
      
    } else {
      const result = {
        result: 0
      }
    }
  })

  const resultFinal = {
    libraryDependenciesFiles: libraryDependenciesFiles,
    result: result
  }

  return resultFinal;
}