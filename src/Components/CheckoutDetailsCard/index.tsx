import React, { useState } from "react";
import { TouchableOpacityProps, StyleSheet, Switch } from "react-native";
import { useTheme } from "styled-components";
import { FilesProps } from "../../utils/Interfaces";
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
  Container,
  ContainerRow,
  InitialRow,
  Thumb,
  TitleWrapper,
  Title,
  Subtitle,
  FinalRow,
  Time,
  IconButton,
  IconOptions,
} from "./styles";

interface FileAttatchedProps extends FilesProps {
  isAttachedToProject?: boolean;
}

interface Props extends TouchableOpacityProps{
  title: string;
  subtitle: string;
  price: number;
  customColor?: string;
  hasToggle?: boolean;
  isToggleOn?: boolean;
  handleChangeToggle?: ()=> void;
  isDiscount?: boolean
}

export function CheckoutDetailsCard({ title, subtitle, price, customColor, hasToggle, isToggleOn, handleChangeToggle, isDiscount,  ...rest }: Props) {
  const theme = useTheme();

  // console.log(`file2 -> ${file.file_name}`)

  return (
    <Container
      style={{
        borderColor:
          customColor === theme.colors.primary
            ? customColor
            : theme.colors.primary_light,

        backgroundColor: isDiscount ? theme.colors.secondary : null,
      }}

      {...rest}
    >
      <ContainerRow>
        <InitialRow>
          {hasToggle ? 
            <Switch 
              trackColor={{ false: theme.colors.inactive, true: theme.colors.highlight }}
              thumbColor={theme.colors.shape}
              ios_backgroundColor="#3e3e3e"
              onValueChange={handleChangeToggle}
              value={isToggleOn}
              style={{ transform: [{ scaleX: .7 }, { scaleY: .7 }] }}
              
            /> 
          : null}
          <TitleWrapper>
            <Title
              adjustsFontSizeToFit={true}
              numberOfLines={1}
              style={{ color: customColor ? customColor : theme.colors.primary }}
            >
              {title}
            </Title>
            <Subtitle
              style={{ color: customColor ? theme.colors.secondary : theme.colors.primary }}
              adjustsFontSizeToFit
              numberOfLines={1}
            >
              {subtitle}
            </Subtitle>
          </TitleWrapper>
        </InitialRow>

        <FinalRow>
          {isDiscount ? 
          <Title 
            adjustsFontSizeToFit numberOfLines={1}
            style={{ color: customColor ? customColor : theme.colors.primary }}>- {price}</Title>
          :
          <Title 
            adjustsFontSizeToFit numberOfLines={1}
            style={{ color: customColor ? customColor : theme.colors.primary }}>{hasToggle ? `+ ${price}` : price}</Title>
          }
        </FinalRow>
      </ContainerRow>
    </Container>
  );
}


const styles = (theme) => StyleSheet.create({
  iconStyle: {
    position: "absolute",
    top: 0,
    left: 0,
    fontSize: 20,
    color: theme.colors.highlight,
  }
})