import React, { useEffect, useState } from "react";
import { StyleSheet } from 'react-native';

import NewLogo from "../../assets/logos/newLogo.svg";
import MenuIcon from "../../assets/icons/MenuIcon.svg";
import VectorsLoginDown from '../../assets/frames/vectorsLoginDown.svg';


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
} from "./styles";
import { ActivityIndicator, Alert, Dimensions, Text } from "react-native";
import { useTheme } from "styled-components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserDTO } from "../../dtos/UserDTO";
import api from "../../services/api";
import { ProgressBar } from "../../Components/ProgressBar";

export function Home({ navigation }) {
  const theme = useTheme();
  const NewLogoMargin = (Dimensions.get("window").width - 73) / 2;

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserDTO>();
  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');


  useEffect(() => {
    async function fetchUser() {
      const userId = await AsyncStorage.getItem("@onmovieapp:userId");
      console.log(`UserId --> ${userId}`)

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
            setUser(response.data.user[0]);
            setFirstName(response.data.user[0].nome.split(' ')[0]);
            setSecondName(response.data.user[0].nome.split(' ')[1]);
            setLoading(false);
          } else {
            setLoading(false);
            console.log(`Algo errado aconteceu --> ${response.data.response}`);
          }
        })
        .catch((error) => {
          console.log(`Erro -> ${error}`);
        });
    }

    fetchUser();
  }, []);

  async function handleLogout() {
    try {
      await AsyncStorage.removeItem("@onmovieapp:userId");
      navigation.navigate("FirstPage");
    } catch (e) {
      navigation.navigate("FirstPage");
      console.log(`Erro ao remover Async -> ${e}`);
    }
  }

  function handleBackButton() {
    navigation.goBack();
  }

  function handleGoToMyProjects() {
    navigation.navigate("MyProjects");
  }

  function handleNotifications() {
    console.log(`Clicked on Notifications`);
  }

  function handleMenu() {
    console.log(`Clicked on Menu`);
  }

  return (
    <Container>
      <VectorsLoginDown width={Dimensions.get("window").width + 300} style={styles.vectorsDown} />
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
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Content>
          <UserRow>
            <UserInformations>
              <UserName>
                <TextHighlight>{firstName}</TextHighlight> {secondName}
              </UserName>
              <UserCredits>créditos disponíveis: R$ 129,09</UserCredits>
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
                <MovieCloudSubtitle>seus arquivos em projetos</MovieCloudSubtitle>
              </MovieCloudTitleWrapper>
              <MovieCloudDiskSpace>98/100mb</MovieCloudDiskSpace>
            </MovieCloudRow>
            <ProgressBar progress={"30%"} color={theme.colors.highlight}/>
          </MovieCloudContainer>
        </Content>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  vectorUp: {
    position: 'absolute',
    zIndex: 0,
  },
  vectorsDown: {
    position: 'absolute',
    top: -50,
    alignSelf: "center",
    zIndex: 0,
  },
});

