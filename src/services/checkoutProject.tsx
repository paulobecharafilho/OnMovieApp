import React, { useState } from 'react';
import { CheckoutInfo } from '../utils/Interfaces';
import api from './api';

export async function checkoutService(userId, projectId, couponDiscount, projectName, valExtraSel, valPedido, dataLimite, editorSelect) {

  let checkoutInfo: CheckoutInfo = {} as CheckoutInfo;
  let result = '';
  console.log(`@CheckoutService - Recebendo data -> ${dataLimite}`)
  await api
  .post(`checkout.php?userId=${userId}&projId=${projectId}`, {
    couponDiscount: couponDiscount,
    nomeProj: projectName,
    valExtraSelect: editorSelect ? valExtraSel : 0,
    valPedido: valPedido,
    dataLimite: dataLimite,
    editorSelect: editorSelect
  })
  .then((response) => {
    console.log(`@checkoutProjetc -> ${JSON.stringify(response.data)}`)
    if (response.data.response === 'Success') {
      checkoutInfo = response.data.checkoutInfo[0];
      // console.log(`@checkoutProject -> CheckoutInfo = ${JSON.stringify(response.data.checkoutInfo[0])}`);
      result = 'Success';
      
    } else {
      const result = {
        result: 0
      }
    }
  })

  const resultFinal = {
    checkoutInfo: checkoutInfo,
    result: result
  }

  return resultFinal;
}