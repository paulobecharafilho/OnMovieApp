import React, { useRef, useState } from "react";
import { Platform, StatusBar, StyleSheet } from "react-native";
import "react-native-url-polyfill/auto";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  Alert,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
  Text,
} from "react-native";

import NewLogo from "../../assets/logos/newLogo.svg";
import VectorsLoginUp from "../../assets/frames/vectorsLoginUp.svg";
import VectorsLoginDown from "../../assets/frames/vectorsLoginDown.svg";

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
  TextWrapper,
  TextRemove,
  InputWrapper,
} from "./styles";
import { InputForm } from "../../Components/InputForm";
import { useForm } from "react-hook-form";
import { useTheme } from "styled-components";
import { UserDTO } from "../../dtos/UserDTO";
import { useRoute } from "@react-navigation/native";
import { updateUserPushToken } from "../../services/updateUserPushToken";

interface FormData {
  password: string;
}

interface Params {
  user: UserDTO
}

const schema = Yup.object().shape({
  password: Yup.string().min(6).max(32).required(),
});

export function RemoveAccount({ navigation }) {
  const NewLogoMargin = (Dimensions.get("window").width - 73) / 2;
  const theme = useTheme();
  const route = useRoute();

  const params = route.params as Params;


  const [passwordSecurity, setPasswordSecurity] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  function handleBackButton() {
    navigation.goBack();
  }

  function handleChangleVisiblePassword() {
    setPasswordSecurity(!passwordSecurity);
  }

  async function alertRemoveAccount(form: FormData) {

    Alert.alert(`Excluir sua conta?`,
    `Você tem certeza que deseja remover sua conta? Ao remover, todos os seus arquivos e histórico serão excluídos.`,
    [
      {
        text: "Voltar",
        style: "cancel",
      },
      {
        text: "Remover Minha Conta",
        onPress: () => handleRemoveAccount(form),
        style:"destructive",
      }
    ]
    )
  }

  async function handleRemoveAccount(form: FormData) {
    removeAccount(form);
  }

  async function removeAccount({ password }: FormData) {
    await api.post(`proc_remover_conta.php?userId=${params.user.id_user}`,
    {
      password: password
    })
    .then((response) => {
      if (response.data.response === 'Success') {
        Alert.alert(`Email Enviado!`, `Enviamos um email para você com o link para remoção total da sua conta.`,
        [
          {
            text: "Ok. Entendido",
            onPress: () => handleLogout(),
            style: "cancel"
          }
        ])
      } else if(response.data.response === 'Senha Incorreta') {
        Alert.alert(`Senha Incorreta`, `Por favor digite novamente sua senha.`)
      } else {
        Alert.alert(`Erro`,`Algum erro aconteceu ao deletar sua conta. Por favor entre em contato com nossa equipe de suporte.`);
        console.log(`Erro -> ${response.data.response}`)
      }
    })
    .catch((err) => {Alert.alert(`Erro ao deletar conta`, `O erro ${err} aconteceu ao deletar sua conta. Por favor entre em contato com nosso suporte.`)})
  }

  async function handleLogout() {
    try {
      let atualToken = await AsyncStorage.getItem(`@onmovieapp:push_token`);
      let userTokens:string[] = JSON.parse(params.user.push_token);
      let newAllTokens = userTokens.filter(element => element != atualToken);
      console.log(`BeforeTokens -> ${userTokens}, AtualToken -> ${atualToken} e newAllTokens -> ${newAllTokens}`);

      await updateUserPushToken(params.user.id_user, newAllTokens)
      .then(async (result) => {
        if (result.result === 'Success') {
          console.log(`token removido com sucesso!`)
          await AsyncStorage.removeItem("@onmovieapp:userId");
          navigation.navigate("FirstPage");
        }
      }).catch((err) => console.log(`Erro no catch do updateUserToken -> ${err}`))


    } catch (e) {
      navigation.navigate("FirstPage");
      console.log(`Erro ao remover Async -> ${e}`);
    }
  }

  return (
    <Container>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <VectorsLoginUp style={styles.vectorUp} />
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
            <Title>Remover</Title>
            <SubTitle>sua conta?</SubTitle>
          </TitleWrapper>

          <TextWrapper>
            <TextRemove>
              É uma pena ver você ir embora. {'\n'}
              Mas se você realmente deseja
              excluir sua conta, {'\n'}
              <Text style={{color: theme.colors.secondary}}>
                por favor digite sua senha abaixo.
              </Text>
            </TextRemove>
          </TextWrapper>

          <InputWrapper>
            {/* <InputForm
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
              customTextColor={theme.colors.shape}
            /> */}
            <InputForm
              name="password"
              control={control}
              error={errors.password && errors.password.message}
              text="Senha"
              icon="lock"
              secureTextEntry={passwordSecurity}
              visibleButton={true}
              onVisibleButtonPress={() => handleChangleVisiblePassword()}
              onSubmitEditing={handleSubmit(alertRemoveAccount)}
              customTextColor={theme.colors.shape}
            />
          </InputWrapper>

          <ButtonCustom
            text={"Remover Conta"}
            onPress={handleSubmit(alertRemoveAccount)}
            style={{ marginTop: 45, backgroundColor: theme.colors.attention }}
            highlightColor={theme.colors.shape}
          />

          {/* <FooterTitleButton onPress={handleForgotPassword}>
            <FooterTitle>ihh, esqueci minha senha</FooterTitle>
          </FooterTitleButton> */}
        </Content>
      </TouchableWithoutFeedback>
      <VectorsLoginDown
        width={Dimensions.get("window").width + 300}
        style={styles.vectorsDown}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  vectorUp: {
    position: "absolute",
    zIndex: 0,
  },
  vectorsDown: {
    position: "absolute",
    bottom: -100,
    alignSelf: "center",
    zIndex: 0,
  },
});
