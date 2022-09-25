import React, { useState } from "react";
import MaskInput, { Masks } from "react-native-mask-input";
import {
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Alert,
  StatusBar,
  Switch,
  Text,
  Linking,
} from "react-native";

import { ProgressBar } from "../../Components/ProgressBar";
import { ButtonCustom } from "../../Components/ButtonCustom";

import NewLogo from "../../assets/logos/newLogo.svg";
import Check from "../../assets/icons/check.svg";
import CheckDisabled from "../../assets/frames/checkDisabled.svg";
import { BackButton } from "../../Components/BackButton";

import {
  Container,
  Header,
  HeaderWrapper,
  Content,
  ContentHeader,
  TitleWrapper,
  SubTitle,
  Title,
  TermContent,
} from "./styles";
import { PageInput } from "../../Components/PageInput";
import { MaskInputCustom } from "../../Components/MaskInputCustom";
import { useTheme } from "styled-components";
import api from "../../services/api";

export function Register({ navigation }) {
  const theme = useTheme();
  const NewLogoMargin = (Dimensions.get("window").width - 73) / 2;

  const [pageForm, setPageForm] = useState(1);
  const [progress, setProgress] = useState(25);
  const [passwordSecurity, setPasswordSecurity] = useState(true);

  const [emailAux, setEmailAux] = useState("");
  const [email, setEmail] = useState("");
  const [emailIsValid, setEmailIsValid] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneIsValid, setPhoneIsValid] = useState(false);
  const [passwordAux, setPasswordAux] = useState("");
  const [password, setPassword] = useState("");
  const [passwordIsValid, setPasswordIsValid] = useState(false);

  const [isTermAccepted, setIsTermAccepted] = useState(false);

  function handleBackButton() {
    if (pageForm === 1) {
      navigation.goBack();
    } else {
      if (pageForm === 4) {
        setPassword(passwordAux);
      }
      setPageForm(pageForm - 1);
      setProgress(progress - 25);
    }
  }

  function handleValidateEmail(email) {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(email) === false) {
      setEmailIsValid(false);
      return false;
    } else {
      setEmailIsValid(true);
      setEmailAux(email);
    }
  }

  function handleValidatePassword(password) {
    if (password.length < 6 || password.length > 20) {
      setPasswordIsValid(false);
      return false;
    } else {
      setPasswordIsValid(true);
      setPasswordAux(password);
    }
  }

  function handlePressContinue() {
    if (pageForm === 1) {
      setEmail(emailAux);
    }
    setPageForm(pageForm + 1);
    setProgress(progress + 25);
  }

  function handleFinishRegister() {
    setPassword(password);
    api
      .post(`register.php`, {
        email: email,
        name: name,
        password: passwordAux,
        phone: phone,
      })
      .then((response) => {
        if (
          response.data === "" ||
          response.data === null ||
          response.data === undefined
        ) {
          Alert.alert(`Algum erro desconhecido`);
        } else if (response.data.result[0].response === "Success") {
          console.log(`Cadastro realizado com sucesso`);
          navigation.navigate("Typ", {
            password: passwordAux,
            email: email,
          });
        } else {
          Alert.alert(`outro erro! -> ${response.data.result[0].response}`);
        }
      })
      .catch((error) => {
        console.log(`error -> ${error}`);
        console.log(`error.response -> ${error.message}`);
      });
  }

  return (
    <Container behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <StatusBar
        barStyle="light-content"
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

      <ProgressBar progress={`${progress}%`} />

      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {pageForm == 1 ? (
          <Content>
            <ContentHeader>
              <TitleWrapper>
                <SubTitle>Vamos começar</SubTitle>
                <Title>qual seu e-mail?</Title>
              </TitleWrapper>
              {emailIsValid ? (
                <Check width={25} height={25} />
              ) : (
                <CheckDisabled width={25} height={25} />
              )}
            </ContentHeader>
            <PageInput
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={(t) => handleValidateEmail(t)}
              placeholderTextColor={theme.colors.shape_inactive}
              placeholder={email ? email : "Digite aqui seu email"}
              // value={email ? email : null}
            />
            {/* {emailIsValid ? null : <SubTitle>Por favor digite um email válido</SubTitle>} */}
            {emailIsValid ? (
              <ButtonCustom onPress={handlePressContinue} text={"Avançar"} />
            ) : (
              <ButtonCustom
                text={"Avançar"}
                disabled={true}
                highlightColor={theme.colors.primary_light}
              />
            )}
          </Content>
        ) : pageForm === 2 ? (
          <Content>
            <ContentHeader>
              <TitleWrapper>
                <SubTitle>e o seu</SubTitle>
                <Title>nome completo?</Title>
              </TitleWrapper>
              {name ? (
                <Check width={25} height={25} />
              ) : (
                <CheckDisabled width={25} height={25} />
              )}
            </ContentHeader>
            <PageInput
              autoCapitalize="words"
              autoCorrect={false}
              onChangeText={setName}
              value={name}
              placeholder="Digite seu nome"
              placeholderTextColor={theme.colors.shape_inactive}
            />
            {name ? (
              <ButtonCustom onPress={handlePressContinue} text={"Avançar"} />
            ) : (
              <ButtonCustom
                text={"Avançar"}
                disabled={true}
                highlightColor={theme.colors.primary_light}
              />
            )}
          </Content>
        ) : pageForm === 3 ? (
          <Content>
            <ContentHeader>
              <TitleWrapper>
                <SubTitle>também precisamos do</SubTitle>
                <Title>seu telefone:</Title>
              </TitleWrapper>
              {phoneIsValid ? (
                <Check width={25} height={25} />
              ) : (
                <CheckDisabled width={25} height={25} />
              )}
            </ContentHeader>
            <MaskInputCustom
              keyboardType="phone-pad"
              value={phone}
              onChangeText={(masked, unmasked) => {
                if (masked.length === 14) {
                  setPhoneIsValid(true);
                }
                setPhone(masked);
              }}
              mask={Masks.BRL_PHONE}
              placeholderTextColor={theme.colors.shape_inactive}
            />
            {phoneIsValid ? (
              <ButtonCustom onPress={handlePressContinue} text={"Avançar"} />
            ) : (
              <ButtonCustom
                text={"Avançar"}
                disabled={true}
                highlightColor={theme.colors.primary_light}
              />
            )}
          </Content>
        ) : pageForm === 4 ? (
          <Content>
            <ContentHeader>
              <TitleWrapper>
                <SubTitle>para finalizar,</SubTitle>
                <Title>defina uma senha</Title>
              </TitleWrapper>
              <CheckDisabled width={25} height={25} />
            </ContentHeader>
            <PageInput
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={(t) => handleValidatePassword(t)}
              secureTextEntry={passwordSecurity}
              visibleButton={true}
              onVisibleButtonPress={() =>
                setPasswordSecurity(!passwordSecurity)
              }
              placeholder="Digite aqui sua senha"
              placeholderTextColor={theme.colors.shape_inactive}
              value={password ? password : null}
            />

            <TermContent>
              <Switch
                trackColor={{
                  false: theme.colors.inactive,
                  true: theme.colors.highlight,
                }}
                thumbColor={theme.colors.shape}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => setIsTermAccepted(!isTermAccepted)}
                value={isTermAccepted}
                style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
              />
              <SubTitle>
                Eu aceito os {' '}
                <Text
                  style={{
                    color: theme.colors.secondary,
                    textDecorationLine: "underline",
                  }}
                  onPress={() =>
                    Linking.openURL("http://onmovie.video/user_term.html")
                  }
                >
                  Termos de Uso e Privacidade
                </Text>
                {' '} da OnMovie!
              </SubTitle>
            </TermContent>
            {/* {emailIsValid ? null : <SubTitle>Por favor digite um email válido</SubTitle>} */}
            {passwordIsValid && isTermAccepted ? (
              <ButtonCustom
                onPress={handleFinishRegister}
                text={"Criar minha conta"}
              />
            ) : (
              <ButtonCustom
                text={"Criar minha conta"}
                disabled={true}
                highlightColor={theme.colors.primary_light}
              />
            )}
          </Content>
        ) : null}
      </TouchableWithoutFeedback>
    </Container>
  );
}
