import React, { useState } from 'react';

import api from "../services/api";
import { DocumentPickerResponse } from "react-native-document-picker";

interface DocumentProps extends DocumentPickerResponse {
  token?: string;
  progress?: number;
}

interface Params {
  files: DocumentProps[];
  setFileUploading: (file: DocumentProps) => void;
  userId: number;
  projectId: number;
}

interface uploadingFileReturnProps {
  response?: string;
  error?: string;
  filename?: string;
  duration?: number;
}

export async function uploadFile(files, setFileUploading, userId, projectId ) {

  const uploadReturn: uploadingFileReturnProps[] =[];
  
  for (const element of files) {

    const filename = element.name;
    const fd = new FormData();
    fd.append(
      "Filedata",
      JSON.parse(
        JSON.stringify({
          uri: element.uri,
          type: element.type,
          name: filename,
        })
      )
    );

    await api
    .post(`proc_upload_fr_start.php?userId=${userId}&projectId=${projectId}&token_key=${element.name}&duration=0`,
    fd,
    {
      headers: {
        "Content-Type": "multipart/form-data",
          token: element.token,
      },
      onUploadProgress: (event) => {
        let progress: number = Math.round(
          (event.loaded * 100) / event.total
        );
        element.progress = progress;
        setFileUploading(element)
      } 
    })
    .then((result) => {
      const response = {
        response: result.data.result[0].response,
        filename: result.data.result[0].filename,
        duration: result.data.result[0].duration,
      }
      uploadReturn.push(response);
      
    })
    .catch((err) => {
      const response = {
        filename: element.name,
        error: err
      }
      uploadReturn.push(response);
    })
   
  } // fechamento do For();

  return uploadReturn;
}