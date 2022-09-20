import React from "react";
import * as FileSystem from "expo-file-system";
import { baseUrl } from "../services/api";
import { AssetInfo } from "expo-media-library";
import { Platform } from "react-native";

interface MediaProps extends AssetInfo {
  progress?: number;
  isUploaded?: boolean;
  token?: string;
}

interface Props {
  mediaToUpload: MediaProps[];
  userId: number;
  projectId: number;
  setProgress: (progress: number) => void;
  setMediaUploading: (mediaUploading: MediaProps) => void;
  setMediaUploadingTask: (mediaUploadingTask: any) => void;
  setUploadingMomment: (momment: string) => void;
}

interface uploadingFileReturnProps {
  response?: string;
  error?: string;
  filename?: string;
  duration?: number;
}

export async function uploadMedia({
  mediaToUpload,
  userId,
  projectId,
  setProgress,
  setMediaUploading,
  setMediaUploadingTask,
  setUploadingMomment,
}: Props) {
  const uploadReturn: uploadingFileReturnProps[] = [];
  let mediaUploadedAux: MediaProps[] = [];

  for (const element of mediaToUpload) {
    const filename = element.filename;
    const duracao = element.duration.toFixed(2);
    const fd = new FormData();
    fd.append(
      "Filedata",
      JSON.parse(
        JSON.stringify({
          uri: element.localUri,
          type: element.mediaType,
          name: filename,
        })
      )
    );

    const task = await FileSystem.createUploadTask(
      `${baseUrl}/proc_upload_fr_start.php?userId=${userId}&projectId=${projectId}&token_key=${element.creationTime}&duration=${duracao}`,
      Platform.OS === 'ios' ? element.localUri : element.uri,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          token: element.token,
        },
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        sessionType: FileSystem.FileSystemSessionType.BACKGROUND,
        httpMethod: "POST",
        fieldName: `Filedata`,
      },
      (data) => {
        let progress: number = Math.round(
          (data.totalByteSent * 100) / data.totalBytesExpectedToSend
        );
        element.progress = progress;
        setProgress(progress);
        setMediaUploading(element);
        // console.log(
        //   `DataSent -> ${data.totalByteSent}, DataTotal -> ${data.totalBytesExpectedToSend} -> progress: ${progress}%`
        // );
      }
    );
  
    setMediaUploadingTask(task);

    await task
      .uploadAsync()
      .then((result) => {
        console.log(`result -> ${result.body}`);
        let res2 = JSON.parse(result.body);
        console.log(`res2 -> ${res2}`);


        if (res2.result[0].response === "Success") {
          console.log(`media ${element.filename} uploaded Successfully.`);
          mediaUploadedAux.push(element);

          const response: uploadingFileReturnProps = {
            filename: res2.filename,
            response: res2.response,
          }
          
          uploadReturn.push(response);

          if (mediaUploadedAux.length === mediaToUpload.length) {
            setUploadingMomment("done");
          }
        } else {
          const response: uploadingFileReturnProps = {
            filename: res2.filename,
            response: res2.response,
          }
          
          uploadReturn.push(response);
        }
      })
      .catch((error) => {
        console.log(`error -> ${error}`)
        const response: uploadingFileReturnProps = {
          filename: element.filename,
          error: error
        }
        
        uploadReturn.push(response);
      });
  } // fechamento do For();

  return uploadReturn;
}
