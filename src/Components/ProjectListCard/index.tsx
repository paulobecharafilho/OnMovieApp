import React from "react";
import { Image, TouchableOpacityProps } from "react-native";
import { ProgressBar } from "../ProgressBar";
// import ThumExample from '../../assets/png/image_thum_example.png';
import ThumExample from "../../assets/icons/FavIconBranco.png";

import {
  Container,
  ThumbnailsView,
  Content,
  InfoWrapper,
  TitleRow,
  Title,
  InfoRow,
  StatusView,
  StatusText,
  Scenes,
  Date,
  Icon,
} from "./styles";
import { useTheme } from "styled-components";
import { ProjectProps } from "../../utils/Interfaces";

interface Props extends TouchableOpacityProps {
  project: ProjectProps;
  highlightColor?: string;
  newStatusProj?: string;
}

export function ProjectListCard({
  project,
  highlightColor,
  newStatusProj,
  ...rest
}: Props) {
  const theme = useTheme();

  return (
    <Container {...rest}>
      <Content>
        <InfoWrapper>
          <TitleRow>
            <ThumbnailsView>
              <Image source={ThumExample} style={{ width: 40, height: 40 }} />
            </ThumbnailsView>
            <Title>{project.nome_proj}</Title>
          </TitleRow>
          <InfoRow>
            <StatusView
              style={{
                backgroundColor: project.highlightColor
                  ? project.highlightColor
                  : theme.colors.attention_light,
              }}
            >
              <StatusText>{project.newStatusProj}</StatusText>
            </StatusView>
            <Scenes>Id projeto: {project.id_proj}</Scenes>
            <Date>Edição: {project.progresso}%</Date>
          </InfoRow>
        </InfoWrapper>
        {/* <ChevronRightIcon width={17} height={17} />  */}
        <Icon name="chevron-right" />
      </Content>
      <ProgressBar
        progress={`${project.progresso}%`}
        widthCustom={"100%"}
        color={
          project.highlightColor
            ? project.highlightColor
            : theme.colors.highlight
        }
      />
    </Container>
  );
}
