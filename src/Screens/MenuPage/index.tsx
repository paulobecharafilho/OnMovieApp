import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet } from "react-native";
import { useTheme } from "styled-components";
import { useRoute } from "@react-navigation/native";
import { UserDTO } from "../../dtos/UserDTO";
import * as Linking from 'expo-linking';


import NewLogo from "../../assets/logos/newLogo.svg";
import VectorMenuProfile from "../../assets/frames/VectorMenuProfile.svg";
import VectorMenuDown from "../../assets/frames/VectorMenuDown.svg";
const MenuProfilePhoto = require("../../assets/png/MenuProfilePhoto.png");

import {
  Container,
  Header,
  HeaderWrapper,
  IconsWrapper,
  IconButton,
  IconNotification,
  IconClose,
  Content,
  ProfileContainer,
  Photo,
  ProfileTitleContainer,
  ProfileTitle,
  ProjectTitleHighlight,
  ProfileSubtitle,
  ButtonsContainer,
  ButtonsRow,
  ButtonWrapper,
  ButtonHome,
  ButtonIconIonicons,
  ButtonIconMaterialCommunity,
  ButtonTitle,
  ButtonTitleWrapper,
} from "./styles";
import { format } from "date-fns";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProjectProps } from "../../utils/Interfaces";


interface Params {
  user: UserDTO;
  pedidos: ProjectProps;
  projectsInCreation: ProjectProps;
}

