import React from 'react';
import { PaymentInfoProps } from '../utils/Interfaces';
import api from './api';



export async function getPaymentInfo(userId, projectId, couponDiscount) {

  let paymentInfo = {} as PaymentInfoProps;
  let result: string = '';

  await api
  .post(`proc_calc_valor.php?userId=${userId}&projectId=${projectId}`, {
    couponDiscount: couponDiscount
  })
  .then((response) => {
    if (response.data.response === 'Success') {
      paymentInfo = response.data.paymentInfo;
      result = 'Success';
      
    } else {
      const result = {
        result: '0'
      }
    }
  })

  const resultFinal = {
    paymentInfo: paymentInfo,
    result: result
  }

  return resultFinal;
}