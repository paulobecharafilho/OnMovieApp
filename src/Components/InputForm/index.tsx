import React from "react";
import { Control, Controller } from "react-hook-form";
import { TextInputProps } from "react-native";
import { TextInputCustom } from "../TextInputCustom";

import { Container, Error } from "./styles";

interface Props extends TextInputProps {
  icon?: string;
  text: string;
  visibleButton?: boolean;
  onVisibleButtonPress?: () => void;

  control: Control;
  name: string;
  error?: string;
}

export function InputForm({
  control,
  name,
  error,
  icon,
  text,
  visibleButton,
  onVisibleButtonPress,
  ...rest
}: Props) {
  return (
    <Container>
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInputCustom
            {...rest}
            text={text}
            icon={icon}
            visibleButton={visibleButton}
            onVisibleButtonPress={onVisibleButtonPress}
            onChangeText={onChange}
            value={value}
          />
        )}
        name={name}
      />
      {error ? <Error>{error}</Error> : null}
    </Container>
  );
}
