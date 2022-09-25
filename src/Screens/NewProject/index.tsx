import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useTheme } from "styled-components";
import { TimePicker, ValueMap } from "react-native-simple-time-picker";
import ky from "ky";

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
  ContentPage3,
  InfoContent,
  InfoWrapper,
  InfoTitleWrapper,
  InfoTitle,
  InfoSubtitle,
  InfoPageNumberWrapper,
  InfoPage,
  FormContent,
  NameContent,
  TitleWrapper,
  Subtitle,
  Title,
  TimeContent,
  DurationCompFlatList,
  DurationView,
  DurationText,
  DescriptionContainer,
  LinkContainer,
  FormatsContainer,
  FormatsTitleWrapper,
  FormatsFlatListContainer,
  FormatsValueWrapper,
} from "./styles";
import { BackButton } from "../../Components/BackButton";
import { ProgressBar } from "../../Components/ProgressBar";
import { ProjectInput } from "../../Components/ProjectInput";
import { ButtonCustom } from "../../Components/ButtonCustom";
import { AudioRecorder } from "../../Components/AudioRecorder";
import api, { baseUrl, libraryBaseUrl } from "../../services/api";
import { FormatButton } from "../../Components/FormatButton";
import { RFValue } from "react-native-responsive-fontsize";
import { ProjectProps } from "../../utils/Interfaces";
import { getProjectAudio } from "../../services/getProjectAudio";
import { getBottomSpace } from "react-native-iphone-x-helper";

interface Params {
  userId: number;
  userName?: string;
  projectToEdit?: ProjectProps;
}

interface FormatProps {
  key: string;
  icons: string[];
  title: string;
  isSelected: boolean;
}

