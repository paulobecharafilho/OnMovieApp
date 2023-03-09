import React from "react";
import * as FileSystem from "expo-file-system";
import api, { baseUrl } from "../services/api";
import { AssetInfo } from "expo-media-library";
import { ImageInfo } from 'expo-image-picker';

interface MediaProps extends ImageInfo {
  progress?: number;
  isUploaded?: boolean;
  token?: string;
}

interface Props {
  mediaToUpload: MediaProps;
  userId: number;
  projectId: number;
  index: number;
  setProgress: (progress: number) => void;
  setMediaUploading: (mediaUploading: MediaProps) => void;
  setMediaUploadingTask: (mediaUploadingTask: any) => void;
  setUploadingMomment?: (momment: string) => void;
}

interface uploadingFileReturnProps {
  response?: string;
  error?: string;
  fileName?: string;
  duration?: number;
  index?: number;
}

export async function uploadMedia({
  mediaToUpload,
  userId,
  projectId,
  index,
  setProgress,
  setMediaUploading,
  setMediaUploadingTask,
}: Props) {
  console.log(`@uploadMedia -> iniciando função uploadMedia`);

  let returnMedia: uploadingFileReturnProps = null;

  // const fileName = mediaToUpload.fileName;
  const duracao = mediaToUpload.duration ? mediaToUpload.duration.toFixed(2) : 0;
 
  const xrh = new XMLHttpRequest();


  const fd = new FormData();
  fd.append(
    "Filedata",
    JSON.parse(
      JSON.stringify({
        uri: mediaToUpload.uri,
        type: mediaToUpload.type,
        name: mediaToUpload.fileName,
      })
    )
  );



  const task = await FileSystem.createUploadTask(
    `${baseUrl}/proc_upload_fr_start.php?userId=${userId}&projectId=${projectId}&token_key=${mediaToUpload.assetId.split('/')[0]}&duration=${duracao}`,
    mediaToUpload.uri,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        token: mediaToUpload.token,
        name: mediaToUpload.fileName
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
      mediaToUpload.progress = progress;
      setProgress(progress);
      setMediaUploading(mediaToUpload);
      console.log(
        `DataSent -> ${data.totalByteSent}, DataTotal -> ${data.totalBytesExpectedToSend} -> progress: ${progress}%`
      );
    }
  );
  setMediaUploadingTask(task);

  await task
    .uploadAsync()
    .then((result) => {
      // console.log(`result of uploadAsync (task) -> ${result.body}`);
      let res2 = JSON.parse(result.body);
      // console.log(`Result do Upload Async -> res2 -> `, res2)

      if (res2.result[0].response === "Success") {
        // console.log(`media ${mediaToUpload.fileName} uploaded Successfully.`);
        console.log(`Resultado do UploadAsync foi Sucesso. Informações: `, res2.result[0])
        returnMedia = {
          fileName: res2.result[0].file_name,
          response: res2.result[0].response,
          index: index
        }

        
      } else {
        console.log(`media ${mediaToUpload.fileName} wasn't upload.`);
        returnMedia = {
          fileName: res2.result[0].file_name,
          response: res2.result[0].response,
          index: index
        }
        
      }
    })
    .catch((error) => {
      console.log(`error -> ${error}`)
      returnMedia = {
        fileName: mediaToUpload.fileName,
        error: error,
        index: index
      }
  });

  return returnMedia;
}
