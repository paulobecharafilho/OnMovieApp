import React, { useState } from "react";
import { TouchableOpacityProps, StyleSheet } from "react-native";
import { useTheme } from "styled-components";
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

interface NotificationCardParams extends TouchableOpacityProps {
 title: string;
 message: string;
 origem?: string;
 icon: string;
 customBackgroundColor?: string;
 customTextColor?: string;
 customBorderColor?: string;
}

export function NotificationsCard({ title, message, icon, origem, customBackgroundColor, customTextColor, customBorderColor, ...rest }: NotificationCardParams) {
  const theme = useTheme();



  // console.log(`file2 -> ${file.file_name}`)

  return (
    <Container
      style={{
        borderColor:
          customBorderColor
            ? customBorderColor
            : theme.colors.primary,
      }}
      {...rest}
    >
      <ContainerRow>
        <InitialRow>
          <MaterialCommunityIcons style={{width: 32, height: 32,}} name={icon}/>
          <TitleWrapper>
            <Title
              adjustsFontSizeToFit={true}
              numberOfLines={2}
              style={{ color: customTextColor ? customTextColor : theme.colors.primary }}
            >
              {title}
            </Title>
            <Subtitle
              style={{ color: customTextColor ? customTextColor : theme.colors.primary }}
            >
              {message}
            </Subtitle>
          </TitleWrapper>
        </InitialRow>

        <FinalRow>
          <IconButton {...rest}>
            <IconOptions 
              name="options-vertical"
              style={{ color: customTextColor ? customTextColor : theme.colors.primary }}
            />
          </IconButton>
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