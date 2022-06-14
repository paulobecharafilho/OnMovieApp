import React from 'react';
import { useTheme } from 'styled-components';

import {
  Container,
  ProgressBarEmpty,
  ProgressBarFilled,
} from './styles';

interface Props {
  progress: string;
  color?: string;
  widthCustom?: string;
}

export function ProgressBar({progress, color, widthCustom} : Props) {
  const theme = useTheme();

  return (
    <Container>
      <ProgressBarEmpty style={{width: widthCustom ? widthCustom : '90%'}}>
        <ProgressBarFilled style={{width: progress, backgroundColor: color ? color : theme.colors.highlight}} />
      </ProgressBarEmpty>
    </Container>
  );
}