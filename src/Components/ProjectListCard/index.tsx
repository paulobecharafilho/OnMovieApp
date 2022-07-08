import React from 'react';
import { Image, TouchableOpacityProps } from 'react-native';
import { ProgressBar } from '../ProgressBar';
import ThumExample from '../../assets/png/image_thum_example.png';

import {
  Container,
  ThumbnailsView,
  Content,
  InfoWrapper,
  Title,
  InfoRow,
  StatusView,
  StatusText,
  Scenes,
  Date,
  Icon,
} from './styles';
import { useTheme } from 'styled-components';
import { ProjectProps } from '../../utils/Interfaces';


interface Props extends TouchableOpacityProps {
  project: ProjectProps,
  highlightColor?: string,
  newStatusProj?: string,

}

export function ProjectListCard({project, highlightColor, newStatusProj, ...rest}: Props) {
  const theme = useTheme();

  return (
    <Container {...rest}>
      <ThumbnailsView>
        <Image source={ThumExample}/>
      </ThumbnailsView>
      <Content>
        <InfoWrapper>
          <Title>{project.nome_proj}</Title>
          <InfoRow>
            <StatusView style={{backgroundColor: project.highlightColor ? project.highlightColor : theme.colors.attention_light}} >
              <StatusText>{project.newStatusProj}</StatusText>
            </StatusView>
            <Scenes>Id projeto: {project.id_proj}</Scenes>
            <Date>Edição: {project.progresso}%</Date>
          </InfoRow>
        </InfoWrapper>
        {/* <ChevronRightIcon width={17} height={17} />  */}
        <Icon name="chevron-right"/>
      </Content>
      <ProgressBar progress={`${project.progresso}%`} widthCustom={'100%'} color={project.highlightColor ? project.highlightColor : theme.colors.highlight} />
    </Container>
  );
}