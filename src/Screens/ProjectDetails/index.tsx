import React, { useCallback, useEffect, useState } from "react";
import { Alert, BackHandler, StyleSheet, TouchableOpacity } from "react-native";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { useTheme } from "styled-components";
import { ProjectDTO } from "../../dtos/ProjectDTO";

import { ProjectDetailsCard } from "../../Components/ProjectDetailsCard";
import { BackButton } from "../../Components/BackButton";
import { ProgressBar } from "../../Components/ProgressBar";
import api from "../../services/api";

const ThumbExample = require(`../../assets/icons/FavIconBranco.png`);

import { 
  Container,
  Header,
  HeaderWrapper,
  HeaderTitle,
  HeaderIcon,
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

  const [dateFormatted, setDateFormatted] = useState('');

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

  const backAction = () => {
    handleBackButton();
    return true;
  };

  const backHandler = BackHandler.addEventListener(
    "hardwareBackPress",
    backAction
  );

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



  function handleDeleteProjectAlert() {
    Alert.alert(`Remover Projeto?`, `Você tem certeza que deseja remover o projeto ${project.id_proj}?`,
    [
      {
        text: "Remover Projeto",
        onPress: () => handleDeleteProject(),
        style: "destructive"
      },
      {
        text: "Cancelar",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      },
    ]
  )}

  function handleDeleteProject() {
    api.get(`proc_del_proj.php?userId=${userId}&idProj=${project.id_proj}`)
    .then((response) => {
      if (response.data.response === 'Success') {
        Alert.alert(`Projeto Removido com sucesso!`);
        navigation.navigate(`Home`);
      } else {
        Alert.alert(`Não foi possível remover o projeto! ${response.data.response}`);
      }
    })
  }

  
  function handleCancelProjectAlert() {
    Alert.alert(`Cancelar Projeto?`, `Você tem certeza que deseja retirar o projeto ${project.id_proj} da fila e voltar para criação? O valor pago voltará em forma de créditos na sua conta`,
    [
      {
        text: "Voltar para Criação",
        onPress: () => handleCancelProject(),
        style: "destructive"
      },
      {
        text: "Cancelar",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      },
    ]
  )}

  function handleCancelProject() {
    console.log(`@ProjectDetails -> Iniciando handleCancelProject com userId=${userId}`)
    api.post(`proc_cancel_ped_fila.php?userId=${userId}`, {
      projId: project.id_proj,
    })
    .then((response) => {
      if (response.data.response === 'Success') {
        Alert.alert(`Projeto Removido com sucesso!`);
        navigation.navigate(`Home`);
      } else {
        Alert.alert(`Não foi possível remover o projeto!`, `${response.data.response}`);
        console.log(`erro -> ${JSON.stringify(response.data)}`)
      }
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

      setDateFormatted(project.data_criacao.split(' ')[0]);

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
          <TouchableOpacity 
            style={{padding: 10}}
            onPress={project.status_proj === 'Rascunho' ? handleDeleteProjectAlert : project.status_proj === 'Na Fila' ? handleCancelProjectAlert : null} 
            disabled={project.status_proj != 'Rascunho' && project.status_proj != 'Na Fila'}
          >
            <HeaderIcon name="trash-outline" style={project.status_proj != 'Rascunho' && project.status_proj != 'Na Fila' ? {color: theme.colors.shape_inactive} : null}/>
          </TouchableOpacity>
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
              <ContentColumSubtitle>Data de Criação:</ContentColumSubtitle>
              <ContentColumTitle>{dateFormatted.split('-')[2]}-{dateFormatted.split('-')[1]}-{dateFormatted.split('-')[0]}</ContentColumTitle>
            </ContentColumWrapper>
            <ContentColumWrapper>
              <ContentColumSubtitle>Tempo de vídeo:</ContentColumSubtitle>
              <ContentColumTitle>{project.duracao_proj.split(':')[0]}h: {project.duracao_proj.split(':')[1]}min:{project.duracao_proj.split(':')[2]}s</ContentColumTitle>
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
            subtitle='Pagamentos e Detalhamento'
            icon='credit-card-outline'
            isCompleted={checkoutComplete}
            isDisabled={!cloudMovieComplete && project.status_proj != 'Aprovado'}
          />
          <ProjectDetailsCard 
            onPress={handleGoToChat}
            title="Chat com o Editor"
            subtitle='Converse com o editor do projeto'
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
