import { useFocusEffect, useRoute } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  Modal,
  StatusBar,
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useTheme } from "styled-components";
import { FileDetailsModal } from "../../Components/FileDetailsModal";
import { FilesProps, ProjectProps } from "../../utils/Interfaces";
import DocumentPicker, {
  DocumentPickerResponse,
} from "react-native-document-picker";

import { FilesListCard } from "../../Components/FilesListCard";
import AddIcon from "../../assets/icons/AddIcon.svg";

import {
  Container,
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
  CloseIcon,
  FilesContainer,
  ListContent,
  CategoriesButton,
  CategoriesTitle,
  NoneProjectTitle,
} from "./styles";
import api from "../../services/api";
import { getFiles } from "../../services/getFiles";
import { BackButton } from "../../Components/BackButton";
import { ButtonCustom } from "../../Components/ButtonCustom";

interface Params {
  userId: number;
  projectInit?: ProjectProps;
  from?: string;
}

interface DocumentProps extends DocumentPickerResponse {
  token?: string;
}

interface FileAttatchedProps extends FilesProps {
  isAttachedToProject?: boolean;
}

export function CloudMovie({ navigation }) {
  const theme = useTheme();
  const route = useRoute();

  const categoriesData = ["Todos", "Imagens", `Vídeos`, "Outros"];

  const { userId, projectInit, from} = route.params as Params;

  const [libraryFiles, setLibraryFiles] = useState<FileAttatchedProps[]>([]);
  const [libraryFilesInProject, setLibraryFilesInProject] = useState<
    FileAttatchedProps[]
  >([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [fileDetailsModalVisible, setFileDetailsModalVisible] = useState(false);
  const [modalAddButtonVisible, setModalAddButtonVisible] = useState(false);

  const [choosedFile, setChoosedFile] = useState<FileAttatchedProps>();
  const [filesToUpload, setFilesToUpload] = useState<DocumentProps[]>([]);
  const [project, setProject] = useState<ProjectProps>(projectInit);

  const [categorySelected, setCategorySelected] = useState("Todos");

  const [refreshing, setRefreshing] = useState(false);

  const [loading, setLoading] = useState(true);

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(100).then(() => {
      setRefreshing(false);
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      async function getLibraryFiles() {
        await getFiles(userId).then(async (result) => {
          if (result.result === "Success") {
            setLibraryFiles([]);
            await result.libraryFiles.map((item) => {
              if (project.files) {
                let findItem = project.files.find(
                  (element) => element.file_id === item.file_id
                );
                if (findItem) {
                  item.isAttachedToProject = true;
                } else {
                  item.isAttachedToProject = false;
                }
              } else {
                project.files=[];
              }
              setLibraryFiles((oldArray) => [...oldArray, item]);
              setLoading(false);
            });
          }
        });
      }

      getLibraryFiles();
    }, [userId, project, refreshing])
  );

  async function handleAttachFile() {
    await api
      .post(
        `proc_link_file.php?userId=${userId}&projectId=${project.id_proj}`,
        {
          fileId: choosedFile.file_id,
          origem: "appProjectCloudMovie",
        }
      )
      .then((response) => {
        if (response.data.response === "Success") {
          // console.log(
          //   `@CloudMovie:HandleAttachFile -> file ${response.data.file.fileName} attached Successfully`
          // );
          let projectAux = project;
          // console.log(`@CloudMovie: 145 -> ProjectAux.push -> ${JSON.stringify(choosedFile)}`)
          projectAux.files.push(choosedFile);
          setProject(projectAux);
          onRefresh();
          handleCloseModal();
          handleCloseFileDetailsModal();
          
        } else {
          console.log(
            `@CloudMovie:HandleAttachFile -> file ${response.data.file.fileName} not Attached because of ${response.data.response}`
          );
        }
      })
      .catch (err => console.log(`File Not Attached -> ${err}`));
  }

  function alertDetachFile() {
    Alert.alert(`Desanexar arquivo`,
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
    ],
    )
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
        let projectFilesAux: FileAttatchedProps[] = [];
        let projectAux = project;
        console.log(`@CloudMovie:HandleAttachFile -> file ${JSON.stringify(response.data.file)} detached Successfully`);
        project.files.map((element) => {
          if (element.file_id !== choosedFile.file_id) {
            projectFilesAux.push(element);
          } 
        })

        projectAux.files = projectFilesAux;
        projectAux.qtd_files = projectFilesAux.length;
       
        setProject(projectAux);
        onRefresh();
        handleCloseModal();
        handleCloseFileDetailsModal();
        
      } else {
        console.log(
          `@CloudMovie:HandleAttachFile -> file ${response.data.file} not detached because of ${response.data.response}`
        );
      }
    })
    .catch (err => console.log(`File Not Detached -> ${err}`));
  }

  function handleOpenModal(file: FileAttatchedProps) {
    setModalVisible(true);
    setChoosedFile(file);
  }

  function handleCloseModal() {
    setModalVisible(false);
    setChoosedFile({} as FileAttatchedProps);
  }

  function handleFileDetails() {
    setModalVisible(false);
    setFileDetailsModalVisible(true);
  }

  function handleCloseFileDetailsModal() {
    setFileDetailsModalVisible(false);
    setChoosedFile({} as FileAttatchedProps);
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
      projectId: project.id_proj,
      type: type,
      files: type === "documents" ? files : null,
    });
  }

  function handleBacktoProjectDetails() {
    navigation.goBack();
  }

  function handleContinueFromDetails() {
    navigation.goBack();
  }

  function handleBackButton() {
    navigation.goBack();
  }

  async function handleDocumentPicker() {
    const files = await DocumentPicker.pickMultiple({
      type: DocumentPicker.types.allFiles,
    });
    let type = "documents";

    let filesAux: DocumentProps[] = [];

    for (let element of files) {
      await api
        .get(
          `check-exists.php?userId=${userId}&projectId=${project.id_proj}&fileName=${element.name}&token_key=${element.name}`
        )
        .then((response) => {
          // console.log(`${response.data.result[0].response} proj_dep: ${response.data.result[0].fileInProject}`);
          if (response.data.result[0].response === 0) {
            let file: DocumentProps = element;
            let token = response.data.result[0].token;
            file.token = token;
            // console.log(`File -> ${file.name} checkado com token ${token} e uri -> ${file.fileCopyUri}`)
            filesAux.push(file);
            setFilesToUpload((old) => [...old, file]);
          }
        })
        .catch((e) => console.log(`erro -> ${e}`));
    }

    handleUploadFiles(type, filesAux);
  }

  function ShowAllFiles() {
    return (
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        data={libraryFiles}
        keyExtractor={(item: FilesProps) => String(item.file_id)}
        renderItem={({ item }) => (
          <FilesListCard
            file={item}
            customColor={theme.colors.primary}
            onPress={() => handleOpenModal(item)}
          />
        )}
      />
    );
  }

  function ShowImageFiles() {
    let images = [];
    libraryFiles.map((element) => {
      if (element.file_type === "image") {
        images.push(element);
      }
    });
    return images.length > 0 ? (
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        data={images}
        keyExtractor={(item: FilesProps) => String(item.file_id)}
        renderItem={({ item }) => (
          <FilesListCard
            file={item}
            customColor={theme.colors.primary}
            onPress={() => handleOpenModal(item)}
          />
        )}
      />
    ) : (
      <Text>Você não tem imagens na sua biblioteca</Text>
    );
  }

  function ShowVideoFiles() {
    let videos = [];
    libraryFiles.map((element) => {
      if (element.file_type === "video") {
        videos.push(element);
      }
    });
    return videos.length > 0 ? (
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        data={videos}
        keyExtractor={(item: FilesProps) => String(item.file_id)}
        renderItem={({ item }) => (
          <FilesListCard
            file={item}
            customColor={theme.colors.primary}
            onPress={() => handleOpenModal(item)}
          />
        )}
      />
    ) : (
      <Text>Você não tem vídeos na sua biblioteca</Text>
    );
  }

  function ShowOtherFiles() {
    let otherFiles = [];
    libraryFiles.map((element) => {
      if (element.file_type != "video" && element.file_type != "image") {
        otherFiles.push(element);
      }
    });
    return otherFiles.length > 0 ? (
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        data={otherFiles}
        keyExtractor={(item: FilesProps) => String(item.file_id)}
        renderItem={({ item }) => (
          <FilesListCard
            file={item}
            customColor={theme.colors.primary}
            onPress={() => handleOpenModal(item)}
          />
        )}
      />
    ) : (
      <Text>Você não tem outros arquivos na sua biblioteca</Text>
    );
  }

  return (
    <Container>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <FormContainer>
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
              {choosedFile ? choosedFile.isAttachedToProject ? (
                <TouchableOpacity
                  style={styles(theme).modalDetachButton}
                  onPress={alertDetachFile}
                >
                  <Text style={styles(theme).textButton}>
                    Remover do Projeto
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles(theme).modalAtachButton}
                  onPress={handleAttachFile}
                >
                  <Text style={styles(theme).textButton}>
                    Adicionar ao Projeto
                  </Text>
                </TouchableOpacity>
              ): null}
            </View>
          </TouchableOpacity>
        </Modal>
        {/* Finish Modal Buttons */}

        {/* Init Modal FileDetails */}
        {fileDetailsModalVisible ? (
          <FileDetailsModal
            file={choosedFile}
            projectId={Number(project.id_proj)}
            userId={userId}
            from='CloudMovie'
            fileDetailsModalVisible={fileDetailsModalVisible}
            handleCloseFileDetailsModal={handleCloseFileDetailsModal}
            handleDetachFile={alertDetachFile}
            handleAttachFile={handleAttachFile}
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
            <BackButton onPress={handleBackButton} color={theme.colors.shape} />
            <PageTitle>Arquivos do Projeto</PageTitle>
            <HeaderIcon name="movie-open-outline" />
          </HeaderRow>
        </Header>

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

          {loading ? (
            <ActivityIndicator />
          ) : (
            <FilesContainer>
              {libraryFiles.length > 0 ? (
                <ListContent>
                  <FlatList
                    contentContainerStyle={{
                      width: "100%",
                      alignItems: "center",
                      justifyContent: "space-around",
                      alignSelf: "center",
                    }}
                    horizontal
                    data={categoriesData}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                      <CategoriesButton
                        onPress={() => setCategorySelected(item)}
                        style={{
                          paddingVertical: 5,
                          paddingHorizontal: 10,
                          borderStyle:
                            item === categorySelected ? "solid" : null,
                          borderColor:
                            item === categorySelected
                              ? theme.colors.primary_light
                              : null,
                          borderWidth: item === categorySelected ? 0.5 : null,
                          borderRadius: 10,
                        }}
                      >
                        <CategoriesTitle>{item}</CategoriesTitle>
                      </CategoriesButton>
                    )}
                  />
                  {categorySelected === "Todos" ? (
                    <ShowAllFiles />
                  ) : categorySelected === "Imagens" ? (
                    <ShowImageFiles />
                  ) : categorySelected === "Vídeos" ? (
                    <ShowVideoFiles />
                  ) : categorySelected === "Outros" ? (
                    <ShowOtherFiles />
                  ) : null}
                </ListContent>
              ) : (
                <NoneProjectTitle>
                  Você não tem nenhum arquivo na sua Biblioteca
                </NoneProjectTitle>
              )}
              <ButtonCustom
                style={styles(theme).buttonCustom}
                highlightColor={theme.colors.shape}
                text={"Avançar"}
                onPress={
                  from === "projectCloudMovie"
                    ? handleBacktoProjectDetails
                    : handleContinueFromDetails
                }
              />
            </FilesContainer>
          )}
        </Content>
      </FormContainer>
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
      backgroundColor: theme.colors.highlight,
    },
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
      backgroundColor: theme.colors.primary,
    },
  });
