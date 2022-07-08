import { useFocusEffect, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import DocumentPicker, { DocumentPickerResponse } from "react-native-document-picker";

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
import { FilesProps, ProjectProps } from "../../utils/Interfaces";

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
}

interface DocumentProps extends DocumentPickerResponse {
  token?: string;
}

export function ProjectCloudMovie({ navigation }) {
  const theme = useTheme();
  const route = useRoute();

  const { userId, projectId, from} = route.params as Params;

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
    wait(2000).then(() => {
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
  
    const files = await DocumentPicker.pickMultiple({type: DocumentPicker.types.allFiles});
    let type = 'documents';

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
            setFilesToUpload(old => [...old, file]);
          }
        })
        .catch((e) => console.log(`erro -> ${e}`));
    }
    
    handleUploadFiles(type, filesAux)
  }

  useFocusEffect(
    useCallback(() => {
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
                await getProjetctFiles(userId, projectId)
                .then((result) => {
                  if (result.result === 'Success') {
                    projectAux.files = result.libraryDependenciesFiles;
                    projectAux.qtd_files = result.libraryDependenciesFiles.length;
                  }
                })
                projectAux.newStatusProj = "Criação";
                projectAux.highlightColor = theme.colors.highlight;
                setProject(projectAux);
                setLoading(false);
                if(projectAux.qtd_files > 0){
                 await AsyncStorage.setItem(`@onmovieapp:projectId=${projectId}:cloudMovieCompleted`, 'true')
                } else {
                  await AsyncStorage.setItem(`@onmovieapp:projectId=${projectId}:cloudMovieCompleted`, 'false')
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
    setModalAddButtonVisible(false)
  }

  function handleUploadFiles(type: string, files?: DocumentProps[]) {
    setModalAddButtonVisible(false);
    navigation.navigate('FilesUploading', {
      userId: userId,
      projectId: projectId,
      type: type,
      files: type === 'documents' ? files : null
    });
  }

  function handleContinueFromStart(){
    navigation.navigate('ProjectDetails', {
      userId: userId,
      project: project
    })
  }

  function handleContinueFromDetails() {
    navigation.navigate('ProjectDetails', {
      userId: userId,
      project: project
    })
  }

  function handleDetachFile() {}

  function handleBackButton() {
    navigation.goBack();
  }

  function handleGoToCloudMovie() {
    navigation.navigate(`CloudMovie`, {
      userId: userId,
      project: project,
      from: 'projectCloudMovie'
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
          {from === 'start' ?
          <TitleBegin> Salvando as{"\n"} Informações </TitleBegin>
          : <TitleBegin> Buscando as{"\n"} Informações </TitleBegin>
          }
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
                <TouchableOpacity style={styles(theme).modalDetachButton}>
                  <Text style={styles(theme).textButton}>
                    Remover do Projeto
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
          {/* Finish Modal Buttons */}

          {/* Init Modal FileDetails */}
          {fileDetailsModalVisible ? 
            <FileDetailsModal
              file={choosedFile}
              projectId={projectId}
              userId={userId}
              fileDetailsModalVisible={fileDetailsModalVisible}
              handleCloseFileDetailsModal={handleCloseFileDetailsModal}
            /> : null}
          
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
                  onPress={() => handleUploadFiles('gallery')}
                >
                  <Text style={styles(theme).textAddButton}>Vídeos e Fotos da Galeria</Text>
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
                  <ChevronRight />
                </CloudMovieRow>
              </CloudMovieButton>

              <FilesContainer>
                <FilesTitle>Arquivos Neste Projeto: {project.qtd_files}</FilesTitle>
                {project.qtd_files > 0 ? (
                  <FlatList
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
    
              <ButtonCustom style={styles(theme).buttonCustom}
                text={"Avançar"} 
                onPress= {from === 'start' ? handleContinueFromStart : handleContinueFromDetails}            
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
    modalAtachButton: {},
    modalDetachButton: {
      width: "40%",
      height: "30%",
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.attention,
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
      top: '20%',
      right: '10%',
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
    }
  });
