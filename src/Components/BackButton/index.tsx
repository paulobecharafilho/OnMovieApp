import React from 'react';
import { TouchableOpacityProps } from 'react-native';
import { useTheme } from 'styled-components';

import {
  Container,
  Icon,
} from './styles';

interface BackButtonProps extends TouchableOpacityProps {
  color?: string
}

export function BackButton({ color, ...rest }: BackButtonProps) {
  const theme = useTheme();
  
  return (
    <Container>
      <Icon 
        name="chevron-left"
        color={color ? color : theme.colors.shape}
      />
    </Container>
  );
}