export function MenuPage({ navigation }) {
  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [dateFormatted, setDateFormatted] = useState('');

  const route = useRoute();
  const {user, pedidos, projectsInCreation} = route.params as Params
  
  useEffect(() => {
    try {
      setFirstName(user.nome.split(" ")[0]);
      setSecondName(user.nome.split(" ")[1]);
      setDateFormatted(format(new Date(user.created), 'yyyy'))
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }, [user])

  function handleCloseMenu() {
    navigation.goBack();
  }

  function logoutAlert() {
    Alert.alert(
      "Logout",
      "Tem certeza que deseja realizar o logout de sua conta?",
      [
        {
          text: "Fazer Logout",
          onPress: () => handleLogout(),
          style: "destructive",
        },
        {
          text: "Voltar",
          onPress: () => console.log(`Cancelar clicado`),
          style: "cancel",
        },
      ]
    );
  }

  async function handleLogout() {
    try {
      await AsyncStorage.removeItem("@onmovieapp:userId");
      navigation.navigate("FirstPage");
    } catch (e) {
      navigation.navigate("FirstPage");
      console.log(`Erro ao remover Async -> ${e}`);
    }
  }

  function handleNotification() {
    navigation.navigate('');
  }

  function handleButtonPedidos() {
    navigation.navigate("MyOrders", {projects: pedidos, userId: user.id_user});
  }

  function handleButtonProjetos() {
    navigation.navigate("MyProjects", { projects: projectsInCreation, userId: user.id_user });
  }

  function handleCloudMovie() {
    navigation.navigate('');
  }

  function handlePayments() {
    navigation.navigate('');
  }

  function handleLearning() {
    navigation.navigate('');
  }

  function handleProfile() {
    navigation.navigate('');
  }

  function handleSupport() {
    Linking.openURL('https://api.whatsapp.com/send?phone=5581993818228&text=Ol%C3%A1.%20Estava%20no%20app%20da%20OnMovie%20e%20necessito%20de%20ajuda.');
  }

  return (
    <Container>
      <Header>
        <HeaderWrapper>
          <NewLogo width={73} height={36} />
          <IconsWrapper>
            <IconButton onPress={logoutAlert}>
              <IconNotification name="power-outline" />
            </IconButton>
            <IconButton onPress={handleCloseMenu}>
              <IconClose name="close" />
            </IconButton>
          </IconsWrapper>
        </HeaderWrapper>
      </Header>
      {loading ? <ActivityIndicator color={theme.colors.shape}/> :
        <Content>
          <ProfileContainer>
            <VectorMenuProfile width={"100%"} style={styles.profileVector} />
            <Photo source={MenuProfilePhoto} />
          </ProfileContainer>

          <ProfileTitleContainer>
            <ProfileTitle>
              <ProjectTitleHighlight>{firstName}</ProjectTitleHighlight> {secondName}
            </ProfileTitle>
            <ProfileSubtitle>Aqui desde {dateFormatted}</ProfileSubtitle>
          </ProfileTitleContainer>

          <ButtonsContainer>
            <ButtonsRow>
              <ButtonWrapper>
                <ButtonHome
                  onPress={handleButtonProjetos}
                  style={{ backgroundColor: theme.colors.dark_inactive }}
                >
                  <ButtonIconMaterialCommunity name="movie-edit" />
                </ButtonHome>
                <ButtonTitleWrapper>
                  <ButtonTitle>Projetos</ButtonTitle>
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
                  onPress={handleCloudMovie}
                  style={{ backgroundColor: theme.colors.dark_inactive }}
                >
                  <ButtonIconIonicons name="md-cloud-done" />
                </ButtonHome>
                <ButtonTitleWrapper>
                  <ButtonTitle>Cloud{`\n`}Movie</ButtonTitle>
                </ButtonTitleWrapper>
              </ButtonWrapper>
            </ButtonsRow>

            <ButtonsRow>
              <ButtonWrapper>
                <ButtonHome
                  onPress={handlePayments}
                  style={{ backgroundColor: theme.colors.dark_inactive }}
                >
                  <ButtonIconIonicons name="ios-card" />
                </ButtonHome>
                <ButtonTitleWrapper>
                  <ButtonTitle>Pagamentos</ButtonTitle>
                </ButtonTitleWrapper>
              </ButtonWrapper>

              <ButtonWrapper>
                <ButtonHome
                  onPress={handleLearning}
                  style={{ backgroundColor: theme.colors.dark_inactive }}
                >
                  <ButtonIconIonicons name="ios-school" />
                </ButtonHome>
                <ButtonTitleWrapper>
                  <ButtonTitle>Aprenda</ButtonTitle>
                </ButtonTitleWrapper>
              </ButtonWrapper>

              <ButtonWrapper>
                <ButtonHome
                  onPress={handleProfile}
                  style={{ backgroundColor: theme.colors.dark_inactive }}
                >
                  <ButtonIconIonicons name="person-circle-outline" />
                </ButtonHome>
                <ButtonTitleWrapper>
                  <ButtonTitle>Minha conta</ButtonTitle>
                </ButtonTitleWrapper>
              </ButtonWrapper>
            </ButtonsRow>

            <ButtonsRow style={{justifyContent: "flex-start"}}>
              <ButtonWrapper>
                <ButtonHome
                  onPress={handleSupport}
                  style={{ backgroundColor: theme.colors.dark_inactive }}
                >
                  <ButtonIconIonicons name="ios-logo-whatsapp" />
                </ButtonHome>
                <ButtonTitleWrapper>
                  <ButtonTitle>Suporte</ButtonTitle>
                </ButtonTitleWrapper>
              </ButtonWrapper>

              {/* <ButtonWrapper>
                <ButtonHome
                  style={{ backgroundColor: theme.colors.dark_inactive }}
                >
                  <ButtonIconMaterialCommunity name="movie-edit" />
                </ButtonHome>
                <ButtonTitleWrapper>
                  <ButtonTitle>Projetos</ButtonTitle>
                </ButtonTitleWrapper>
              </ButtonWrapper>

              <ButtonWrapper>
                <ButtonHome
                  // onPress={handleButtonProjetos}
                  style={{ backgroundColor: theme.colors.dark_inactive }}
                >
                  <ButtonIconMaterialCommunity name="movie-check" />
                </ButtonHome>
                <ButtonTitleWrapper>
                  <ButtonTitle>Pedidos</ButtonTitle>
                </ButtonTitleWrapper>
              </ButtonWrapper> */}
            </ButtonsRow>
          </ButtonsContainer>
          <VectorMenuDown style={styles.vectorDown} />
        </Content>
      }
    </Container>
  );
}

const styles = StyleSheet.create({
  profileVector: {
    position: "absolute",
    zIndex: 0,
  },
  vectorDown: {
    marginTop: 70,
  },
});
