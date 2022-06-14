import React from "react";
import { Control, Controller } from "react-hook-form";
import { TextInputProps } from "react-native";
import { PageInput } from "../PageInput";
import { TextInputCustom } from "../TextInputCustom";

import { Container, Error } from "./styles";

interface Props extends TextInputProps {
  control: Control;
  name: string;
  error?: string;
}

export function PageInputForm({
  control,
  name,
  error,
  ...rest
}: Props) {
  return (
    <Container>
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <PageInput
            {...rest}
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
