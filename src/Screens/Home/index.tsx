import React, { useCallback, useEffect, useState } from "react";
import {
  StatusBar,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Dimensions,
  Text,
} from "react-native";

import { useTheme } from "styled-components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserDTO } from "../../dtos/UserDTO";
import api from "../../services/api";
import { ProgressBar } from "../../Components/ProgressBar";
import { LastProjectsCard } from "../../Components/LastProjectsCard";

import NewLogo from "../../assets/logos/newLogo.svg";
import MenuIcon from "../../assets/icons/MenuIcon.svg";
import VectorHomeUp from "../../assets/frames/VectorHomeUp.svg";
import VectorHomeDown from "../../assets/frames/VectorHomeDown.svg";

const ProfileImage = require("../../assets/png/ProfileImage.png");

import {
  Container,
  Header,
  HeaderWrapper,
  IconsWrapper,
  IconNotification,
  IconButton,
  Content,
  UserRow,
  UserInformations,
  UserName,
  TextHighlight,
  UserCredits,
  UserProfileWrapper,
  UserPhotoBackground,
  UserPhoto,
  MovieCloudContainer,
  MovieCloudRow,
  MovieCloudTitleWrapper,
  MovieCloudTitle,
  MovieCloudSubtitle,
  MovieCloudDiskSpace,
  ButtonsContainer,
  ButtonWrapper,
  ButtonHome,
  ButtonIconIonicons,
  ButtonIconMaterialCommunity,
  ButtonTitle,
  ButtonTitleWrapper,
  LastProjectsContainer,
  LastProjectsTitle,
  LastProjectsSubtitle,
  LastProjectsListView,
} from "./styles";
import { ProjectProps } from "../../utils/Interfaces";
import { getFiles } from "../../services/getFiles";
import { getProjetctFiles } from "../../services/getProjectFiles";
import { useFocusEffect } from "@react-navigation/native";