export function NewProject({ navigation }) {
  const theme = useTheme();

  const route = useRoute();
  const { userId, userName, projectToEdit } = route.params as Params;

  const [pageForm, setPageForm] = useState(0);
  const [progress, setProgress] = useState(25);
  const [loading, setLoading] = useState(false);
  const [loadingAfterButton, setLoadingAfterButton] = useState(false);
  const [lastId, setLastId] = useState(0);

  // ------------------- Variáveis da página 01 -----------------------------------------------

  const [projectName, setProjectName] = useState(
    projectToEdit ? projectToEdit.nome_proj : ""
  );

  // ------------------- Fim das variáveis da página 01 -----------------------------------------------

  // ------------------- Variáveis da página 02 -----------------------------------------------
  const [durationCompSelected, setDurationCompSelected] = useState(
    projectToEdit
      ? projectToEdit.duracao_compl
        ? projectToEdit.duracao_compl
        : ""
      : ""
  );

  const [projectDuration, setProjectDuration] = useState<ValueMap>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [projectDurationFormatted, setProjectDurationFormatted] = useState("");

  const [projectId, setProjectId] = useState(
    projectToEdit ? projectToEdit.id_proj : null
  );

  const durationCompList = ["exatamente", "a partir", "até", "aproximado"];

  // ------------------- Fim das Variáveis da página 02 -----------------------------------------------

  // ------------------- Variáveis da página 03 -----------------------------------------------

  const [audioMoment, setAudioMoment] = useState(
    projectToEdit ? "played" : "none"
  );
  const [projectDescription, setProjectDescription] = useState(
    projectToEdit
      ? projectToEdit.descri_proj
        ? projectToEdit.descri_proj
        : ""
      : ""
  );
  const [projectDescriptionLength, setProjectDescriptionLength] = useState(
    projectToEdit
      ? projectToEdit.descri_proj
        ? projectToEdit.descri_proj.length
        : 0
      : 0
  );
  const [confirmProjectDescriptionEmpty, setConfirmProjectDescriptionEmpty] =
    useState(false);

  const [audioFromProjectToEdit, setAudioFromProjectToEdit] = useState("");
  const [audioUri, setAudioUri] = useState("");
  const [confirmAudioEmpty, setConfirmAudioEmpty] = useState(false);

  // ------------------- Fim das Variáveis da página 03 -----------------------------------------------

  // ------------------- Variáveis da página 04 -----------------------------------------------

  const [projectLink, setProjectLink] = useState(
    projectToEdit
      ? projectToEdit.link_proj
        ? projectToEdit.link_proj
        : ""
      : ""
  );
  const [confirmProjectLinkEmpty, setConfirmProjctLinkEmpty] = useState(false);

  // ------------------- Fim das Variáveis da página 04 -----------------------------------------------

  // ------------------- Variáveis da página 05 -----------------------------------------------

  const [qtdFormats, setQtdFormats] = useState(0);
  const [formatsSelected, setFormatsSelected] = useState<FormatProps[]>([]);
  const [formatsSelectedFormatted, setFormatsSelectedFormatted] = useState<
    string[]
  >([]);
  const [formats, setFormats] = useState<FormatProps[]>([
    {
      key: "3",
      title: "TikTok",
      icons: ["tiktok"],
      isSelected: false,
    },
    {
      key: "4",
      title: "Youtube",
      icons: ["youtube"],
      isSelected: false,
    },
    {
      key: "7",
      title: "TV",
      icons: ["tv"],
      isSelected: false,
    },
    {
      key: "0",
      title: "Stories/Reels",
      icons: ["facebook-f", "instagram"],
      isSelected: false,
    },
    {
      key: "2",
      title: "Feed Estendido",
      icons: ["instagram"],
      isSelected: false,
    },
    {
      key: "1",
      title: "Feed Quadrado",
      icons: ["facebook-f", "instagram"],
      isSelected: false,
    },
    {
      key: "5",
      title: "Whatsapp",
      icons: ["whatsapp"],
      isSelected: false,
    },
    {
      key: "6",
      title: "Computador",
      icons: ["laptop"],
      isSelected: false,
    },
  ]);

  // ------------------- Fim das Variáveis da página 05 -----------------------------------------------

  // ------------------- UseEffect to Loading page -----------------------------------------------
  useEffect(() => {
    async function getAudio() {
      await getProjectAudio(userId, projectToEdit.id_proj).then((result) => {
        if (result.result === "Success") {
          let audioProjectUri = `${libraryBaseUrl}${userId}/${projectToEdit.id_proj}/audios/${result.projectAudioMsg.file_msg}`;
          setAudioUri(audioProjectUri);
          setAudioFromProjectToEdit(audioProjectUri);
        }
      });
    }

    async function getProjectDurationFormatted() {
      let hours = Number(projectToEdit.duracao_proj.split(":")[0]);
      let minutes = Number(projectToEdit.duracao_proj.split(":")[1]);
      let seconds = Number(projectToEdit.duracao_proj.split(":")[2]);

      setProjectDuration({
        hours: hours,
        minutes: minutes,
        seconds: seconds,
      });
    }

    async function getFormats() {
      let videoFormats: string[] = JSON.parse(projectToEdit.video_format);
      setQtdFormats(videoFormats.length);
      videoFormats.map((formatFromProject) => {
        let videoFormatAux: FormatProps = formats.find(
          (formatFind) => formatFind.title === formatFromProject
        );
        videoFormatAux.isSelected = true;
        setFormatsSelected((old) => [...old, videoFormatAux]);
        setFormatsSelectedFormatted((old) => [...old, videoFormatAux.title]);
      });
    }

    let myInterval = setInterval(() => {
      if (pageForm === 0) {
        if (!projectToEdit) {
          setPageForm(1);
        } else {
          getAudio();
          getProjectDurationFormatted();
          setProjectDurationFormatted(projectToEdit.duracao_proj);
          getFormats();
          setPageForm(2);
        }
        clearInterval(myInterval);
      }
    }, 2000);
  }, []);

  // ------------------- functions page 01 -----------------------------------------------

  async function handleContinueToPage2() {
    if (!projectName) {
      Alert.alert(`Por favor, dê um nome para seu projeto`);
      return;
    }

    try {
      await api
        .post(`proc_new_proj.php`, {
          userId: userId,
          userName: userName,
          projectName: projectName,
          projectDuration: projectDurationFormatted,
          durationCompSelected: durationCompSelected,
          format: null,
          lastId: projectId,
          projectDescription: projectDescription,
          projectLink: projectLink,
        })
        .then((response) => {
          if (
            response.data === "" ||
            response.data === null ||
            response.data === undefined
          ) {
            Alert.alert(`Usuário não encontrado`);
          } else if (response.data.result[0].response === "Success") {
            console.log(`Projeto Adicionado com Sucesso!`);
            setPageForm(pageForm + 1);
            setLoading(false);
            setLastId(response.data.result[0].lastId);
            setProjectId(response.data.result[0].lastId);
          } else {
            Alert.alert(`${response.data.result[0].response}`);
          }
        })
        .catch((error) => {
          console.log(`error --> ${error}`);
        });
    } catch (error) {}
  }

  // ------------------- End of functions page 01 -----------------------------------------------

  // ------------------- Functions page 02 -----------------------------------------------
  const handleChangeProjectDuration = (newValue: ValueMap) => {
    let hoursFormatted = String(newValue.hours);
    let minutesFormatted = String(newValue.minutes);
    let secondsFormatted = String(newValue.seconds);
    setProjectDuration(newValue);

    if (String(newValue.hours).length < 2) {
      hoursFormatted = ("0" + newValue.hours).slice(-4);
    }

    if (String(newValue.minutes).length < 2) {
      minutesFormatted = ("0" + newValue.minutes).slice(-4);
    }

    if (String(newValue.seconds).length < 2) {
      secondsFormatted = ("0" + newValue.seconds).slice(-4);
    }

    const newValueFormatted = `${hoursFormatted}:${minutesFormatted}:${secondsFormatted}`;
    setProjectDurationFormatted(newValueFormatted);
  };

  async function handleContinueToPage3() {
    if (
      projectDuration.hours === 0 &&
      projectDuration.minutes === 0 &&
      projectDuration.seconds === 0
    ) {
      Alert.alert(`Por favor, defina uma duração para o seu vídeo`);
      return;
    }
    if (!durationCompSelected) {
      Alert.alert(
        `Por favor, selecione uma das opções de duração do vídeo: exatamente, a partr, até ou aproximado`
      );
      return;
    }

    setPageForm(pageForm + 1);
  }

  // ------------------- End of functions page 02 -----------------------------------------------

  // ------------------- Functions page 03 -----------------------------------------------

  function handleChangeDescription(text: string) {
    setProjectDescription(text);
    setProjectDescriptionLength(text.length);
  }

  function handleContinueToPage4() {
    if (!projectDescription && !confirmProjectDescriptionEmpty) {
      Alert.alert(
        "Descrição vazia",
        "Tem certeza que deseja enviar o projeto sem nenhuma descrição para o editor?",
        [
          {
            text: "Estou ciente!",
            onPress: () => setConfirmProjectDescriptionEmpty(true),
            style: "destructive",
          },
          {
            text: "Voltar",
            onPress: () => console.log(`Cancelar clicado`),
            style: "cancel",
          },
        ]
      );
    } else {
      if ((!audioUri || audioMoment === "none") && !confirmAudioEmpty) {
        Alert.alert(
          "Sem áudio",
          "Tem certeza que deseja enviar o projeto sem nenhuma áudio descritivo para o editor?",
          [
            {
              text: "Estou ciente!",
              onPress: () => setConfirmAudioEmpty(true),
              style: "destructive",
            },
            {
              text: "Voltar",
              onPress: () => console.log(`Cancelar clicado`),
              style: "cancel",
            },
          ]
        );
      } else {
        setPageForm(pageForm + 1);
      }
    }
  }

  // --------------------------- End of functions page 03 -----------------------------------------------

  // --------------------------- Functions page 04 -------------------------------------------------

  function handleContinueToPage5() {
    if (!projectLink && !confirmProjectLinkEmpty) {
      Alert.alert(
        "Sem nenhum link",
        "Tem certeza que deseja enviar o projeto sem nenhum link de vídeo referência para o editor?",
        [
          {
            text: "Estou ciente!",
            onPress: () => setConfirmProjctLinkEmpty(true),
            style: "destructive",
          },
          {
            text: "Voltar",
            onPress: () => console.log(`Cancelar clicado`),
            style: "cancel",
          },
        ]
      );
    } else {
      setPageForm(pageForm + 1);
    }
  }

  // --------------------------- End of functions page 04 -------------------------------------------

  // -------------------------- Functions page 05 --------------------------------------------------

  function handlePressFormat(item: FormatProps, index: number) {
    let newFormats = [...formats];
    newFormats[index].isSelected = !newFormats[index].isSelected;

    if (newFormats[index].isSelected === true) {
      setQtdFormats(qtdFormats + 1);
      setFormatsSelected((oldArray) => [...oldArray, item]);
      setFormatsSelectedFormatted((old) => [...old, item.title]);
    } else {
      setQtdFormats(qtdFormats - 1);
      setFormatsSelected(
        formatsSelected.filter((element) => element.key != item.key)
      );
      setFormatsSelectedFormatted(
        formatsSelectedFormatted.filter((element) => element != item.title)
      );
    }

    setFormats(newFormats);
  }

  async function goToUploadFiles() {
    if (formatsSelected.length <= 0) {
      Alert.alert(`por favor selecione um formato para o vídeo`);
      return;
    } else {
      setLoading(true);
      const filename = "audio_start";
      const fd = new FormData();
      fd.append(
        "audio_data",
        JSON.parse(
          JSON.stringify({
            uri: audioUri,
            type: "audio/mp3",
            name: filename,
          })
        )
      );

      if (audioMoment != "none" && audioUri != audioFromProjectToEdit) {
        // Chamda para upload do áudio!

        console.log(
          `@NewProject:446 -> Iniciando upload do áudio com fd -> ${JSON.stringify(
            fd
          )}`
        );
        try {
          const response = await ky.post(
            `https://onmovie.video/app/proc_upload_audio.php?userId=${userId}}&projectId=${projectId}`,
            {
              body: fd,
            }
          );
          response.json().then((responseJson) => {
            // console.log(`@NewProject:456 -> responseJson.response -> ${responseJson.result[0].response}`)

            // console.log(
            //   `reponseJsonAudio -> ${responseJson.result[0].finalAudio}`
            // );
            // setAudioUri()

            // Chamada para atualização no DB da descrição e do link.
            try {
              api
                .post(`proc_new_proj.php`, {
                  userId: userId,
                  userName: userName,
                  projectName: projectName,
                  projectDuration: projectDurationFormatted,
                  durationCompSelected: durationCompSelected,
                  format: formatsSelectedFormatted,
                  lastId: projectId,
                  projectDescription: projectDescription,
                  projectLink: projectLink,
                })
                .then((response) => {
                  if (
                    response.data === "" ||
                    response.data === null ||
                    response.data === undefined
                  ) {
                    Alert.alert(`Usuário não encontrado`);
                  } else if (response.data.result[0].response === "Success") {
                    console.log(`Projeto Adicionado com Sucesso!`);
                    setLoading(false);
                    setPageForm(pageForm + 1);
                    navigation.navigate(`ProjectCloudMovie`, {
                      userId: userId,
                      projectId: projectId,
                      from: "start",
                    });
                  } else {
                    Alert.alert(`${response.data.result[0].response}`);
                  }
                })
                .catch((error) => {
                  console.log(`error --> ${error}`);
                });
            } catch (error) {}
          });
        } catch (error) {
          console.log(`error -> ${error}`);
        }
      } else {
        try {
          api
            .post(`proc_new_proj.php`, {
              userId: userId,
              userName: userName,
              projectName: projectName,
              projectDuration: projectDurationFormatted,
              durationCompSelected: durationCompSelected,
              format: formatsSelectedFormatted,
              lastId: projectId,
              projectDescription: projectDescription,
              projectLink: projectLink,
            })
            .then((response) => {
              if (
                response.data === "" ||
                response.data === null ||
                response.data === undefined
              ) {
                Alert.alert(`Usuário não encontrado`);
              } else if (response.data.result[0].response === "Success") {
                console.log(`Projeto Adicionado com Sucesso!`);
                setLoading(false);
                setPageForm(pageForm + 1);
                navigation.navigate(`ProjectCloudMovie`, {
                  userId: userId,
                  projectId: projectId,
                  from: "start",
                });
              } else {
                Alert.alert(`${response.data.result[0].response}`);
              }
            })
            .catch((error) => {
              console.log(`error --> ${error}`);
            });
        } catch (error) {}
      }
    }
  }

  // ------------------- End of functions page 05 ------------------------------------------

  function handleBackButton() {
    if (pageForm === 1) {
      navigation.navigate("Home");
    } else if (pageForm >= 2) {
      if (pageForm === 2 && projectToEdit) {
        navigation.goBack();
      } else {
        setPageForm(pageForm - 1);
      }
    } else {
    }
  }

  return (
    <Container>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      {pageForm === 0 ? (
        <ContentBegin>
          <TitleBegin>Vamos{`\n`}começar!</TitleBegin>
        </ContentBegin>
      ) : (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <FormContainer>
            <Header>
              <HeaderRow>
                <BackButton
                  onPress={handleBackButton}
                  color={theme.colors.primary}
                />
                <PageTitle>Novo Projeto</PageTitle>
                <HeaderIcon name="trash-outline" />
              </HeaderRow>
            </Header>

            {pageForm === 1 ? (
              loading || loadingAfterButton ? (
                <ActivityIndicator />
              ) : (
                <Content
                  behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                  <InfoContent>
                    <InfoWrapper>
                      <InfoTitleWrapper>
                        <InfoTitle>Informações</InfoTitle>
                        <InfoSubtitle>
                          Descreva e configure seu projeto
                        </InfoSubtitle>
                      </InfoTitleWrapper>
                      <InfoPageNumberWrapper>
                        <InfoPage style={style.InfoPage01}>1</InfoPage>
                        <InfoPage style={style.InfoPage02}>/</InfoPage>
                        <InfoPage style={style.InfoPage03}>5</InfoPage>
                      </InfoPageNumberWrapper>
                    </InfoWrapper>
                    <ProgressBar progress="20%" widthCustom="100%" />
                  </InfoContent>

                  <FormContent>
                    <NameContent>
                      <TitleWrapper>
                        <Subtitle>Vamos começar escolhendo o</Subtitle>
                        <Title>Nome do seu Projeto</Title>
                      </TitleWrapper>
                      <ProjectInput
                        autoCapitalize="sentences"
                        onChangeText={setProjectName}
                        multiline
                        textAlignVertical="top"
                        value={projectName}
                        placeholder="Digite aqui o nome do seu projeto"
                        placeholderTextColor={theme.colors.primary_light}
                        returnKeyType='done'
                        onSubmitEditing={handleContinueToPage2}
                      />
                    </NameContent>

                    {/* <ButtonCustom
                     text={"Continuar"}
                     backgroundColor={theme.colors.primary}
                     highlightColor={theme.colors.shape}
                     onPress={pageForm === 1 ? handleContinueToPage2 : null}
                    /> */}
                  </FormContent>
                </Content>
              ) // Página 02
            ) : pageForm === 2 ? (
              loading || loadingAfterButton ? (
                <ActivityIndicator />
              ) : (
                <Content
                  behavior={Platform.OS === "ios" ? "padding" : "padding"}
                >
                  <InfoContent>
                    <InfoWrapper>
                      <InfoTitleWrapper>
                        <InfoTitle>Informações</InfoTitle>
                        <InfoSubtitle>
                          Descreva e configure seu projeto
                        </InfoSubtitle>
                      </InfoTitleWrapper>
                      <InfoPageNumberWrapper>
                        <InfoPage style={style.InfoPage01}>{pageForm}</InfoPage>
                        <InfoPage style={style.InfoPage02}>/</InfoPage>
                        <InfoPage style={style.InfoPage03}>5</InfoPage>
                      </InfoPageNumberWrapper>
                    </InfoWrapper>
                    <ProgressBar progress="40%" widthCustom="100%" />
                  </InfoContent>

                  <FormContent>
                    <TimeContent>
                      <TitleWrapper>
                        <Subtitle>agora defina o</Subtitle>
                        <Title>Tempo final do vídeo?</Title>
                      </TitleWrapper>
                      <TimePicker
                        value={projectDuration}
                        onChange={handleChangeProjectDuration}
                        pickerShows={["hours", "minutes", "seconds"]}
                        hoursUnit="h"
                        minutesUnit="min"
                        secondsUnit="s"
                        textColor={theme.colors.primary}
                      
                      />
                      <Title style={Platform.OS === 'android' ? { marginTop: 100, marginBottom: 20 } : null}>
                        E ainda sobre o tempo do vídeo, ele será:
                      </Title>
                      <DurationCompFlatList
                        data={durationCompList}
                        keyExtractor={(item: string) => item}
                        horizontal
                        contentContainerStyle={{
                          width: "100%",
                          justifyContent: "space-between",
                          marginTop: 10,
                        }}
                        renderItem={({ item }) => {
                          return (
                            <DurationView
                              onPress={() => setDurationCompSelected(item)}
                              isSelected={
                                durationCompSelected === item ? true : false
                              }
                            >
                              <DurationText
                                isSelected={
                                  durationCompSelected === item ? true : false
                                }
                              >
                                {item}
                              </DurationText>
                            </DurationView>
                          );
                        }}
                      />
                    </TimeContent>

                    {/* <ButtonCustom
                      text={"Continuar"}
                      backgroundColor={theme.colors.primary}
                      highlightColor={theme.colors.shape}
                      onPress={pageForm === 2 ? handleContinueToPage3 : null}
                    /> */}
                  </FormContent>
                </Content>
              )
            ) : // Página 03
            pageForm === 3 ? (
              loading || loadingAfterButton ? (
                <ActivityIndicator />
              ) : (
                <View style={{flex: 1, paddingHorizontal: 30, paddingTop: 10, paddingBottom: getBottomSpace()+20}}>
                  <InfoContent>
                    <InfoWrapper>
                      <InfoTitleWrapper>
                        <InfoTitle>Informações</InfoTitle>
                        <InfoSubtitle>
                          Descreva e configure seu projeto
                        </InfoSubtitle>
                      </InfoTitleWrapper>
                      <InfoPageNumberWrapper>
                        <InfoPage style={style.InfoPage01}>{pageForm}</InfoPage>
                        <InfoPage style={style.InfoPage02}>/</InfoPage>
                        <InfoPage style={style.InfoPage03}>5</InfoPage>
                      </InfoPageNumberWrapper>
                    </InfoWrapper>
                    <ProgressBar progress="60%" widthCustom="100%" />
                  </InfoContent>

                  <FormContent>
                    <DescriptionContainer>
                      <Subtitle>Quais informações você considera</Subtitle>
                      <Title>Importantes para o editor?</Title>
                      <Subtitle style={{ color: theme.colors.attention }}>
                        {" "}
                        {projectDescriptionLength} / 800 caracteres
                      </Subtitle>
                      <ProjectInput
                        autoCapitalize="sentences"
                        onChangeText={handleChangeDescription}
                        maxLength={800}
                        multiline
                        value={projectDescription}
                        placeholder="Faça aqui uma breve descrição do seu projeto"
                        placeholderTextColor={theme.colors.primary_light}
                      />
                    </DescriptionContainer>

                    <AudioRecorder
                      setAudioUriResult={setAudioUri}
                      setAudioMomentResult={setAudioMoment}
                      audioMomentStart={audioMoment}
                      audioUriStart={audioMoment != "none" ? audioUri : null}
                      userId={userId}
                      projectId={projectId}
                    />
                    {audioMoment === 'recording' ? <Subtitle>Finalize a gravação do áudio no STOP para continuar</Subtitle> : null}
                    {/* <ButtonCustom
                      text={"Continuar"}
                      backgroundColor={audioMoment != 'recording' ? theme.colors.primary : theme.colors.inactive}
                      highlightColor={theme.colors.shape}
                      onPress={pageForm === 3 ? handleContinueToPage4 : null}
                      disabled={audioMoment === 'recording'}
                    /> */}
                  </FormContent>
                </View>
              )
            ) : pageForm === 4 ? (
              <Content
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}   
              >
                <InfoContent>
                  <InfoWrapper>
                    <InfoTitleWrapper>
                      <InfoTitle>Informações</InfoTitle>
                      <InfoSubtitle>
                        Descreva e configure seu projeto
                      </InfoSubtitle>
                    </InfoTitleWrapper>
                    <InfoPageNumberWrapper>
                      <InfoPage style={style.InfoPage01}>{pageForm}</InfoPage>
                      <InfoPage style={style.InfoPage02}>/</InfoPage>
                      <InfoPage style={style.InfoPage03}>5</InfoPage>
                    </InfoPageNumberWrapper>
                  </InfoWrapper>
                  <ProgressBar progress="80%" widthCustom="100%" />
                </InfoContent>

                <FormContent>
                  <LinkContainer>
                    <Subtitle>Coloque aqui algum</Subtitle>
                    <Title>Link de um vídeo referência</Title>

                    <ProjectInput
                      autoCapitalize="none"
                      onChangeText={setProjectLink}
                      autoCorrect={false}
                      multiline
                      value={projectLink}
                      placeholder="Por exemplo: Youtube"
                      placeholderTextColor={theme.colors.primary_light}
                    />
                  </LinkContainer>
                  <Subtitle
                    style={{
                      color: theme.colors.text,
                      textAlign: "center",
                      marginBottom: '10%',
                    }}
                  >
                    Obs: este link não é obrigatório, mas é importante para o
                    editor entender o perfil de vídeo que você deseja.
                  </Subtitle>
                  {/* <ButtonCustom
                    text={"Continuar"}
                    backgroundColor={theme.colors.primary}
                    highlightColor={theme.colors.shape}
                    onPress={pageForm === 4 ? handleContinueToPage5 : null}
                  /> */}
                </FormContent>
              </Content>
            ) : pageForm === 5 ? (
              loading || loadingAfterButton ? (
                <ActivityIndicator />
              ) : (
                <Content>
                  <InfoContent>
                    <InfoWrapper>
                      <InfoTitleWrapper>
                        <InfoTitle>Informações</InfoTitle>
                        <InfoSubtitle>
                          Descreva e configure seu projeto
                        </InfoSubtitle>
                      </InfoTitleWrapper>
                      <InfoPageNumberWrapper>
                        <InfoPage style={style.InfoPage01}>{pageForm}</InfoPage>
                        <InfoPage style={style.InfoPage02}>/</InfoPage>
                        <InfoPage style={style.InfoPage03}>5</InfoPage>
                      </InfoPageNumberWrapper>
                    </InfoWrapper>
                    <ProgressBar progress="100%" widthCustom="100%" />
                  </InfoContent>

                  <FormContent>
                    <FormatsContainer>
                      <FormatsTitleWrapper>
                        <Subtitle>agora escolha o(s)</Subtitle>
                        <Title>Formatos do seu vídeo.</Title>
                        <Subtitle
                          style={{
                            color: theme.colors.text,
                            textAlign: "center",
                            marginBottom: 60,
                            marginTop: 30,
                            fontSize: RFValue(10),
                          }}
                        >
                          obs: O valor da edição inclui 01 formato. Para
                          formatos adicionais, será cobrado um valor de R$ 20,00
                          por formato extra.
                        </Subtitle>
                      </FormatsTitleWrapper>

                      <FormatsFlatListContainer>
                        <ScrollView
                          contentContainerStyle={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            justifyContent: "center",
                          }}
                        >
                          {formats.map((item, index) => (
                            <FormatButton
                              key={item.key}
                              format={item}
                              backgroundColor={
                                item.isSelected
                                  ? theme.colors.primary
                                  : "transparent"
                              }
                              textColor={
                                item.isSelected
                                  ? theme.colors.shape
                                  : theme.colors.primary
                              }
                              onPress={() => handlePressFormat(item, index)}
                            />
                          ))}
                        </ScrollView>
                        {/* <FlatList 
                        data={formats}
                        keyExtractor={(item) => item.key}
                        renderItem={({item, index}) => (
                          <FormatButton
                            format={item}
                            backgroundColor={item.isSelected ? theme.colors.shape : "transparent"}
                            textColor={item.isSelected ? theme.colors.primary : theme.colors.shape}
                            onPress={() => handlePressFormat(index)}
                          />
                        )}
                        contentContainerStyle={{flexDirection : "row", flexWrap : "wrap", justifyContent:"center"}}
                      /> */}
                      </FormatsFlatListContainer>

                      <FormatsValueWrapper>
                        <Subtitle>Valor adicional de formatos:</Subtitle>
                        <Title style={{ color: theme.colors.secondary }}>
                          R$ {qtdFormats > 0 ? (qtdFormats - 1) * 20 : 0},00
                        </Title>
                      </FormatsValueWrapper>
                    </FormatsContainer>

                    {/* <ButtonCustom
                    text={"Continuar"}
                    backgroundColor={theme.colors.primary}
                    highlightColor={theme.colors.shape}
                    onPress={pageForm === 5 ? goToUploadFiles : null}
                  /> */}
                  </FormContent>
                </Content>
              )
            ) : null}
            {loading || loadingAfterButton ?
              <ActivityIndicator />
            :
              <ButtonCustom
                text={"Continuar"}
                highlightColor={theme.colors.shape}
                disabled={audioMoment === 'recording'}
                style={{alignSelf: "center", backgroundColor: audioMoment === 'recording' ? theme.colors.text : theme.colors.primary}}
                onPress={
                  pageForm === 1 ? handleContinueToPage2 : 
                  pageForm === 2 ? handleContinueToPage3 :
                  pageForm === 3 ? handleContinueToPage4 :
                  pageForm === 4 ? handleContinueToPage5 :
                  pageForm === 5 ? goToUploadFiles : null
                }
              />
            }
          </FormContainer>
        </TouchableWithoutFeedback>
      )}
    </Container>
  );
}

const style = StyleSheet.create({
  InfoPage01: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  InfoPage02: {
    position: "absolute",
    top: 10,
    left: 8,
  },
  InfoPage03: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
});
