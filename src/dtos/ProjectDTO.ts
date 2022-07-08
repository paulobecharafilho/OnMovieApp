import { FilesProps } from "../utils/Interfaces";

export interface ProjectDTO {
  id_proj: string,
  id_usuario: number,
  status_proj: string,
  nome_proj: string,
  nome_usuario: string,
  descri_proj: string,
  link_proj?: string,
  video_format: string[],
  duracao_proj: string,
  valor_proj?: number,
  data_criacao?: string,
  duracao_compl?: string,
  extra_file?: number,
  valor_serv_parc?: number,
  pendencia?: string,
  data_solicita?: string,
  data_limite?: string,
  roteiro?: string,
  status_pgto?: string,
  id_pgto?: string,
  valor_bloqueado?: number,
  valor_pago_net?: number,
  valor_pago_credito?: number,
  devolucao?: string,
  data_devolucao?: string,
  progresso?: number,
  date_modified?: string,
  data_aceite?: string,
  id_editor?: number,
  arquivo_final?: string,
  msg_final_file?: string,
  data_final_1?: string,
  data_final_2?: string,
  data_aprova?: string,
  estrelas?: number,
  qtd_files: number,
  files: FilesProps[],
}