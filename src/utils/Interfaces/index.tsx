import { ProjectDTO } from "../../dtos/ProjectDTO";

export interface ProjectProps extends ProjectDTO {
  highlightColor?: string;
  newStatusProj?: string;
  dateCreatedFormatted?: string;
  dateModifiedFormatted?: string;
}

export interface FilesProps {
  file_type:  string,
  file_name: string,
  file_size:  string,
  description:  string,
  file_id:  number,
  file_thumb:  string,
  duracao: number,
}

export interface ScenesProps {
  post_id: number;
  id_user: number;
  id_proj: number;
  post_order_no: number;
  thumbnail?: string;
  entrada?: string;
  saída?: string;
  descricao?: string;
  audio_descr?: string;
  video_descr?: string;
  file_id?: number;
  file_name?: string;
  prod_id?: number;
  prod_name?: string;
  prod_file?: string;
  file_type?: string;
  folder?: string;
}

export interface PaymentInfoProps {
  qtd_extra_formats?: number;
  val_formatos_extra?: number;
  val_tot_extr_form_real?: number;
  val_edicao?: number;
  val_edicao_real?: number;
  val_ped?: number;
  val_tot_ped_real?: number;
  valor_extra_sel?: number;
  valor_extra_sel_conv?: number;
  valor_com_extra_sel?: number;
  valor_com_extra_sel_real?: number;
  desconto_cupom?: number;
}

export interface CheckoutInfo {
  payment_method: string;
  payment_using_credits: number;
  payment_using_credits_formatted: string;
  payment_using_money: number;
  payment_using_money_formatted: string;
  card_charge_formatted_to_stripe: number,
  saldo_user: number;
  erro: string;
}

export interface ChatProps {

  id_msg: string;
  origem: string;
  destino: string;
  mensagem: string;
  id_user_origem: number;
  id_user_destino: number;
  status: string;

  data_sent: string;
  date_viewed: string;
}

export interface OrderProps {
  order_id: number;
  checkout_session_id: number;
  pag_intent_id: string;
  pay_method: string;
  pay_using_credit: number;
  customer_email: string;
  order_price: number;
  paid_amount: number;
  card_brand: string;
  four_digits: string;
  origem: string;
  balance_txn: string;
  payment_status: string;
  created: string;
  success_date: string;
  val_extra_format: number;
  qtd_format_extra: number;
}

export interface NotificationsProps {
  id_notifica: number;
  id_origem: number;
  id_proj: number;
  origem: string;
  avatar: string;
  id_destino: number;
  nome_origem: string;
  nome_destino: string;
  descricao: string;
  prioridade: string;
  status: string;
  data: string;
}