import React from "react";
import { KeyboardType, TextInputProps, Touchable } from "react-native";
import { useTheme } from "styled-components";

import { Container, Icon, Input, VisibleButton, IconFinal } from "./styles";

interface InputProps extends TextInputProps {
  icon?: string;
  text: string;
  visibleButton?: boolean;
  onVisibleButtonPress?: () => void;
  backgroundColorCustom?: string;
  borderColorCustom?: string;
  buttonColor?: string;
  customTextColor?: string
}

export function TextInputCustom({
  icon,
  text,
  visibleButton,
  onVisibleButtonPress,
  backgroundColorCustom,
  borderColorCustom,
  buttonColor,
  customTextColor,
  ...rest
}: InputProps) {
  const theme = useTheme();

  return (
    <Container
      style={{
        backgroundColor: backgroundColorCustom
          ? backgroundColorCustom
          : borderColorCustom ? theme.colors.shape : theme.colors.inactive,
        borderStyle: borderColorCustom
          ? "solid"
          : null,
        borderWidth: borderColorCustom
          ? 0.5
          : null,
        borderRadius: borderColorCustom
          ? 10
          : null,
        borderColor: borderColorCustom
          ? borderColorCustom
          : null,
      }}
    >
      {icon ? <Icon name={icon} style={{color: customTextColor ? customTextColor : theme.colors.text}}/> : null}
      <Input
        {...rest}
        placeholder={text}
        placeholderTextColor = {customTextColor ? customTextColor : theme.colors.text}
      />
      {visibleButton ? (
        <VisibleButton onPress={onVisibleButtonPress}>
          <IconFinal name="eye" style={{color: buttonColor ? buttonColor : theme.colors.shape}}/>
        </VisibleButton>
      ) : null}
    </Container>
  );
}
