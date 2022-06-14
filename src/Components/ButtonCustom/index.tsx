import React from "react";
import { Dimensions, TouchableOpacityProps } from "react-native";
import { useTheme } from "styled-components";

import { Container, Title } from "./styles";

interface ButtonProps extends TouchableOpacityProps {
  text: string;
  disabled?: boolean;
}

export function ButtonCustom({ text, disabled, ...rest }: ButtonProps) {
  const theme = useTheme();
  return (
    <Container disabled={disabled} {...rest} >
      <Title style={{color: disabled ? theme.colors.shape : theme.colors.primary}} >{text}</Title>
    </Container>
  );
}
