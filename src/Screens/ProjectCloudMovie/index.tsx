import { useFocusEffect, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import DocumentPicker, {
  DocumentPickerResponse,
} from "react-native-document-picker";

import {
  Alert,
  Button,
  FlatList,
  Modal,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "styled-components";
import { BackButton } from "../../Components/BackButton";
import api from "../../services/api";
import { FilesProps, ProjectProps, ScenesProps } from "../../utils/Interfaces";

import ChevronRight from "../../assets/icons/chevronRightIcon.svg";
import AddIcon from "../../assets/icons/AddIcon.svg";

import {
  Container,
  ContentBegin,
  TitleBegin,
  FormContainer,
  Header,
  HeaderRow,
  PageTitle,
  HeaderIcon,
  Content,
  ContentTitleRow,
  IconButton,
  ContentTitleWrapper,
  ContentTitle,
  ContentSubtitle,
  CloudMovieButton,
  CloudMovieRow,
  CloudMovieIconAndTitle,
  CloudMovieIcon,
  CloudMovieTitleWrapper,
  CloudMovieTitle,
  CloudMovieSubtitle,
  FilesContainer,
  FilesTitle,
  NoneProjectTitle,
  CloseIcon,
} from "./styles";
import { FilesListCard } from "../../Components/FilesListCard";
import { FileDetailsModal } from "../../Components/FileDetailsModal";
import { ButtonCustom } from "../../Components/ButtonCustom";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getProjetctFiles } from "../../services/getProjectFiles";

interface Params {
  userId: number;
  projectId: number;
  from: string;
  scenePostId?: number;
}

interface DocumentProps extends DocumentPickerResponse {
  token?: string;
}

export function ProjectCloudMovie({ navigation }) {
  const theme = useTheme();
  const route = useRoute();

  const { userId, projectId, from, scenePostId } = route.params as Params;

  const [project, setProject] = useState<ProjectProps>();
  const [pageForm, setPageForm] = useState(0);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [choosedFile, setChoosedFile] = useState<FilesProps>();
  const [fileDetailsModalVisible, setFileDetailsModalVisible] = useState(false);

  const [modalAddButtonVisible, setModalAddButtonVisible] = useState(false);

  const [filesToUpload, setFilesToUpload] = useState<DocumentProps[]>([]);

  const [refreshing, setRefreshing] = useState(false);

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(200).then(() => {
      setRefreshing(false);
    });
  }, []);

  useEffect(() => {
    let myInterval = setInterval(() => {
      if (pageForm === 0) {
        setPageForm(1);
        clearInterval(myInterval);
      }
    }, 2000);
  }, []);

  async function handleDocumentPicker() {
    //   await DocumentPicker.getDocumentAsync({multiple: true})
    //   .then(result => console.log(`Resultado Document Picker -> ${result.uri}`))
    //   .catch((err => console.log(`Erro no DocumentPicker -> ${err}`)));

    const files = await DocumentPicker.pickMultiple({
      type: DocumentPicker.types.allFiles,
    });
    let type = "documents";

    let filesAux: DocumentProps[] = [];

    for (let element of files) {
      await api
        .get(
          `check-exists.php?userId=${userId}&projectId=${projectId}&fileName=${element.name}&token_key=${element.name}`
        )
        .then((response) => {
          if (response.data.result[0].response === 0) {
            let file: DocumentProps = element;
            let token = response.data.result[0].token;
            file.token = token;
            filesAux.push(file);
            setFilesToUpload((old) => [...old, file]);
          }
        })
        .catch((e) => console.log(`erro -> ${e}`));
    }

    handleUploadFiles(type, filesAux);
  }

  useFocusEffect(
    useCallback(() => {
      // console.log(`@ProjectCloudMovie - inicinado useFocusEffect com projectId: ${projectId}`)
      setFilesToUpload([]);
      async function fetchProjectInfo() {
        try {
          api
            .get(
              `list_project_by_id.php?userId=${userId}&projectId=${projectId}`
            )
            .then(async (response) => {
              if (response === null || response === undefined) {
                Alert.alert(`não foi possível carregar o projeto`);
              } else if (response.data.response === "Success") {
                let projectAux = response.data.projetos[0];
                await getProjetctFiles(userId, projectId).then((result) => {
                  if (result.result === "Success") {
                    projectAux.files = result.libraryDependenciesFiles;
                    projectAux.qtd_files =
                      result.libraryDependenciesFiles.length;
                  }
                });

                switch (projectAux.status_proj) {
                  case "Rascunho":
                    projectAux.newStatusProj = "Criação";
                    projectAux.highlightColor = theme.colors.highlight;
                    break;

                  case "Na Fila":
                    projectAux.newStatusProj = "Fila";
                    projectAux.highlightColor = theme.colors.secondary;
                    break;

                  case "em edicao":
                    projectAux.newStatusProj = "Edição";
                    projectAux.highlightColor = theme.colors.title;
                    break;

                  case "Em edicao":
                    projectAux.newStatusProj = "Edição";
                    projectAux.highlightColor = theme.colors.title;
                    break;

                  case "controle":
                    projectAux.newStatusProj = "Edição";
                    projectAux.highlightColor = theme.colors.title;
                    break;

                  case "correcao_controle":
                    projectAux.newStatusProj = "Edição";
                    projectAux.highlightColor = theme.colors.title;
                    break;

                  case "em correcao":
                    projectAux.newStatusProj = "Correção";
                    projectAux.highlightColor = theme.colors.highlight_pink;
                    break;

                  case "em aprovacao":
                    projectAux.newStatusProj = "Aprovação";
                    projectAux.highlightColor = theme.colors.attention;
                    break;

                  case "Em aprovacao":
                    projectAux.newStatusProj = "Aprovação";
                    projectAux.highlightColor = theme.colors.attention;
                    break;

                  case "Aprovado":
                    projectAux.newStatusProj = "Finalizado";
                    projectAux.highlightColor = theme.colors.success;
                    break;

                  default:
                    console.log(
                      `Projeto id ${projectAux.id_proj} com status ${projectAux.newStatusProj} não ficou em nenhuma categoria`
                    );
                }
                setProject(projectAux);
                setLoading(false);
                if (projectAux.qtd_files > 0) {
                  await AsyncStorage.setItem(
                    `@onmovieapp:projectId=${projectId}:cloudMovieCompleted`,
                    "true"
                  );
                } else {
                  await AsyncStorage.setItem(
                    `@onmovieapp:projectId=${projectId}:cloudMovieCompleted`,
                    "false"
                  );
                }
              } else {
                console.log(
                  `erro no Try fetchProjectInfo of ProjectCloudMovie -> ${response.data.response}`
                );
              }
            });
        } catch (error) {
          console.log(
            `erro no catch fetchProjectInfo of ProjectCloudMovie -> ${error}`
          );
        }
      }

      fetchProjectInfo();
    }, [projectId, refreshing])
  );

  function handleOpenModal(file: FilesProps) {
    setModalVisible(true);
    setChoosedFile(file);
  }

  function handleCloseModal() {
    setModalVisible(false);
    setChoosedFile({} as FilesProps);
  }

  function handleFileDetails() {
    setModalVisible(false);
    setFileDetailsModalVisible(true);
  }

  function handleCloseFileDetailsModal() {
    setFileDetailsModalVisible(false);
    setChoosedFile({} as FilesProps);
  }

  function handleClickAddButton() {
    setModalAddButtonVisible(true);
  }

  function handleAddButtonModalClose() {
    setModalAddButtonVisible(false);
  }

  function handleUploadFiles(type: string, files?: DocumentProps[]) {
    setModalAddButtonVisible(false);
    navigation.navigate("FilesUploading", {
      userId: userId,
      projectId: projectId,
      type: type,
      files: type === "documents" ? files : null,
    });
  }

  function handleContinue() {
    if (project.qtd_files > 0) {
      navigation.navigate("ProjectDetails", {
        userId: userId,
        project: project,
      });
    } else {
      Alert.alert(`Nenhum arquivo no projeto`, `Por favor adicione pelo menos 1 arquivo para enviar ao editor!`)
    }
  }

  function alertDetachFile() {
    Alert.alert(
      `Desanexar arquivo`,
      `Você tem certeza que deseja remover o arquivo ${choosedFile.file_name} deste projeto? Lembrando que ele continua na sua biblioteca, mas não vai ao editor desse projeto.`,
      [
        {
          text: "Cancelar.",
          style: "cancel",
        },
        {
          text: "Sim, desejo Remover.",
          onPress: () => handleDetachFile(),
          style: "destructive",
        },
      ]
    );
  }

  async function handleDetachFile() {
    await api
      .post(
        `proc_unlink_file.php?userId=${userId}&projectId=${project.id_proj}`,
        {
          fileId: choosedFile.file_id,
          origem: "appProjectCloudMovie",
          fileName: choosedFile.file_name,
        }
      )
      .then((response) => {
        if (response.data.response === "Success") {
          let projectFilesAux: FilesProps[] = [];
          let projectAux = project;
          console.log(
            `@ProjectCloudMovie:HandleAttachFile -> file ${JSON.stringify(
              response.data.file
            )} detached Successfully`
          );
          project.files.map((element) => {
            if (element.file_id !== choosedFile.file_id) {
              projectFilesAux.push(element);
            }
          });

          projectAux.files = projectFilesAux;
          projectAux.qtd_files = projectFilesAux.length;

          setProject(projectAux);
          onRefresh();
          handleCloseModal();
          handleCloseFileDetailsModal();
        } else {
          console.log(
            `@ProjectCloudMovie:HandleAttachFile -> file ${response.data.file} not detached because of ${response.data.response}`
          );
        }
      })
      .catch((err) => console.log(`File Not Detached -> ${err}`));
  }

  async function handleBackButton() {
    await onRefresh();
    
    navigation.navigate(`ProjectDetails`, {
      project: project,
      userId: userId
    });
  }

  function handleGoToCloudMovie() {
    navigation.navigate(`CloudMovie`, {
      userId: userId,
      projectInit: project,
      from: "projectCloudMovie",
    });
  }

  async function addFileToScene() {
    console.log(`@ProjectCloudMovie -> Adicionando arquivo ${choosedFile.file_name} a cena ${scenePostId} do projeto ${projectId} `)
    await api.post(`proc_update_scene_file.php?userId=${userId}`, {
      fileId: choosedFile.file_id,
      fileName: choosedFile.file_name,
      fileThumb: choosedFile.file_thumb,
      scenePostId: scenePostId,
      projectId: projectId, 
    })
    .then((response) => {
      if (response.data.response === 'Success') {
        handleCloseModal();
        navigation.navigate('Script',{
          scenePostIdBack: scenePostId,
          project: project,
          userId: userId
        });
      }
    })
    .catch ((err) => {
      console.log(`@ProjectCloudMovie: Catch do AddFilesToScene -> ${err}`)
    })
  }

  return (
    <Container>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      {pageForm === 0 ? (
        <ContentBegin>
          {from === "start" ? (
            <TitleBegin> Salvando as{"\n"} Informações </TitleBegin>
          ) : (
            <TitleBegin> Buscando as{"\n"} Informações </TitleBegin>
          )}
        </ContentBegin>
      ) : (
        <FormContainer>
          {/* Start Modal Buttons */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={handleCloseModal}
          >
            <TouchableOpacity
              onPress={handleCloseModal}
              style={{ width: "100%", height: "100%" }}
            >
              <View style={styles(theme).modalView}>
                <TouchableOpacity
                  style={styles(theme).modalCloseButton}
                  onPress={handleCloseModal}
                >
                  <CloseIcon name="close" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles(theme).modalDetailsButton}
                  onPress={handleFileDetails}
                >
                  <Text style={styles(theme).textButton}>Detalhes</Text>
                </TouchableOpacity>
                
                {/* Se vier do SceneDetails botão será adicionar à cena */}
                {from === 'sceneDetails' && scenePostId ? 
                  <TouchableOpacity
                    style={[styles(theme).modalAtachButton, {backgroundColor: project.status_proj === 'Rascunho' ? theme.colors.highlight : theme.colors.inactive}]}
                    onPress={addFileToScene}
                    disabled={project.status_proj != 'Rascunho'}
                    
                  >
                    <Text style={styles(theme).textButton}>
                      Adicionar à Cena
                    </Text>
                  </TouchableOpacity>
                :
                  <TouchableOpacity
                    style={[styles(theme).modalDetachButton, {backgroundColor: project.status_proj === 'Rascunho' ? theme.colors.attention : theme.colors.inactive}]}
                    onPress={alertDetachFile}
                    disabled={project.status_proj != 'Rascunho'}
                    
                  >
                    <Text style={styles(theme).textButton}>
                      Remover do Projeto
                    </Text>
                  </TouchableOpacity>
                }
              </View>
            </TouchableOpacity>
          </Modal>
          {/* Finish Modal Buttons */}

          {/* Init Modal FileDetails */}
          {fileDetailsModalVisible ? (
            <FileDetailsModal
              file={choosedFile}
              projectId={projectId}
              projectStatus = {project.status_proj}
              userId={userId}
              from='projectCloudMovie'
              fileDetailsModalVisible={fileDetailsModalVisible}
              handleCloseFileDetailsModal={handleCloseFileDetailsModal}
              handleDetachFile={alertDetachFile}
            />
          ) : null}

          {/* Finish Modal FileDetails */}

          {/* Init Modal Buttons AddFiles */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalAddButtonVisible}
            onRequestClose={handleAddButtonModalClose}
          >
            <TouchableOpacity
              onPress={handleAddButtonModalClose}
              style={{ width: "100%", height: "100%" }}
            >
              <View style={styles(theme).modaAddButtonsView}>
                {/* <TouchableOpacity
                  style={styles(theme).modalCloseButton}
                  onPress={handleAddButtonModalClose}
                >
                  <CloseIcon name="close" />
                </TouchableOpacity> */}
                <TouchableOpacity
                  style={styles(theme).modalAddButtons}
                  onPress={() => handleUploadFiles("gallery")}
                >
                  <Text style={styles(theme).textAddButton}>
                    Vídeos e Fotos da Galeria
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles(theme).modalAddButtons}
                  onPress={() => handleDocumentPicker()}
                >
                  <Text style={styles(theme).textAddButton}>Documentos</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
          {/* Finish Modal Button AddFiles */}

          <Header>
            <HeaderRow>
              <BackButton
                onPress={handleBackButton}
                color={theme.colors.shape}
              />
              <PageTitle>Arquivos do Projeto</PageTitle>
              <HeaderIcon name="movie-open-outline" />
            </HeaderRow>
          </Header>

          {pageForm === 1 ? (
            <Content>
              {project.status_proj === "Rascunho" ? (
                <ContentTitleRow>
                  <ContentTitleWrapper>
                    <ContentTitle>Adicione seus arquivos</ContentTitle>
                    <ContentSubtitle>
                      Use o material importante para o vídeo
                    </ContentSubtitle>
                  </ContentTitleWrapper>
                  <IconButton onPress={handleClickAddButton}>
                    <AddIcon />
                  </IconButton>
                </ContentTitleRow>
              ) : (
                <ContentTitleRow>
                  <ContentTitleWrapper>
                    <ContentTitle>Seus arquivos no projeto</ContentTitle>
                    <ContentSubtitle>
                      Veja os arquivos vinculados ao seu projeto.
                    </ContentSubtitle>
                  </ContentTitleWrapper>
                </ContentTitleRow>
              )}

              {project.status_proj === "Rascunho" ? (
                <CloudMovieButton onPress={handleGoToCloudMovie}>
                  <CloudMovieRow>
                    <CloudMovieIconAndTitle>
                      <CloudMovieIcon name="movie-open-outline" />
                      <CloudMovieTitleWrapper>
                        <CloudMovieTitle>Cloud Movie</CloudMovieTitle>
                        <CloudMovieSubtitle>
                          Anexe os arquivos da sua biblioteca
                        </CloudMovieSubtitle>
                      </CloudMovieTitleWrapper>
                    </CloudMovieIconAndTitle>
                    {/* <ChevronRight /> */}
                    <CloudMovieIcon name="chevron-right-circle" />
                  </CloudMovieRow>
                </CloudMovieButton>
              ) : (
                <CloudMovieButton disabled style={{backgroundColor: theme.colors.shape_inactive}}>
                  <CloudMovieRow>
                    <CloudMovieIconAndTitle>
                      <CloudMovieIcon name="movie-open-outline" />
                      <CloudMovieTitleWrapper>
                        <CloudMovieTitle>Cloud Movie</CloudMovieTitle>
                        <CloudMovieSubtitle>
                          Anexe os arquivos da sua biblioteca
                        </CloudMovieSubtitle>
                      </CloudMovieTitleWrapper>
                    </CloudMovieIconAndTitle>
                    {/* <ChevronRight /> */}
                    <CloudMovieIcon name="chevron-right-circle" />
                  </CloudMovieRow>
                </CloudMovieButton>
              )}

              <FilesContainer>
                <FilesTitle>
                  Arquivos Neste Projeto: {project.qtd_files}
                </FilesTitle>
                {project.qtd_files > 0 ? (
                  <FlatList
                    refreshControl={
                      <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                      />
                    }
                    showsVerticalScrollIndicator={false}
                    data={project.files}
                    keyExtractor={(item: FilesProps) => String(item.file_id)}
                    renderItem={({ item }) => (
                      <FilesListCard
                        file={item}
                        customColor={theme.colors.shape}
                        onPress={() => handleOpenModal(item)}
                      />
                    )}
                  />
                ) : (
                  <NoneProjectTitle>
                    Este projeto não tem nenhum arquivo vinculado
                  </NoneProjectTitle>
                )}
              </FilesContainer>

              <ButtonCustom
                style={styles(theme).buttonCustom}
                text={"Avançar"}
                onPress={handleContinue}
              />
            </Content>
          ) : null}
        </FormContainer>
      )}
    </Container>
  );
}

