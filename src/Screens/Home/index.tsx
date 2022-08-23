import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  StatusBar,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Text,
  Platform,
} from "react-native";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Subscription } from "expo-modules-core";
import * as TaskManager from "expo-task-manager";
import * as Linking from "expo-linking";
import { updateUserPushToken } from "../../services/updateUserPushToken";

import { useTheme } from "styled-components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserDTO } from "../../dtos/UserDTO";
import { ProgressBar } from "../../Components/ProgressBar";
import { LastProjectsCard } from "../../Components/LastProjectsCard";

import NewLogo from "../../assets/logos/newLogo.svg";
import MenuIcon from "../../assets/icons/MenuIcon.svg";
import VectorHomeUp from "../../assets/frames/VectorHomeUp.svg";
import VectorHomeDown from "../../assets/frames/VectorHomeDown.svg";

// const ProfileImage = require("../../assets/png/ProfileImage.png");
const Avatar = require("../../assets/png/avatar.png");

import {
  Container,
  Header,
  HeaderWrapper,
  IconsWrapper,
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
import { useFocusEffect } from "@react-navigation/native";
import api from "../../services/api";
import { getProjectById } from "../../services/getProjectById";
import { getProjects } from "../../services/getProjects";
import { NotificationsModal } from "../../Components/NotificationsModal";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK";
const BACKGROUND_TASK_SUCCESSFUL = "Background task successfully ran!";
const BACKGROUND_TEST_INFO = `To test background notification handling:\n(1) Background the app.\n(2) Send a push notification from your terminal. The push token can be found in your logs, and the command to send a notification can be found at https://docs.expo.dev/push-notifications/sending-notifications/#http2-api. On iOS, you need to include "_contentAvailable": "true" in your payload.\n(3) After receiving the notification, check your terminal for:\n"${BACKGROUND_TASK_SUCCESSFUL}"`;

TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error }) => {
  // console.log(BACKGROUND_TASK_SUCCESSFUL);
  // console.log(`Data -> ${data}`);
});

