import React from 'react';
import { TextInputProps } from 'react-native';

import {
  Container,
  Input,
  VisibleButton,
  IconFinal,
} from './styles';

interface Props extends TextInputProps {
  visibleButton?: boolean;
  onVisibleButtonPress?: () => void;
}

export function PageInput({visibleButton, onVisibleButtonPress, ...rest}: Props) {
  return (
    <Container>
      <Input {...rest} />
      {visibleButton ? (
        <VisibleButton onPress={onVisibleButtonPress}>
          <IconFinal name="eye" />
        </VisibleButton>
      ) : null}
    </Container>
  );
}