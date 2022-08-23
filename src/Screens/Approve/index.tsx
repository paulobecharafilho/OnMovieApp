import React, { useCallback, useState } from "react";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { AVPlaybackStatusToSet, Video } from "expo-av";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
  Alert,
} from "react-native";
import { useTheme } from "styled-components";
import { ApproveModal } from "../../Components/ApproveModal";
import { BackButton } from "../../Components/BackButton";
import api, { finalFileBaseUrl } from "../../services/api";
import { ProjectProps } from "../../utils/Interfaces";

import {
  Container,
  Header,
  HeaderWrapper,
  HeaderLogo,
  HeaderTitleWrapper,
  HeaderTitle,
  HeaderSubtitle,
  Content,
  TitleWrapper,
  Title,
  Subtitle,
} from "./styles";
import { ProgressBar } from "../../Components/ProgressBar";
import { CorrectModal } from "../../Components/CorrectModal";
import { boolean } from "yup";

const marcaDagua = require("../../assets/png/MarcaDagua.png");

interface Params {
  userId: string;
  project: ProjectProps;
}

export function Approve({ navigation }) {
  const theme = useTheme();
  const route = useRoute();

  const params = route.params as Params;

  const [permissionStatus, requestPermission] = MediaLibrary.usePermissions();


  const video = React.useRef(null);
  const [status, setStatus] = React.useState<AVPlaybackStatusToSet>({});

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const [projectRefreshed, setProjectRefreshed] = useState<ProjectProps>();
  const [finalFileName, setFinalFileName] = useState("");
  const [stars, setStars] = useState(0);

  const [approveModalIsVisilble, setApproveModalIsVisible] = useState(false);
  const [correctModalIsVisilble, setCorrectModalIsVisible] = useState(false);

  const [correctDescription, setCorrectDescription] = useState('');
  const [erroEdicao, setErroEdicao] = useState(false);

  const [isVideoApproved, setIsVideoApproved] = useState(false);

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
      async function refreshProject() {
        await api
          .get(
            `list_project_by_id.php?userId=${params.userId}&projectId=${params.project.id_proj}`
          )
          .then(async (response) => {
            if (response.data.response === "Success") {
              let item: ProjectProps = response.data.projetos[0];

              switch (item.status_proj) {
                case "Rascunho":
                  item.newStatusProj = "Criação";
                  item.highlightColor = theme.colors.highlight;
                  break;

                case "Na Fila":
                  item.newStatusProj = "Fila";
                  item.highlightColor = theme.colors.secondary;
                  break;

                case "em edicao":
                  item.newStatusProj = "Edição";
                  item.highlightColor = theme.colors.title;
                  break;

                case "Em edicao":
                  item.newStatusProj = "Edição";
                  item.highlightColor = theme.colors.title;
                  break;

                case "controle":
                  item.newStatusProj = "Edição";
                  item.highlightColor = theme.colors.title;
                  break;

                case "correcao_controle":
                  item.newStatusProj = "Edição";
                  item.highlightColor = theme.colors.title;
                  break;

                case "em correcao":
                  item.newStatusProj = "Correção";
                  item.highlightColor = theme.colors.highlight_pink;
                  break;

                case "em aprovacao":
                  item.newStatusProj = "Aprovação";
                  item.highlightColor = theme.colors.attention;
                  break;

                case "Em aprovacao":
                  item.newStatusProj = "Aprovação";
                  item.highlightColor = theme.colors.attention;
                  break;

                case "Aprovado":
                  item.newStatusProj = "Finalizado";
                  item.highlightColor = theme.colors.success;
                  break;

                default:
                  console.log(
                    `Projeto id ${item.id_proj} com status ${item.newStatusProj} não ficou em nenhuma categoria`
                  );
              }

              setProjectRefreshed(item);

              setFinalFileName(item.arquivo_final);
              setLoading(false);
            }
          });
      }
      refreshProject();
    }, [refreshing === true])
  );

  async function handleApproveProject() {
    console.log(`stars => ${stars}`);
    await api
      .post(
        `proc_aprova_servico.php?userId=${params.userId}&idProj=${projectRefreshed.id_proj}&fb=${stars}`
      )
      .then((response) => {
        if (response.data.response === 'Success') {
          setApproveModalIsVisible(false);
          setIsVideoApproved(true);
          onRefresh();
        }
      })
      .catch((err) => {
        console.log(`@Approve Catch -> ${err}`);
      });
  }

  function handleCloseApproveModal() {
    setApproveModalIsVisible(false);
    setStars(0);
  }

  function handleCloseCorrectModal() {
    setCorrectModalIsVisible(false);
  }

  async function downlaodVideo() {
    console.log(`permissionStatus -> ${permissionStatus.granted}`)

    if (!permissionStatus) {
      requestPermission
    } else {
      setDownloadLoading(true);
      const uri = `${finalFileBaseUrl}/${params.userId}/${projectRefreshed.id_proj}/${projectRefreshed.arquivo_final}`;
      let fileUri =
        FileSystem.documentDirectory + `${projectRefreshed.arquivo_final}`;
      // FileSystem.downloadAsync(uri, fileUri, )
      // .then(({ uri }) => {
      //     saveFile(uri);
      //   })
      //   .catch(error => {
      //     console.error(error);
      //   })
  
      await FileSystem.createDownloadResumable(uri, fileUri, {}, (data) => {
        let progressAux =
          (data.totalBytesWritten / data.totalBytesExpectedToWrite * 100).toFixed(2);
        setDownloadProgress(progressAux);
      })
        .downloadAsync()
        .then(({ uri }) => {
          saveFile(uri);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  async function saveFile(fileUri: string) {

    if (MediaLibrary.PermissionStatus.GRANTED) {
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync("Download", asset, false);

      setDownloadLoading(false);
      Alert.alert(
        `Ihuu! Seu download foi realizado com sucesso!`,
        `Agora seu vídeo está na sua galeria!`,
        [
          {
            text: "Ok",
            onPress: () => handleGoBackToProjectDetails(),
            style: "cancel",
          },
        ]
      );
    }
  }

  async function handleCorrectProject() {
    api.post(`proc_corr_serv.php?userId=${params.userId}`, {
      idProj: projectRefreshed.id_proj,
      descri: correctDescription,
      idEdit: projectRefreshed.id_editor,
      nomeProj: projectRefreshed.nome_proj,
      erroEdicao: erroEdicao ? 'editor' : 'usuario',
    })
    .then(async (response) => {
      console.log(`@Approve CorrectProject -> ${JSON.stringify(response.data)}`)
      if (response.data.response === 'Success') {
        Alert.alert(`Sua Solicitação foi enviada com sucesso!`)
        await onRefresh();
        navigation.navigate(`ProjectDetails`, {
          project: projectRefreshed
        })
      }
    })
    .catch((err) => {
      console.log(`Erro no CorrectProjetc -> ${err}`)
    })
  }

  function handleGoBackToProjectDetails() {
    navigation.navigate("ProjectDetails", {
      project: projectRefreshed,
    });
  }

  return (
    <Container>
      <Header>
        <HeaderWrapper>
          <BackButton onPress={() => navigation.goBack()} />
          <HeaderTitleWrapper>
            <HeaderTitle>
              Aprovação do pedido: {params.project.id_proj}
            </HeaderTitle>
            <HeaderSubtitle>{params.project.nome_proj}</HeaderSubtitle>
          </HeaderTitleWrapper>
          <HeaderLogo />
        </HeaderWrapper>
      </Header>

      {loading ? (
        <ActivityIndicator />
      ) : (
        <Content>
          <TitleWrapper>
            <Title>Vídeo para aprovação</Title>
            <Subtitle>Por favor analise o vídeo e escolha sua opção:</Subtitle>
            {/* <Subtitle>{finalFileBaseUrl}/{params.userId}/{projectRefreshed.id_proj}/{projectRefreshed.arquivo_final}</Subtitle> */}
          </TitleWrapper>

          {/* <Image
            style={styles(theme).image}
            source={require('../../assets/png/MarcaDagua.png')}
            resizeMode="repeat"
          /> */}

          <Video
            ref={video}
            style={styles(theme).video}
            source={{
              uri: encodeURI(
                `${finalFileBaseUrl}/${params.userId}/${projectRefreshed.id_proj}/${projectRefreshed.arquivo_final}`
              ),
            }}
            useNativeControls
            resizeMode="contain"
            isLooping
            onPlaybackStatusUpdate={(status) => setStatus(() => status)}
          />

          {downloadLoading ? (
            <TitleWrapper>
              <ProgressBar progress={`${downloadProgress}%`} widthCustom='100%'/>
              <Subtitle style={{textAlign: 'center'}}>Downloading: {`${downloadProgress}%`}</Subtitle>
            </TitleWrapper>
          ) : null}

          {projectRefreshed.status_proj === "Em aprovacao" ? (
            <View style={styles(theme).buttonsView}>
              <TouchableOpacity
                style={styles(theme).ApproveButton}
                onPress={() => setApproveModalIsVisible(true)}
              >
                <Text
                  style={styles(theme).textButton}
                  adjustsFontSizeToFit
                  numberOfLines={1}
                >
                  Aprovar Pedido
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles(theme).DetachButton}
                onPress={() => setCorrectModalIsVisible(true)}
              >
                <Text
                  style={styles(theme).textButton}
                  adjustsFontSizeToFit
                  numberOfLines={1}
                >
                  Solicitar Correção
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles(theme).buttonsView}>
              <TouchableOpacity
                style={[styles(theme).editDescriptionButton, { width: "100%" }]}
                onPress={downlaodVideo}
              >
                <Text
                  style={styles(theme).textButton}
                  adjustsFontSizeToFit
                  numberOfLines={1}
                >
                  Download do vídeo
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Content>
      )}

      {/* Início do modal! */}
      {approveModalIsVisilble ? (
        <ApproveModal
          handleApproveProject={handleApproveProject}
          handleCloseApproveModal={handleCloseApproveModal}
          setStars={setStars}
          approveModalIsVisible={approveModalIsVisilble}
        />
      ) : correctModalIsVisilble ?
      <CorrectModal
        handleCorrectProject = {handleCorrectProject}
        handleCloseCorrectModal = {handleCloseCorrectModal}
        setCorrectDescription = {setCorrectDescription}
        correctModalIsVisible = {correctModalIsVisilble}
        correctDescription = {correctDescription}
        erroEdicao = {erroEdicao}
        setErroEdicao = {setErroEdicao}
      /> 
      : null}
      {/* Fim do Modal */}
    </Container>
  );
}

const styles = (theme) =>
  StyleSheet.create({
    video: {
      zIndex: 0,
      flex: 5,
      alignSelf: "center",
      width: "90%",
      height: 250,
    },
    buttonsView: {
      flex: 2,
      flexDirection: "row",
      width: "100%",
      alignSelf: "center",
      alignItems: "center",
      justifyContent: "space-between",
    },
    editDescriptionButton: {
      paddingHorizontal: 15,
      paddingVertical: 15,
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primary,
    },
    ApproveButton: {
      paddingHorizontal: 15,
      paddingVertical: 15,
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.success,
    },
    DetachButton: {
      paddingHorizontal: 15,
      paddingVertical: 15,
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.attention,
    },
    textButton: {
      fontFamily: theme.fonts.poppins_medium,
      fontSize: 13,
      color: theme.colors.shape,
      textAlign: "center",
    },
    image: {
      position: "absolute",
      alignSelf: "center",
      bottom: "50%",
      zIndex: 1,
      width: "100%",
    },
  });
