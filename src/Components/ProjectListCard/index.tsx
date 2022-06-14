import React from 'react';
import { FlatListProps, Image } from 'react-native';
import { ProjectDTO } from '../../dtos/ProjectDTO';
import { ProgressBar } from '../ProgressBar';
import ThumExample from '../../assets/png/image_thum_example.png';
import ChevronRightIcon from '../../assets/icons/chevronRightIcon.svg';

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

interface Props {
  project: ProjectDTO,
  highlightColor?: string
  new_status_proj?: string
}

export function ProjectListCard({project, highlightColor, new_status_proj}: Props) {
  const theme = useTheme();

  return (
    <Container>
      <ThumbnailsView>
        <Image source={ThumExample}/>
      </ThumbnailsView>
      <Content>
        <InfoWrapper>
          <Title>{project.nome_proj}</Title>
          <InfoRow>
            <StatusView style={{backgroundColor: project.highlightColor ? project.highlightColor : theme.colors.attention_light}} >
              <StatusText>{project.new_satus_proj}</StatusText>
            </StatusView>
            <Scenes>{project.progresso}</Scenes>
            <Date>{project.data_criacao}</Date>
          </InfoRow>
        </InfoWrapper>
        {/* <ChevronRightIcon width={17} height={17} />  */}
        <Icon name="chevron-right"/>
      </Content>

      <ProgressBar progress={`${project.progresso}%`} widthCustom={'100%'} color={project.highlightColor ? project.highlightColor : theme.colors.highlight} />
    </Container>
  );
}