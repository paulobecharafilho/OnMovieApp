import React, { useState } from "react";
import { TouchableOpacityProps, StyleSheet } from "react-native";
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
  file: FileAttatchedProps;
  customColor?: string;
  
}

export function FilesListCard({ file, customColor, ...rest }: Props) {
  const theme = useTheme();

  // console.log(`file2 -> ${file.file_name}`)

  return (
    <Container
      style={{
        borderColor:
          customColor === theme.colors.shape
            ? theme.colors.shape_inactive
            : theme.colors.text,
      }}
    >
      {file.isAttachedToProject ? <MaterialCommunityIcons name="check-circle" style={styles(theme).iconStyle}/> : null}
      <ContainerRow>
        <InitialRow>
          <Thumb width={32} height={32} source={{ uri: file.file_thumb }} />
          <TitleWrapper>
            <Title
              adjustsFontSizeToFit={true}
              numberOfLines={2}
              style={{ color: customColor ? customColor : theme.colors.shape }}
            >
              {file.file_name}
            </Title>
            <Subtitle
              style={{ color: customColor ? theme.colors.secondary : theme.colors.shape }}
            >
              {file.file_type}
            </Subtitle>
          </TitleWrapper>
        </InitialRow>

        <FinalRow>
          <Time
            style={{ color: customColor ? customColor : theme.colors.shape }}
          >
            {file.file_duration ? Number(file.file_duration).toFixed(2) : null}
          </Time>
          <IconButton {...rest}>
            <IconOptions 
              name="options-vertical"
              style={{ color: customColor ? customColor : theme.colors.shape }}
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