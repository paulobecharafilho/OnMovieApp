import React from 'react';
import { ChatProps, ProjectProps } from '../../utils/Interfaces';

import {
  ContainerEditor,
  ContainerUser,
  Message,
  DateSent,
} from './styles';

interface ChatCardParams {
  message: ChatProps;
  project: ProjectProps;
}

export function ChatCard({message, project, ...rest}: ChatCardParams) {
  return (
    message.origem === 'editor' ? 
      <ContainerEditor>
        <Message>{message.mensagem}</Message>
        <DateSent>{message.data_sent}</DateSent>
      </ContainerEditor>
    : 
    <ContainerUser>
      <Message>{message.mensagem}</Message>
      <DateSent>{message.data_sent}</DateSent>
    </ContainerUser>
  );
}
