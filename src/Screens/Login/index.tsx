import React, { useRef, useState } from "react";
import { Platform, StatusBar, StyleSheet } from "react-native";
import "react-native-url-polyfill/auto";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  Alert,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";

import NewLogo from "../../assets/logos/newLogo.svg";
import VectorsLoginUp from '../../assets/frames/vectorsLoginUp.svg';
import VectorsLoginDown from '../../assets/frames/vectorsLoginDown.svg';

import { BackButton } from "../../Components/BackButton";
import { ButtonCustom } from "../../Components/ButtonCustom";
import api from "../../services/api";

import {
  Container,
  Header,
  HeaderWrapper,
  Content,
  TitleWrapper,
  Shape,
  Title,
  SubTitle,
  InputWrapper,
  FooterTitleButton,
  FooterTitle,
} from "./styles";
import { InputForm } from "../../Components/InputForm";
import { useForm } from "react-hook-form";

interface FormData {
  email: string;
  password: string;
}

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Por favor utilize um email válido")
    .required("Email é obrigatório"),
  password: Yup.string().min(6).max(32).required(),
});

export function Login({ navigation }) {
  const NewLogoMargin = (Dimensions.get("window").width - 73) / 2;

  const [passwordSecurity, setPasswordSecurity] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  async function setUserIdStorage(value) {
    try {
      await AsyncStorage.setItem('@onmovieapp:userId', value)
    } catch(e) {
      console.log(`Erro no SetUserIdStorage -> ${e}`)
    }
  
    console.log('Done.')
  }

  function handleBackButton() {
    navigation.goBack();
  }

  function handleChangleVisiblePassword() {
    setPasswordSecurity(!passwordSecurity);
  }

  function handleForgotPassword() {
    navigation.navigate('ForgotPassword');
  }

  async function handlePressLoginButton(form: FormData) {
    loginWithEmailAndPassword(form);
  }

  async function loginWithEmailAndPassword({ email, password }: FormData) {
    api
      .post(`login.php`, {
        email: email,
        password: password,
      })
      .then((response) => {
        if (
          response.data === "" ||
          response.data === null ||
          response.data === undefined
        ) {
          Alert.alert(`Usuário não encontrado`);
        } else if (response.data.result[0].response === "Success") {
          const userId = response.data.result[0].userId;
          setUserIdStorage(String(userId));
          navigation.navigate('Home', {userId: userId})
        } else {
          Alert.alert(`Senha incorreta`);
        }
      })
      .catch((error) => {
        console.log(`error -> ${error}`);
        console.log(`error.response -> ${error.message}`);
      });
  }

  return (
    <Container>
      <StatusBar
        barStyle='light-content'
        backgroundColor="transparent"
        translucent
      />
      <VectorsLoginUp style={styles.vectorUp}/>
      <Header>
        <HeaderWrapper>
          <BackButton onPress={handleBackButton} />
          <NewLogo
            width={73}
            height={36}
            style={{ position: "absolute", marginHorizontal: NewLogoMargin }}
          />
        </HeaderWrapper>
      </Header>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Content behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <TitleWrapper>
            <Shape />
            <Title>Bem-vindo</Title>
            <SubTitle>de volta</SubTitle>
          </TitleWrapper>

          <InputWrapper>
            <InputForm
              name="email"
              control={control}
              error={errors.email && errors.email.message}
              text="E-mail"
              icon="email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={false}
              returnKeyType="next"
            />
            <InputForm
              name="password"
              control={control}
              error={errors.password && errors.password.message}
              text="Senha"
              icon="lock"
              secureTextEntry={passwordSecurity}
              visibleButton={true}
              onVisibleButtonPress={() => handleChangleVisiblePassword()}
              onSubmitEditing={handleSubmit(handlePressLoginButton)}
            />
          </InputWrapper>

          <ButtonCustom
            text={"Entrar"}
            onPress={handleSubmit(handlePressLoginButton)}
            style={{ marginTop: 45 }}
          />

          <FooterTitleButton onPress={handleForgotPassword}>
            <FooterTitle>ihh, esqueci minha senha</FooterTitle>
          </FooterTitleButton>
        </Content>
      </TouchableWithoutFeedback>
      <VectorsLoginDown width={Dimensions.get("window").width + 300} style={styles.vectorsDown} />
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
    bottom: -100,
    alignSelf: "center",
    zIndex: 0,
  },
});
