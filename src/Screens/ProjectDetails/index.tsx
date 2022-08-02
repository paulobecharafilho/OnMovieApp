import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { useTheme } from "styled-components";
import { ProjectDTO } from "../../dtos/ProjectDTO";

import { ProjectDetailsCard } from "../../Components/ProjectDetailsCard";
import { BackButton } from "../../Components/BackButton";
import { ProgressBar } from "../../Components/ProgressBar";

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
  ContentInfoRow,
  ContentTitle,
  ContentColumWrapper,
  ContentColumSubtitle,
  ContentColumTitle,
  ContentProgress,
  ContentProgressTitle,
  ContentCardsScrollView,
} from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFiles } from "../../services/getFiles";
import { getProjetctFiles } from "../../services/getProjectFiles";
import { FilesProps } from "../../utils/Interfaces";

interface ProjectProps extends ProjectDTO {
  newStatusProj: string;
  highlightColor: string;
}

interface Props {
  project: ProjectProps;
  userId?: number,
}

export function ProjectDetails({navigation}) {
  const theme = useTheme();
  
  const route = useRoute();
  const { project, userId } = route.params as Props;

  const [descriptionComplete, setDescriptionComplete] = useState(false);
  const [cloudMovieComplete, setCloudMovieComplete] = useState(false);
  const [scriptCompleted, setScriptCompleted] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  const [totalVideoTime, setTotalVideoTime] = useState(0);

  function handleGoToProjectCloud() {
    navigation.navigate(`ProjectCloudMovie`, {
      userId: userId,
      projectId: project.id_proj,
      from: 'projectDetails',
      project: project,
    })
  }

  function handleBackButton() {
    navigation.navigate(`Home`);
  }

  function handleGoToProjectDescriptionDetails(){
    navigation.navigate(`ProjectDescriptionDetails`, {
      userId: userId,
      project: project
    })
  }

  function handleGoToCheckoutDetails() {
    navigation.navigate(`CheckoutDetails`, {
      userId: userId,
      projectReceived: project
    })
  }

  function handleGoToPaymentDetails() {
    navigation.navigate(`PaymentDetails`, {
      project: project,
      userId: userId,
    })
  }

  function handleGoToScript() {
    navigation.navigate(`Script`, {
      userId: userId,
      project: project,
      from:'ProjectDetails'
    })
  }

  function handleGoToChat() {
    navigation.navigate(`Chat`, {
      project: project,
    })
  }

  function handleGoToApprove() {
    navigation.navigate(`Approve`, {
      userId: userId,
      project: project,
    })
  }

  

  useFocusEffect(
    useCallback(() => {
      if (project.nome_proj && project.video_format && project.duracao_proj && project.duracao_compl) {
        setDescriptionComplete(true);
      }

      if (project.status_proj != 'Rascunho') {
        setCheckoutComplete(true);
      }

      async function sumVideoTime(){
        // console.log(`iniciando soma do tempo`)
        await getProjetctFiles(userId, project.id_proj)
        .then((response) => {
          if (response.result === 'Success') {
            let totalTime = 0;
            response.libraryDependenciesFiles.forEach((element: FilesProps) => {
              totalTime += Number(element.duracao);
              // console.log(`@ProjectDetails -> Somando tempo ${element.duracao} do arquivo ${element.file_name}`)
            })

            // console.log(`TotalTime -> ${totalTime}`)
            setTotalVideoTime((totalTime/60).toFixed(2));
          }
        })
      }

      async function checkCloudMovieCompleted() {
        if (project.qtd_files) {
          setCloudMovieComplete(true)
        } else {
          await AsyncStorage.getItem(`@onmovieapp:projectId=${project.id_proj}:cloudMovieCompleted`)
          .then((result) => {
            if (result === 'true') {
              setCloudMovieComplete(true)
            } else {
              setCloudMovieComplete(false);
            }
          })
        }
      }

      async function checkScriptCompleted() {
        let result = await AsyncStorage.getItem(`@onmovieapp:project=${project.id_proj}:isScriptCompleted`);
        // console.log(`@ProjectDetails - isSriptCompleted ${result}`);
        if (result === 'true') {
          setScriptCompleted(true)
        } else {
          setScriptCompleted(false);
        }
      }

      checkCloudMovieCompleted();
      checkScriptCompleted();
      sumVideoTime();

    }, [project])
  )

  return (
    <Container>
      <Header>
        <HeaderWrapper>
          <BackButton onPress={handleBackButton} />
          <HeaderTitle>Resumo</HeaderTitle>
          <HeaderLogo />
        </HeaderWrapper>
      </Header>

      <Content>
        <ContentHeader>
          <Thumb resizeMode="contain" source={ThumbExample}/>
          <ContentStatusWrapper backgroundColor={project.highlightColor}>
            <ContentStatus>{project.newStatusProj}</ContentStatus>
          </ContentStatusWrapper>
          <ContentTitle 
            adjustsFontSizeToFit={true}
            numberOfLines={2}
          >
            {project.nome_proj}
          </ContentTitle>
          <ContentInfoRow>
            <ContentColumWrapper>
              <ContentColumSubtitle>Id do Projeto:</ContentColumSubtitle>
              <ContentColumTitle>{project.id_proj}</ContentColumTitle>
            </ContentColumWrapper>
            <ContentColumWrapper>
              <ContentColumSubtitle>Tempo de vídeo:</ContentColumSubtitle>
              <ContentColumTitle>{totalVideoTime} minutos</ContentColumTitle>
            </ContentColumWrapper>
            <ContentColumWrapper>
              <ContentColumSubtitle>Tempo de vídeo:</ContentColumSubtitle>
              <ContentColumTitle>125 minutos</ContentColumTitle>
            </ContentColumWrapper>
          </ContentInfoRow>
          <ContentProgress>
            <ContentProgressTitle>Progresso da edição: {project.progresso}%</ContentProgressTitle>
            <ProgressBar widthCustom="100%" progress={`${project.progresso}%`} />
          </ContentProgress>
        </ContentHeader>

        <ContentCardsScrollView 
          contentContainerStyle={styles.scrollViewStyle}
          showsVerticalScrollIndicator={false}
        >
          <ProjectDetailsCard 
            title="Descrição"
            subtitle='Informações do projeto'
            icon='text-box-outline'
            isCompleted={descriptionComplete}
            onPress={handleGoToProjectDescriptionDetails}
          />
          
          <ProjectDetailsCard 
            onPress={handleGoToProjectCloud}
            title="Cloud Movie"
            subtitle='Arquivos anexados ao projeto'
            icon='cloud-outline'
            isCompleted={cloudMovieComplete}
          />
          <ProjectDetailsCard 
            onPress={handleGoToScript}
            title="Estúdio de Criação"
            subtitle='Roteiro e cenas do vídeo'
            icon='movie-outline'
            isCompleted={scriptCompleted}
          />
          <ProjectDetailsCard 
            onPress={checkoutComplete ? handleGoToPaymentDetails : handleGoToCheckoutDetails}
            title="Checkout e Pagamento"
            subtitle='Detalhamentos e Recibos'
            icon='credit-card-outline'
            isCompleted={checkoutComplete}
          />
          <ProjectDetailsCard 
            onPress={handleGoToChat}
            title="Chat com o Editor"
            subtitle='Converse com o editor do seu projeto'
            icon='message-processing-outline'
            isDisabled={project.status_proj === 'Rascunho' || project.status_proj === 'Aprovado' || project.status_proj === 'Na Fila' ? true : false}
          />
          <ProjectDetailsCard
            onPress={handleGoToApprove}
            title="Aprovação e Download"
            subtitle='Aprove ou solicite correções'
            icon='checkbox-outline'
            isDisabled={project.newStatusProj === 'Aprovação' || project.newStatusProj === 'Finalizado' ? false : true}
          />


        </ContentCardsScrollView>
      </Content>
    </Container>
  );
}

const styles = StyleSheet.create({
  scrollViewStyle: {
    paddingBottom: 20,
  }
})
