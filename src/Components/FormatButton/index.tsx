import React from 'react';
import { TouchableOpacityProps } from 'react-native';
import { useTheme } from 'styled-components';

import {
  Container,
  Icon,
  Title,
} from './styles';

interface FormatProps {
  icons: string[],
  title: string,
  isSelected?: boolean,
}

interface Props extends TouchableOpacityProps {
  format: FormatProps;
  backgroundColor: string,
  textColor: string, 
}

export function FormatButton({ format, backgroundColor, textColor, ...rest}: Props) {

  const theme = useTheme();

  return (
    <Container {...rest} style={{backgroundColor: backgroundColor}} >
      {format.icons.map((item) => (
        <Icon name={item} style={{color: textColor}} key={item} />
      ))}
      <Title style={{color: textColor}} >|  {format.title}</Title>
    </Container>
  );
}