const styles = (theme: any) =>
  StyleSheet.create({
    modalDetailsButton: {
      width: "40%",
      height: "30%",
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primary,
    },
    modalAtachButton: {
      width: "40%",
      height: "30%",
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center",
    },
    modalDetachButton: {
      width: "40%",
      height: "30%",
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center",
    },
    modalCloseButton: {
      position: "absolute",
      top: 0,
      right: 20,
      padding: 10,
    },
    modalView: {
      position: "absolute",
      bottom: 0,
      height: "22%",
      width: "100%",
      backgroundColor: theme.colors.shape,
      borderRadius: 50,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    textButton: {
      fontFamily: theme.fonts.poppins_medium,
      fontSize: 13,
      color: theme.colors.shape,
    },
    modaAddButtonsView: {
      position: "absolute",
      flexDirection: "column",
      top: "20%",
      right: "10%",
      width: "70%",
      paddingVertical: 10,
      backgroundColor: theme.colors.shape,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "space-around",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalAddButtons: {
      width: "80%",
      paddingVertical: 10,
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center",
      border: "solid",
      borderWidth: 0.5,
      borderColor: theme.colors.primary,
      margin: 10,
    },
    textAddButton: {
      fontFamily: theme.fonts.poppins_medium,
      fontSize: 13,
      color: theme.colors.primary,
    },
    buttonCustom: {
      alignSelf: "center",
      marginTop: 10,
    },
  });