export function Home({ navigation }) {
  const theme = useTheme();

  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [user, setUser] = useState<UserDTO>();
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");

  const [refreshing, setRefreshing] = useState(false);

  const [noneProjects, setNoneProjects] = useState(true);
  const [projectsAll, setProjectsAll] = useState<ProjectProps[]>([]);
  const [projectsCreation, setProjectsCreation] = useState<ProjectProps[]>([]);
  const [pedidos, setPedidos] = useState<ProjectProps[]>([]);
  const [lastProjects, setLastProjects] = useState<ProjectProps[]>([]);

  const [isNotificaitonModalOpen, setIsNotificationModalOpen] = useState(false);

  const [userId, setUserId] = useState(0);
  const [loading, setLoading] = useState(true);

  const [qtdFranquias, setQtdFranquias] = useState(0);

  // Para notificações

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState({});
  const notificationListener = useRef<Subscription | undefined>();
  const responseListener = useRef<Subscription | undefined>();

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(100).then(() => {
      setRefreshing(false);
    });
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          experienceId: "@paulobechara/OnMovieApp",
        })
      ).data;
      // console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }

  useEffect(() => {
    var userIdAux;
    AsyncStorage.getItem(`@onmovieapp:userId`).then((result) => {
      userIdAux = result;
    });

    registerForPushNotificationsAsync().then(async (token) => {
      console.log(`iniciando registerForPushNotificationAsync com token -> ${token}`)
      await setExpoPushToken(token);

      await api
        .get(`get_user.php?userId=${userIdAux}`)
        .then(async (response) => {
          // console.log(`Response do GetUser -> ${JSON.stringify(response.data)}`)

          console.log(`Success do response Data com push_token -> ${userIdAux} ${response.data.user[0].push_token}`)
          if (response.data.response === "Success") {
            if (!response.data.user[0].push_token) {
              await updateUserPushToken(userIdAux, token).then((res) => {
                console.log(`Iniciando updateUserPushToken com userId = ${userIdAux} e token ${token}`)
                if (res.result === "Success") {
                  console.log(`Token updated Successfully!`);
                }
              });
            } else {
              console.log(
                `Usuário já possui push_token -> ${response.data.user[0].push_token}`
              );
            }
          }
        });
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log(`notificationListener -> ${notification}`);
        setNotification(`Notificação -> ${JSON.stringify(notification)}`);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(
          `Response Notification -> ${JSON.stringify(
            response.notification.request.content.data
          )}`
        );
        const routeReceived = response.notification.request.content.data.route;
        // const route = JSON.stringify(response.notification.request.content.data.route);
        // const routeToGo = `onmovieapp://MenuPage`;
        if (
          response.notification.request.content.data.route === "Chat" ||
          response.notification.request.content.data.route === "ProjectDetails"
        ) {
          getProjectById(
            userIdAux,
            response.notification.request.content.data.projectId,
            theme
          ).then((result) => {
            if (result.result === "Success") {
              navigation.navigate(
                `${response.notification.request.content.data.route}`,
                {
                  project: result.projectResult,
                  userId: userIdAux,
                }
              );
            }
          });
        }
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      setLoadingProjects(true);
      // setUser({} as UserDTO);

      async function fetchUser() {
        const userId = await AsyncStorage.getItem("@onmovieapp:userId");
        setUserId(Number(userId));

        api
          .get(`get_user.php?userId=${userId}`)
          .then((response) => {
            if (response.data.response === "Success") {
              let userAux: UserDTO = response.data.user[0];

              if (userAux.usoArred > 100) {
                userAux.usoArred = 100;
              }
              userAux.saldo = userAux.saldo.toFixed(2);
              setUser(userAux);
              setFirstName(userAux.nome.split(" ")[0]);
              setSecondName(userAux.nome.split(" ")[1]);

              getAssinaturas(userAux.id_user);
            }
          })
          .catch((error) => {
            console.log(`Erro -> ${error}`);
          });
      }

      async function getAssinaturas(userId) {
        api.get(`get_assinaturas.php?userId=${userId}`).then((response) => {
          if (response.data.response === "Success") {
            setQtdFranquias(Number(response.data.qtd_franquias));
            setLoadingUser(false);
          } else {
            setLoadingUser(false);
          }
        });
      }

      async function fetchProjects() {
        const userIdAux = await AsyncStorage.getItem(`@onmovieapp:userId`);
        await getProjects(userIdAux, theme).then((result) => {
          if (result.result === "Success") {
            setLastProjects(result.lastProjectsInCreation);

            if (result.lastProjectsInCreation.length > 0) {
              setNoneProjects(false);
            } else {
              setNoneProjects(true);
            }
          }

          setLoading(false);
          setLoadingProjects(false);
        });
      }

      fetchUser();
      fetchProjects();
    }, [refreshing, navigation])
  );

  function handleNotifications() {
    setIsNotificationModalOpen(true);
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
    navigation.navigate("MyOrders", { userId: userId });
  }

  function handleButtonProjetos() {
    navigation.navigate("MyProjects", {
      userId: userId,
    });
  }

  function handleNewProject() {
    navigation.navigate("NewProject", {
      userId: user.id_user,
      userName: user.nome,
    });
  }

  function handleCloseNotificationModal() {
    setIsNotificationModalOpen(false);
  }

  return (
    <Container>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <VectorHomeUp style={styles.vectorUp} />
      <Header>
        <HeaderWrapper>
          <NewLogo style={styles.newLogo} />
          <IconsWrapper>
            {/* <IconButton onPress={handleNotifications}>
              <IconNotification name="notifications-outline" />
            </IconButton> */}
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
              {user.assinante ? (
                <UserCredits>
                  Vídeos restantes na assinatura: {qtdFranquias}
                </UserCredits>
              ) : null}
            </UserInformations>
            <UserProfileWrapper>
              <UserPhotoBackground>
                <UserPhoto
                  source={user.avatar === "avatar.jpg" ? Avatar : null}
                  style={styles.userPhoto}
                />
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

          {loadingUser ? (
            <ActivityIndicator />
          ) : (
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
          )}
          <LastProjectsContainer>
            <LastProjectsTitle>Últimos Projetos em Criação</LastProjectsTitle>
            <LastProjectsSubtitle>Continue Trabalhando</LastProjectsSubtitle>
            
            {loading ? <ActivityIndicator /> :
             noneProjects ? (
              <Text
                style={{
                  fontFamily: theme.fonts.poppins_medium,
                  fontSize: 12,
                  color: theme.colors.shape,
                }}
              >
                Você não tem nenhum projeto em criação
              </Text>
            ) : lastProjects ? (
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
            ) : null}
          </LastProjectsContainer>
        </Content>
      )}

      {isNotificaitonModalOpen ? (
        <NotificationsModal
          userId={userId}
          handleCloseNotificationModal={handleCloseNotificationModal}
        />
      ) : null}
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
    width: 200,
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
  userPhoto: {
    width: 55,
    height: 55,
  },
  newLogo: {
    width: 73,
    height: 36,
  },
});
