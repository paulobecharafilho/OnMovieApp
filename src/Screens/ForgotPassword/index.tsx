import React, { useState } from 'react';
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  Alert,
  Dimensions,
  Keyboard,
  StatusBar,
  TouchableWithoutFeedback,
} from "react-native";

import NewLogo from "../../assets/logos/newLogo.svg";
import api from "../../services/api";

import {
  Container,
  Header,
  HeaderWrapper,
  Content,
  TitleWrapper,
  Title,
  SubTitle,
  InputWrapper,
  ForgotButton,
  ButtonTitle,
  FooterTitleButton,
  FooterTitle,
} from './styles';
import { useForm } from 'react-hook-form';
import { InputForm } from '../../Components/InputForm';
import { BackButton } from '../../Components/BackButton';

interface FormData {
  email: string
}

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Por favor utilize um email válido")
    .required("Email é obrigatório")
});

export function ForgotPassword({navigation}) {
  const NewLogoMargin = (Dimensions.get("window").width - 73) / 2;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  function handleComeBackToLogin() {
    navigation.navigate('Login')
  }
  
  function handleBackButton() {
    navigation.goBack();
  }

  async function handlePressRecoveryButton(form: FormData) {
    recoverPassword(form);
  }

  async function recoverPassword({ email }: FormData) {
    api
      .post(`recoverpassword.php`, {
        email: email,
      })
      .then((response) => {
        if (
          response.data === "" ||
          response.data === null ||
          response.data === undefined
        ) {
          Alert.alert(`Nenhum response.data`);
        } else if (response.data.result[0].response === "Success") {
          Alert.alert(
            "Enviado com Sucesso",
            "Por favor, confira seu email para recuperar a senha",
            [{
              text: 'Ok',
              onPress: ()=> navigation.navigate('Login'),
              style: 'default'
            }]
          )
        } else {
          Alert.alert(
            'Erro!',
            `${response.data.result[0].response}`
          );
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
        <Content>
          <TitleWrapper>
            <Title>Vamos recuperar sua senha</Title>
            <SubTitle>Por favor digite seu email.</SubTitle>
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
              onSubmitEditing={handleSubmit(handlePressRecoveryButton)}
            />
          </InputWrapper>

          <ForgotButton
            onPress={handleSubmit(handlePressRecoveryButton)}
            style={{ marginTop: 45 }}
          >
            <ButtonTitle>Recuperar Senha</ButtonTitle>
          </ForgotButton>

          <FooterTitleButton onPress={handleComeBackToLogin}>
            <FooterTitle>Voltar para Login</FooterTitle>
          </FooterTitleButton>
        </Content>
      </TouchableWithoutFeedback>
    </Container>
  );
}