export function Home({ navigation }) {
  const theme = useTheme();

  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [user, setUser] = useState<UserDTO>();
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");

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

  const [noneProjects, setNoneProjects] = useState(true);
  const [projectsAll, setProjectsAll] = useState<ProjectProps[]>([]);
  const [projectsCreation, setProjectsCreation] = useState<ProjectProps[]>([]);
  const [pedidos, setPedidos] = useState<ProjectProps[]>([]);
  const [lastProjects, setLastProjects] = useState<ProjectProps[]>([]);

  const [userId, setUserId] = useState(0);

  useEffect(() => {
    async function fetchUser() {
      const userId = await AsyncStorage.getItem("@onmovieapp:userId");
      setUserId(Number(userId));

      api
        .get(`get_user.php?userId=${userId}`)
        .then((response) => {
          if (
            response.data.response === "" ||
            response.data.response === null ||
            response.data.response === undefined
          ) {
            Alert.alert(`Erro -> Usuário não encontrado`);
          } else if (response.data.response === "Success") {
            if (response.data.user[0].usoArred > 100) {
              response.data.user[0].usoArred = 100;
            }
            setUser(response.data.user[0]);
            setFirstName(response.data.user[0].nome.split(" ")[0]);
            setSecondName(response.data.user[0].nome.split(" ")[1]);
            setLoadingUser(false);
          } else {
            setLoadingUser(false);
            console.log(`Algo errado aconteceu --> ${response.data.response}`);
          }
        })
        .catch((error) => {
          console.log(`Erro -> ${error}`);
        });
    }
    const unsubscribe = navigation.addListener("focus", () => {
      fetchUser();
    });
    fetchUser();
    return unsubscribe;
  }, [refreshing, navigation]);

  useFocusEffect(
    useCallback(() => {
      async function fetchProjects() {
        const userId = await AsyncStorage.getItem("@onmovieapp:userId");

        api
          .get(`list_projects_all.php?userId=${userId}`)
          .then((response) => {
            if (
              response.data.response === "" ||
              response.data.response === null ||
              response.data.response === undefined
            ) {
              Alert.alert(`Erro -> Usuário não encontrado`);
            } else if (response.data.response === "Success") {
              setProjectsAll([]);
              setLastProjects([]);
              setPedidos([]);
              setProjectsCreation([]);
              const lastProjectsAux = [];

              response.data.projetos.forEach(async (item: ProjectProps, i) => {
                await getProjetctFiles(userId, item.id_proj).then((result) => {
                  if (result.result === "Success") {
                    item.files = result.libraryDependenciesFiles;
                    item.qtd_files = result.libraryDependenciesFiles.length;
                  }
                });

                switch (item.status_proj) {
                  case "Rascunho":
                    item.newStatusProj = "Criação";
                    item.highlightColor = theme.colors.highlight;
                    setProjectsCreation((old) => [...old, item]);
                    if (lastProjectsAux.length <= 4) {
                      lastProjectsAux.push(item);
                      setLastProjects((old) => [...old, item]);
                    }
                    break;

                  case "Na Fila":
                    item.newStatusProj = "Fila";
                    item.highlightColor = theme.colors.secondary;
                    setPedidos((old) => [...old, item]);
                    break;

                  case "em edicao":
                    item.newStatusProj = "Edição";
                    item.highlightColor = theme.colors.title;
                    setPedidos((old) => [...old, item]);
                    break;

                  case "Em edicao":
                    item.newStatusProj = "Edição";
                    item.highlightColor = theme.colors.title;
                    setPedidos((old) => [...old, item]);
                    break;

                  case "controle":
                    item.newStatusProj = "Edição";
                    item.highlightColor = theme.colors.title;
                    setPedidos((old) => [...old, item]);
                    break;

                  case "correcao_controle":
                    item.newStatusProj = "Edição";
                    item.highlightColor = theme.colors.title;
                    setPedidos((old) => [...old, item]);
                    break;

                  case "em correcao":
                    item.newStatusProj = "Correção";
                    item.highlightColor = theme.colors.highlight_pink;
                    setPedidos((old) => [...old, item]);
                    break;

                  case "em aprovacao":
                    item.newStatusProj = "Aprovação";
                    item.highlightColor = theme.colors.attention;
                    setPedidos((old) => [...old, item]);
                    break;

                  case "Em aprovacao":
                    item.newStatusProj = "Aprovação";
                    item.highlightColor = theme.colors.attention;
                    setPedidos((old) => [...old, item]);
                    break;

                  case "Aprovado":
                    item.newStatusProj = "Finalizado";
                    item.highlightColor = theme.colors.success;
                    setPedidos((old) => [...old, item]);
                    break;

                  default:
                    console.log(
                      `Projeto id ${item.id_proj} com status ${item.newStatusProj} não ficou em nenhuma categoria`
                    );
                }

                setProjectsAll((oldItems) => [...oldItems, item]);
              });

              setNoneProjects(false);
              setLoadingProjects(false);
            } else {
              setLoadingProjects(false);
              setNoneProjects(true);
              // Alert.alert(`Erro -> ${response.data.response}`);
            }
          })
          .catch((error) => {
            console.log(`error na home -> ${error}`);
          });
      }

      fetchProjects();
    }, [refreshing, navigation])
  );

  function handleNotifications() {
    console.log(`Clicked on Notifications`);
  }

  function handleMenu() {
    navigation.navigate("MenuPage", {
      user: user,
      pedidos: pedidos,
      projectsInCreation: projectsCreation,
    });
  }

  function handleProjectPressed(item: ProjectProps) {
    navigation.navigate(`ProjectDetails`, {
      project: item,
      userId: userId,
    });
  }

  function handleButtonPedidos() {
    navigation.navigate("MyOrders", { projects: pedidos, userId: userId });
  }

  function handleButtonProjetos() {
    navigation.navigate("MyProjects", {
      projects: projectsCreation,
      userId: userId,
    });
  }

  function handleNewProject() {
    navigation.navigate("NewProject", {
      userId: user.id_user,
      userName: user.nome,
    });
  }

  return (
    <Container>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <VectorHomeUp
        width={Dimensions.get("window").width + 300}
        style={styles.vectorUp}
      />
      <Header>
        <HeaderWrapper>
          <NewLogo width={73} height={36} />
          <IconsWrapper>
            <IconButton onPress={handleNotifications}>
              <IconNotification name="notifications-outline" />
            </IconButton>
            <IconButton onPress={handleMenu}>
              <MenuIcon />
            </IconButton>
          </IconsWrapper>
        </HeaderWrapper>
      </Header>
      {loadingUser ? (
        <ActivityIndicator />
      ) : (
        <Content
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <UserRow>
            <UserInformations>
              <UserName>
                <TextHighlight>{firstName}</TextHighlight> {secondName}
              </UserName>
              <UserCredits>créditos disponíveis: R$ {user.saldo}</UserCredits>
            </UserInformations>
            <UserProfileWrapper>
              <UserPhotoBackground>
                <UserPhoto source={ProfileImage} width={55} height={55} />
              </UserPhotoBackground>
            </UserProfileWrapper>
          </UserRow>

          <MovieCloudContainer>
            <MovieCloudRow>
              <MovieCloudTitleWrapper>
                <MovieCloudTitle>Movie Cloud</MovieCloudTitle>
                <MovieCloudSubtitle>
                  seus arquivos em projetos
                </MovieCloudSubtitle>
              </MovieCloudTitleWrapper>
              <MovieCloudDiskSpace>{user.usoArred}%</MovieCloudDiskSpace>
            </MovieCloudRow>
            <ProgressBar
              progress={`${user.usoArred}%`}
              color={theme.colors.highlight}
            />
          </MovieCloudContainer>

          <ButtonsContainer>
            <ButtonWrapper>
              <ButtonHome
                onPress={handleNewProject}
                style={{ backgroundColor: theme.colors.highlight }}
              >
                <ButtonIconIonicons name="add-circle-outline" />
              </ButtonHome>
              <ButtonTitleWrapper>
                <ButtonTitle>Novo{"\n"}Projeto</ButtonTitle>
              </ButtonTitleWrapper>
            </ButtonWrapper>

            <ButtonWrapper>
              <ButtonHome
                onPress={handleButtonProjetos}
                style={{ backgroundColor: theme.colors.dark_inactive }}
              >
                <ButtonIconMaterialCommunity name="movie-edit" />
              </ButtonHome>
              <ButtonTitleWrapper>
                <ButtonTitle>Projetos{"\n"}em Criação</ButtonTitle>
              </ButtonTitleWrapper>
            </ButtonWrapper>

            <ButtonWrapper>
              <ButtonHome
                onPress={handleButtonPedidos}
                style={{ backgroundColor: theme.colors.dark_inactive }}
              >
                <ButtonIconMaterialCommunity name="movie-check" />
              </ButtonHome>
              <ButtonTitleWrapper>
                <ButtonTitle>Pedidos</ButtonTitle>
              </ButtonTitleWrapper>
            </ButtonWrapper>

            <ButtonWrapper>
              <ButtonHome
                style={{ backgroundColor: theme.colors.dark_inactive }}
              >
                <ButtonIconIonicons name="school-outline" />
              </ButtonHome>
              <ButtonTitleWrapper>
                <ButtonTitle>Aprenda</ButtonTitle>
              </ButtonTitleWrapper>
            </ButtonWrapper>
          </ButtonsContainer>

          <LastProjectsContainer>
            <LastProjectsTitle>Últimos Projetos</LastProjectsTitle>
            <LastProjectsSubtitle>Continue Trabalhando</LastProjectsSubtitle>
            {loadingProjects ? (
              <ActivityIndicator
                style={{ alignSelf: "center" }}
                color={theme.colors.shape}
              />
            ) : noneProjects ? (
              <Text
                style={{
                  fontFamily: theme.fonts.poppins_medium,
                  fontSize: 12,
                  color: theme.colors.shape,
                }}
              >
                Você não tem nenhum projeto em criação
              </Text>
            ) : (
              <LastProjectsListView
                horizontal
                showsHorizontalScrollIndicator={false}
                data={lastProjects}
                keyExtractor={(e: ProjectProps) => e.id_proj}
                renderItem={({ item }) => (
                  <LastProjectsCard
                    onPress={() => handleProjectPressed(item)}
                    project={item}
                  />
                )}
              />
            )}
          </LastProjectsContainer>
        </Content>
      )}
      <VectorHomeDown style={styles.vectorsDown} />
    </Container>
  );
}

const styles = StyleSheet.create({
  vectorUp: {
    position: "absolute",
    top: -130,
    left: -180,
    zIndex: 0,
  },
  vectorsDown: {
    position: "absolute",
    bottom: -140,
    alignSelf: "center",
    zIndex: 0,
  },
  content: {
    flex: 1,
    paddingVertical: 0,
    paddingHorizontal: 30,
    paddingTop: 40,
    alignItems: "center",
    zIndex: 1,
  },
  noneProjects: {},
});
