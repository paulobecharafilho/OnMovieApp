import React from "react";
import api from "./api";

export async function checkFileExists(
  userId,
  projectId,
  fileName,
  assetId
) {

  let resposta = {
    error: null,
    result: null,
    token: null
  }
  await api
    .get(
      `check-exists.php?userId=${userId}&projectId=${projectId}&fileName=${fileName}&token_key=${assetId}`
    )
    .then((response) => {
      // console.log(`${response.data.result[0].response} proj_dep: ${response.data.result[0].fileInProject}`);
      if (response.data.result[0].response === 0) {
        let token = response.data.result[0].token;
        
        // console.log(`item ${item.filename} com token ${item.token}`);
        
        resposta.token = token, 
        resposta.result = 'Success'
        
        // console.log(`CheckExists Reposta se não existir -> `,resposta)

      } else if (
        response.data.result[0].response === 1 ||
        response.data.result[0].response === 2 ||
        response.data.result[0].response === 3
      ) {
        resposta.result = 'FileExists'
      }
    })
    .catch((e) => {
      console.log(`error -> `, e);
      resposta.result = 'Error';
      resposta.error = e;
    });

    return resposta;
}
