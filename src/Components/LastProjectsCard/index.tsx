import React from "react";
import { TouchableOpacityProps } from "react-native";
import { ProjectDTO } from "../../dtos/ProjectDTO";
import { ProgressBar } from "../ProgressBar";

// const ThumbExample = require("../../assets/png/image_thum_example.png");
const ThumbExample = require("../../assets/icons/FavIconBranco.png");

import {
  Container,
  ThumbImage,
  TitleWrapper,
  Title,
  StatusView,
  StatusTitle,
  Subtitle,
  ProgressView,
  ProgressSubtitle,
} from "./styles";
import { useTheme } from "styled-components";


interface ProjectProps extends ProjectDTO {
  newStatusProj: string;
  highlightColor: string;
}

interface Props extends TouchableOpacityProps{
  project: ProjectProps;
}

export function LastProjectsCard({
  project,
  ...rest
}: Props) {
  const theme = useTheme();

  return (
    <Container {...rest }>
      <ThumbImage source={ThumbExample} style={{width: 35, height: 35}} />
      <StatusView style={{ backgroundColor: project.highlightColor }}>
        <StatusTitle adjustsFontSizeToFit numberOfLines={1}>{project.newStatusProj}</StatusTitle>
      </StatusView>
      <TitleWrapper>
        <Title adjustsFontSizeToFit >{project.nome_proj}</Title>
        <Subtitle>Id: {project.id_proj}</Subtitle>
      </TitleWrapper>

      <ProgressView>
        <ProgressBar
          progress={`${project.progresso}%`}
          widthCustom={"110%"}
          color={
            project.highlightColor
              ? project.highlightColor
              : theme.colors.highlight
          }
        />
      </ProgressView>
    </Container>
  );
}
