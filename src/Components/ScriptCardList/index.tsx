import React, { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  StyleSheet,
  TouchableOpacityProps,
  TouchableOpacity,
} from "react-native";
import { ScaleDecorator } from "react-native-draggable-flatlist";
import { useTheme } from "styled-components";
import api, { libraryBaseUrl } from "../../services/api";
import { ScenesProps } from "../../utils/Interfaces";

import {
  Container,
  SceneRow,
  SceneRowBegin,
  SceneDragIcon,
  SceneThumb,
  SceneTitleWrapper,
  SceneTitle,
  SceneSubtitle,
  SceneRowEnd,
  SceneFinalIcon,
} from "./styles";

interface ScriptCardListProps extends TouchableOpacityProps {
  drag: () => void;
  isActive: boolean;
  backgroundColorCustom: string;
  item: ScenesProps;
  index: number;
  userId: number;
  handleOpenSceneModal: (sceneChosen: ScenesProps) => void;
}

export function ScriptCardList({
  drag,
  isActive,
  backgroundColorCustom,
  item,
  index,
  userId,
  handleOpenSceneModal,
  ...rest
}: ScriptCardListProps) {
  const theme = useTheme();

  function handleGoToSceneDetails() {
    handleOpenSceneModal(item)
    console.log(`Scene Chosen -> ${item.post_id}`)
  }

  return (
    <ScaleDecorator>
      <TouchableOpacity
        onLongPress={drag}
        onPress={handleGoToSceneDetails}
        disabled={isActive}
        style={[
          styles(theme).container,
          {
            backgroundColor: isActive
              ? theme.colors.highlight
              : backgroundColorCustom,
          },
        ]}
      >
        <SceneRow>
          <SceneRowBegin>
            <SceneDragIcon name="drag" />
            <SceneThumb
              source={
                item.thumbnail != "0"
                  ? { uri: `${libraryBaseUrl}/${userId}/thumbnails/${item.thumbnail}` }
                  : require(`../../assets/png/fileThumbnailExample.png`)
              }
            />
            <SceneTitleWrapper>
              <SceneTitle>Cena {index + 1}</SceneTitle>
              <SceneSubtitle>
                {item.file_name ? item.file_name : 'Nenhum arquivo na cena'}
              </SceneSubtitle>
            </SceneTitleWrapper>
          </SceneRowBegin>
          <SceneRowEnd>
            <SceneFinalIcon name="chevron-right-circle" />
          </SceneRowEnd>
        </SceneRow>
      </TouchableOpacity>
    </ScaleDecorator>
  );
}

const styles = (theme: any) =>
  StyleSheet.create({
    container: {
      width: "100%",
      borderStyle: "solid",
      borderWidth: 0.5,
      borderRadius: 20,
      borderColor: theme.colors.primary,

      paddingVertical: 10,
      paddingHorizontal: 20,
      marginTop: 10,
    },
  });
