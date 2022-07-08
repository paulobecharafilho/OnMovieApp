import React from "react";
import { Dimensions, TouchableOpacityProps } from "react-native";
import { useTheme } from "styled-components";

import { Container, Title } from "./styles";

export interface ButtonProps extends TouchableOpacityProps {
  text: string;
  disabled?: boolean;
  backgroundColor?: string;
  highlightColor?: string, 
}

export function ButtonCustom({ text, backgroundColor, highlightColor, disabled, ...rest }: ButtonProps) {
  const theme = useTheme();
  return (
    <Container disabled={disabled} style={{backgroundColor: backgroundColor ? backgroundColor : theme.colors.shape}} {...rest} >
      <Title style={{color: disabled || highlightColor ? theme.colors.shape : theme.colors.primary}} >{text}</Title>
    </Container>
  );
}
