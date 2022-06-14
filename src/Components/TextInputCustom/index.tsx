import React from "react";
import { KeyboardType, TextInputProps, Touchable } from "react-native";
import { useTheme } from "styled-components";

import { Container, Icon, Input, VisibleButton, IconFinal } from "./styles";

interface InputProps extends TextInputProps {
  icon?: string;
  text: string;
  visibleButton?: boolean;
  onVisibleButtonPress?: () => void;
}

export function TextInputCustom({
  icon,
  text,
  visibleButton,
  onVisibleButtonPress,
  ...rest
}: InputProps) {
  const theme = useTheme();

  return (
    <Container>
      {icon ? <Icon name={icon} /> : null}
      <Input
        {...rest}
        placeholder={text}
        placeholderTextColor={theme.colors.shape}
      />
      {visibleButton ? (
        <VisibleButton onPress={onVisibleButtonPress}>
          <IconFinal name="eye" />
        </VisibleButton>
      ) : null}
    </Container>
  );
}
