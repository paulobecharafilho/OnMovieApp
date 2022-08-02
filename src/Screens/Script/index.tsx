import { useFocusEffect, useRoute } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import { useTheme } from "styled-components";
import { BackButton } from "../../Components/BackButton";
import api from "../../services/api";
import { FilesProps, ProjectProps, ScenesProps, } from "../../utils/Interfaces";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";

import {
  Container,
  Header,
  HeaderRow,
  PageTitle,
  HeaderIcon,
  Content,
  ContentTitleWrapper,
  ContentTitle,
  ContentSubtitle,
  AddSceneButton,
  AddSceneIcon,
  AddSceneTitleWrapper,
  AddSceneTitle,
  AddSceneSubtitle,
} from "./styles";
import { ScriptCardList } from "../../Components/ScriptCardList";
import { SceneModal } from "../../Components/SceneModal";
import { ButtonCustom } from "../../Components/ButtonCustom";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Params {
  userId: number;
  project: ProjectProps;
  from?: string;
  scenePostIdBack?: number;
}

export function Script({ navigation }) {
  const theme = useTheme();
  const route = useRoute();

  const { userId, project, from, scenePostIdBack } = route.params as Params;

  const [scenes, setScenes] = useState<ScenesProps[]>([]);

  const [sceneModalVisible, setSceneModalVisible] = useState(false);
  const [sceneChosenToModal, setSceneChosenToModal] = useState(
    {} as ScenesProps
  );

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stopPostBack, setStopPostBack] = useState(false);

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(200).then(() => {
      setRefreshing(false);
    });
  }, []);

  function handleBackButton() {
    navigation.navigate(`ProjectDetails`, {
      project: project,
      userId: userId
    });
  }

  useFocusEffect(
    useCallback(() => {
      api
        .get(`get_scenes.php?userId=${userId}&projectId=${project.id_proj}`)
        .then((response) => {
          if (response.data.response === "Success") {
            let scenesAux = response.data.scenes;
              setScenes(response.data.scenes);
              setLoading(false);
              AsyncStorage.setItem(`@onmovieapp:project=${project.id_proj}:isScriptCompleted`, 'true')
            
          } else {
            console.log(`@Script: 72 -> Nenhuma cena encontrada`);
            setScenes([]);
            setLoading(false);
            AsyncStorage.setItem(`@onmovieapp:project=${project.id_proj}:isScriptCompleted`, 'false')
          }
        })
        .catch((err) => {
          console.log(`@Script:77 -> Erro ao encontrar cenas -> ${err}`);
          setLoading(false);
        });
    }, [project, refreshing])
  );

  async function handleAddScene() {
    setLoading(true);
    await api
      .post(`proc_add_scene.php?userId=${userId}`, {
        projectId: project.id_proj,
        sceneOrder: scenes ? scenes.length + 1 : 1,
        projectName: project.nome_proj,
      })
      .then((response) => {
        if (response.data.response === "Success") {
          setScenes((oldArray) => [...oldArray, response.data.scene[0]]);
          setLoading(false);
          onRefresh();
        } else {
          console.log(
            `@Script: handleAddScene -> Não Success ${JSON.stringify(
              response.data.response
            )}`
          );
        }
      })
      .catch((err) => {
        console.log(`@Script: handleAddScene -> Catch ${JSON.stringify(err)}`);
      });
    setLoading(false);
  }

  async function onDragEnd(data) {
    setLoading(true);
    setScenes(data);

    data.forEach((element: ScenesProps, index) => {
      element.post_order_no = index + 1;
    });
    await api
      .post(`proc_update_roteiro.php?userId=${userId}`, {
        projectId: project.id_proj,
        scenes: data,
      })
      .then((response) => {
        setLoading(false);
        if (response.data.response === "Success") {
          // setScenes(response.data.scenes);
        }
      })
      .catch((err) => console.log(`@Script -> Catch in OnDragEnd --> ${err}`));
  }

  function handleOpenSceneModal(sceneChosen) {
    setSceneChosenToModal(sceneChosen);
    setSceneModalVisible(true);
  }

  function handleCloseSceneModal() {
    setSceneModalVisible(false);
    setSceneChosenToModal({} as ScenesProps);
    onRefresh();
  }

  function handleGoToProjectCloudMovie(scene: ScenesProps) {
    setSceneModalVisible(false);
    console.log(
      `@Script: HandleGoToProjectCloud -> scenePostId: ${sceneChosenToModal.post_id} e projectId: ${project.id_proj}`
    );
    navigation.navigate("ProjectCloudMovie", {
      from: "sceneDetails",
      scenePostId: sceneChosenToModal.post_id,
      projectId: project.id_proj,
      userId: userId,
    });
  }

  async function handleDeleteScene() {
    setLoading(true)
    let scenesAux: ScenesProps[] = [];
    
    for(let element of scenes) {
      // console.log(`Element of Scene -> ${element.post_id}`)
      if(element.post_id !== sceneChosenToModal.post_id) {
        scenesAux.push(element);
      } else {
        console.log(`Encontrou Chosen -> ${element.post_id} com chosen ${sceneChosenToModal.post_id}`)
      }
    }

    await scenesAux.forEach((element, index) => {
      element.post_order_no = index+1;
      // console.log(`Nova listagem de Script -> cena ${element.post_id} order ${element.post_order_no}`)
    });


    await api
      .post(`proc_del_scene.php?userId=${userId}`, {
        scenePostId: sceneChosenToModal.post_id,
        projectId: project.id_proj,
      })
      .then(async (response) => {
        if ((response.data.response = "Success")) {
          
          console.log(
            `@Script: DeleteScene -> Deletou com sucesso a cena ${JSON.stringify(
              response.data
            )}`
          );
          if (scenesAux.length > 0){
            await api
              .post(`proc_update_roteiro.php?userId=${userId}`, {
                projectId: project.id_proj,
                scenes: scenesAux,
              })
              .then((resposta) => {
                if (resposta.data.response === "Success") {
                  console.log(`Deletou completamente e atualizou roteiro`)
                  setScenes(scenesAux)
                  handleCloseSceneModal();
                  setLoading(false)
                  onRefresh();
                  // setScenes(response.data.scenes);
                }
              })
              .catch((err) =>{
                console.log(`@Script -> Catch in update Roteiro no DeleteScene --> ${err}`)
                setLoading(false)
                handleCloseSceneModal();
                onRefresh(); 
              });
          } else {
            setLoading(false)
            handleCloseSceneModal();
            onRefresh();
          }
        }
      })
      .catch((error) => {
        setLoading(false)
        handleCloseSceneModal();
        console.log(`Catch no Delete Scene -> ${error}`)
      })
  }

  async function handleSaveSceneDescription(descriptionAux: string) {
    setLoading(true);
    await api.post(`proc_update_scene_description.php?userId=${userId}`, {
      sceneDescription: descriptionAux,
      scenePostId: sceneChosenToModal.post_id,
      projectId: project.id_proj,
    })
    .then((response) => {
      if(response.data.response === 'Success') {
        console.log(`@SceneModal: handleSaveDescription -> ${JSON.stringify(response.data)}`)
        setLoading(false)
        handleCloseSceneModal();
      }
    })
    .catch((err) => {
      console.log(`@SceneModal: Catch do handeSaveSceneDescription -> ${err}`)
    })
  }

  function handleAdvanceButton() {
    if (from === 'ProjectDetails') {
      navigation.navigate(`ProjectDetails`, {
        project: project,
        userId: userId
      })
    } else {
      navigation.navigate(`ProjectDetails`, {
        project: project,
        userId: userId
      })
    }
  }


  const renderItem = ({
    item,
    drag,
    isActive,
    index,
  }: RenderItemParams<ScenesProps>) => {
    return (
      <ScriptCardList
        drag={drag}
        isActive={isActive}
        backgroundColorCustom="transparent"
        item={item}
        index={index}
        handleOpenSceneModal={handleOpenSceneModal}
        userId={userId}
      />
    );
  };

  return (
    <Container>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <Header>
        <HeaderRow>
          <BackButton onPress={handleBackButton} color={theme.colors.shape} />
          <PageTitle>Estúdio de Criação</PageTitle>
          <HeaderIcon name="movie-open-outline" />
        </HeaderRow>
      </Header>
      <Content>
        <ContentTitleWrapper>
          <ContentTitle>Cenas do projeto</ContentTitle>
          <ContentSubtitle>
            faça um roteiro para melhor execução do editor
          </ContentSubtitle>
        </ContentTitleWrapper>

        <TouchableOpacity
          onPress={handleAddScene}
          style={[styles(theme).addSceneButton, {backgroundColor: project.status_proj === 'Rascunho' ? theme.colors.highlight : theme.colors.dark_inactive}]}
          disabled={project.status_proj != 'Rascunho'}
        >
          <AddSceneIcon name="add-circle-outline" />
          <AddSceneTitleWrapper>
            <AddSceneTitle>Nova Cena</AddSceneTitle>
            <AddSceneSubtitle>Adicione uma cena ao projeto</AddSceneSubtitle>
          </AddSceneTitleWrapper>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator />
        ) : scenes.length>0 ? (
          <DraggableFlatList
            containerStyle={{ flex: 1, marginTop: 10 }}
            showsVerticalScrollIndicator={false}
            data={scenes}
            onDragEnd={({ data }) => onDragEnd(data)}
            keyExtractor={(item) => String(item.post_id)}
            renderItem={renderItem}
          />
        ) : 
          <Text style={{ flex: 1, marginTop: 10, paddingTop: 20 }}>Nenhuma cena adicionada ao projeto.</Text>
          }

        <ButtonCustom 
          text="Avançar"
          highlightColor={theme.colors.shape}
          style={{alignSelf: "center", alignContent: "center", backgroundColor: theme.colors.primary, marginTop: 10}}
          onPress={handleAdvanceButton}
        />
      </Content>

      {/* Início do modal! */}
        {sceneModalVisible ? 
          <SceneModal
            handleCloseSceneModal={handleCloseSceneModal}
            scene={sceneChosenToModal}
            userId={userId}
            handleGoToProjectCloudMovie={handleGoToProjectCloudMovie}
            projectId={Number(project.id_proj)}
            handleDeleteScene={handleDeleteScene}
            sceneModalVisible={sceneModalVisible}
            handleSaveSceneDescription={handleSaveSceneDescription}
            projectStatus={project.status_proj}
          />  
        : null}
      {/* Fim do Modal */}
    </Container>
  );
}

const styles = (theme: any) =>
  StyleSheet.create({
    addSceneButton: {
      width: "80%",
      flexDirection: "row",
      alignItems: "center",
      alignSelf: 'center',

      backgroundColor: theme.colors.primary,
      borderRadius: 50,

      paddingHorizontal: 20,
      paddingVertical: 10,
    },
  });
