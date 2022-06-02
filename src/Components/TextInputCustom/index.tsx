import React from 'react';
import { TextInputProps } from 'react-native';
import { useTheme } from 'styled-components';



import {
  Container,
  Icon,
  Title,
} from './styles';

interface InputProps extends TextInputProps{
  icon?: string;
  text: string;
}

export function TextInputCustom({icon, text, onChangeText}: InputProps) {
  const theme = useTheme();

  return (
    <Container>
      {icon ? (<Icon name={icon}/>)  : null}
      <Title 
        placeholder={text}
        placeholderTextColor={theme.colors.shape}
        keyboardType='email-address'
        onChangeText={onChangeText}
        
      />
    </Container>
  );
}