import { useFocusEffect, useRoute } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Linking, ScrollView } from "react-native";
import { useTheme } from "styled-components";
import { AudioPlayer } from "../../Components/AudioPlayer";
import { BackButton } from "../../Components/BackButton";
import { ButtonCustom } from "../../Components/ButtonCustom";
import { libraryBaseUrl } from "../../services/api";
import { getProjectAudio } from "../../services/getProjectAudio";
import { ProjectProps } from "../../utils/Interfaces";

const ThumbExample = require(`../../assets/png/ThumbsExampleBig.png`);

import {
  Container,
  Header,
  HeaderWrapper,
  HeaderTitle,
  HeaderLogo,
  Content,
  ContentHeader,
  Thumb,
  ContentStatusWrapper,
  ContentStatus,
  ContentTitle,
  InfoContainer,
  InfoTitleWrapperFlex1,
  InfoTitleWrapperFlex2,
  InfoTitle,
  InfoSubtitle,
  ButtonWrapper,
} from "./styles";

interface Params {
  userId: number;
  project: ProjectProps;
}

export function ProjectDescriptionDetails({ navigation }) {
  const theme = useTheme();
  const route = useRoute();

  const { userId, project } = route.params as Params;

  const [projectFormats, setProjectFormats] = useState<string[]>([]);
  const [audioUri, setAudioUri] = useState("");
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      async function getAudio() {
        await getProjectAudio(userId, project.id_proj).then((result) => {
          console.log(
            `@ProjectDescriptionDetails:GETAUDIO() -> result -> ${JSON.stringify(
              result
            )}`
          );
          if (result.result === "Success") {
            let audioProjectUri = `${libraryBaseUrl}${userId}/${project.id_proj}/audios/${result.projectAudioMsg.file_msg}`;
            setAudioUri(audioProjectUri);
            setLoading(false);
          } else {
            setLoading(false);
          }
        });
      }

      getAudio();

      let formatsAux: string[] = JSON.parse(project.video_format);
      if (formatsAux){
        formatsAux.map((format) => {
          setProjectFormats((old) => [...old, format]);
        });
      }
    }, [project])
  );

  function handleBackButton() {
    navigation.goBack();
  }

  function handleGoToEditDescription() {
    navigation.navigate(`NewProject`, {
      userId: userId,
      projectToEdit: project,
    });
  }

  return (
    <Container>
      <Header>
        <HeaderWrapper>
          <BackButton onPress={handleBackButton} />
          <HeaderTitle>Descrição</HeaderTitle>
          <HeaderLogo />
        </HeaderWrapper>
      </Header>

      {loading ? (
        <ActivityIndicator />
      ) : (
        <Content>
          <ContentHeader>
            {/* <Thumb resizeMode="contain" source={ThumbExample} /> */}
            <ContentStatusWrapper backgroundColor={project.highlightColor}>
              <ContentStatus>{project.newStatusProj}</ContentStatus>
            </ContentStatusWrapper>
            <ContentTitle adjustsFontSizeToFit={true} numberOfLines={2}>
              {project.nome_proj}
            </ContentTitle>
          </ContentHeader>

          <InfoContainer>
            <InfoTitleWrapperFlex1>
              <InfoTitle>Nome do Projeto:</InfoTitle>
              <InfoSubtitle>{project.nome_proj}</InfoSubtitle>
            </InfoTitleWrapperFlex1>

            <InfoTitleWrapperFlex1>
              <InfoTitle>Id do Projeto:</InfoTitle>
              <InfoSubtitle>{project.id_proj}</InfoSubtitle>
            </InfoTitleWrapperFlex1>

            <InfoTitleWrapperFlex2>
              <InfoTitle>Descrição:</InfoTitle>
              <ScrollView contentContainerStyle={{height: '90%'}}>
                <InfoSubtitle>{project.descri_proj}</InfoSubtitle>  
              </ScrollView>
            </InfoTitleWrapperFlex2>

            <InfoTitleWrapperFlex1>
              <InfoTitle>Duração do vídeo finalizado:</InfoTitle>
              <InfoSubtitle>
                {project.duracao_compl} {project.duracao_proj}
              </InfoSubtitle>
            </InfoTitleWrapperFlex1>

            <InfoTitleWrapperFlex1>
              <InfoTitle>link de referência:</InfoTitle>
              <InfoSubtitle
                adjustsFontSizeToFit={true}
                numberOfLines={3}
                style={{ color: theme.colors.highlight_pink, textDecorationLine: "underline" }}
                onPress={() => Linking.openURL(project.link_proj)}
              >
                {project.link_proj}
              </InfoSubtitle>
            </InfoTitleWrapperFlex1>

            <InfoTitleWrapperFlex1>
              <InfoTitle>Áudio enviado:</InfoTitle>
              {audioUri ? 
                <AudioPlayer
                  audioMomentStart={"recorded"}
                  audioUriStart={audioUri}
                  setLoading={setLoading}
                />
              : null}
            </InfoTitleWrapperFlex1>

            <InfoTitleWrapperFlex1>
              <InfoTitle>Formatos solicitados:</InfoTitle>
              <FlatList 
                data={projectFormats}
                keyExtractor={(item) => item}
                renderItem={({item}) => (
                  <InfoSubtitle>{item};  </InfoSubtitle>
                )}
                horizontal
              />
            </InfoTitleWrapperFlex1>

            <ButtonWrapper>
              <ButtonCustom
                text="Editar"
                backgroundColor={
                  project.status_proj === "Rascunho"
                    ? theme.colors.primary
                    : theme.colors.text
                }
                highlightColor={theme.colors.primary}
                disabled={project.status_proj === "Rascunho" ? false : true}
                onPress={handleGoToEditDescription}
              />
            </ButtonWrapper>
          </InfoContainer>
        </Content>
      )}
    </Container>
  );
}
