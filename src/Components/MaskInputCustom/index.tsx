import React from 'react';
import { MaskInputProps } from 'react-native-mask-input';

import {
  Container,
  Input,
} from './styles';

export function MaskInputCustom({...rest}: MaskInputProps) {
  return (
    <Container>
      <Input {...rest}></Input>
    </Container>
  );
}