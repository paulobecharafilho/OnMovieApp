import { useFocusEffect, useRoute } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Keyboard,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { Masks } from "react-native-mask-input";
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from "styled-components";
import { BackButton } from "../../Components/BackButton";
import { ButtonCustom } from "../../Components/ButtonCustom";
import { MaskInputCustom } from "../../Components/MaskInputCustom";
import { PasswordModal } from "../../Components/PasswordModal";
import { TextInputCustom } from "../../Components/TextInputCustom";
import { UserDTO } from "../../dtos/UserDTO";
import api from "../../services/api";

import {
  Container,
  Header,
  HeaderWrapper,
  HeaderTitleWrapper,
  HeaderTitle,
  HeaderSubtitle,
  HeaderLogo,
  Content,
  UserInfo,
  TitleWrapper,
  Title,
  Subtitle,
  ButtonsContent,
} from "./styles";

interface Params {
  user: UserDTO;
}

export function MyAccount({ navigation }) {
  const theme = useTheme();
  const route = useRoute();

  const { user } = route.params as Params;

  const [editable, setEditable] = useState(false);

  const [name, setName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneIsValid, setPhoneIsValid] = useState(false);

  const [passwordModalVisible, setPassowrdModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setPhone(user.fone);
      setName(user.nome);
    }, [])
  );

  function handleSaveUserInfo() {
    api
    .post(`proc_update_user_info.php?userId=${user.id_user}`, 
    {
      name: name,
      phone: phone,
    })
    .then((response) => {
      if (response.data.response === 'Success') {
        Alert.alert(`Alterada com sucesso`, `As informações foram alteradas com sucesso!`);
        navigation.navigate(`Home`);
      }
    })
    .catch((err) => {
      Alert.alert(`Erro`, `Houve um problema ao salvar as informações: ${err}`)
    })
    setEditable(false);
  }

  function handleChangePassword() {
    if (newPassword.length < 6) {
      Alert.alert(
        `Senha muito fraca`,
        `Por favor crie uma senha acima de 6 dígitos`
      );
    } else if (newPassword != newPasswordConfirmation) {
      Alert.alert(
        `Senhas diferentes`,
        `A nova senha não é a mesma da confirmação. Por favor digite as senhas iguais`
      );
    } else {
      api
        .post(`proc_alterar_senha.php?userId=${user.id_user}`, {
          newPassword: newPassword,
          oldPassword: oldPassword,
        })
        .then((response) => {
          console.log(`@MyAccount - Change Password Response -> ${JSON.stringify(response.data)}`)
          if (response.data.response === "Senha Incorreta") {
            Alert.alert(
              `Senha incorreta`,
              `A senha atual informada não está correta.`
            );
          } else if (response.data.response === "Success") {

            Alert.alert(`Senha alterada com Sucesso`);

            handleClosePasswordModal();
          }
        });
    }
  }

  function handleClosePasswordModal() {
    setPassowrdModalVisible(false);
  }

  return (
    <Container>
      <Header>
        <HeaderWrapper>
          <BackButton onPress={() => navigation.goBack()} />
          <HeaderTitleWrapper>
            <HeaderTitle>Minha Conta</HeaderTitle>
            <HeaderSubtitle></HeaderSubtitle>
          </HeaderTitleWrapper>
          <HeaderLogo />
        </HeaderWrapper>
      </Header>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Content>
          <UserInfo>
            <TitleWrapper>
              <Title>Id do Usuário</Title>
              <Subtitle>{user.id_user}</Subtitle>
            </TitleWrapper>

            <TitleWrapper>
              <Title>Email</Title>
              <Subtitle>{user.email}</Subtitle>
              <Subtitle style={{color: theme.colors.text_highlight, fontSize: RFValue(11)}}>
                Obs: Se precisar alterar o email, por favor entre em contato com
                nosso suporte
              </Subtitle>
            </TitleWrapper>

            <TitleWrapper>
              <Title>Nome</Title>
              <TextInputCustom 
                text={name}
                editable={editable}
                customTextColor={editable ? theme.colors.shape : theme.colors.shape_inactive}
                onChangeText={setName}  
              />
                
            </TitleWrapper>

            <TitleWrapper>
              <Title>Telefone</Title>
              <MaskInputCustom
                style={{
                  fontSize: 15,
                  width: "100%",
                  height: 50,
                  marginTop: 40,
                  paddingLeft: 15,
                  borderRadius: 10,
                  backgroundColor: theme.colors.inactive,
                }}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={(masked, unmasked) => {
                  if (masked.length === 14) {
                    setPhoneIsValid(true);
                  }
                  setPhone(masked);
                }}
                mask={Masks.BRL_PHONE}
                editable={editable}
              />
            </TitleWrapper>
          </UserInfo>

          <ButtonsContent>
            <ButtonCustom
              text={editable ? "Salvar" : "Habilitar edição"}
              highlightColor={theme.colors.shape}
              style={{
                backgroundColor: theme.colors.secondary,
                marginTop: 30,
                alignSelf: "center",
              }}
              onPress={editable ? handleSaveUserInfo : () => setEditable(true)}
            />

            <ButtonCustom
              text="Alterar Senha"
              style={{
                backgroundColor: theme.colors.shape,
                marginTop: 30,
                alignSelf: "center",
              }}
              onPress={() => setPassowrdModalVisible(true)}
            />
          </ButtonsContent>
        </Content>
      </TouchableWithoutFeedback>

      {/* Iniciando Password Modal */}
      {passwordModalVisible ? (
        <PasswordModal
          handleCloseSceneModal={handleClosePasswordModal}
          passwordModalVisible={passwordModalVisible}
          handleChangePassword={handleChangePassword}
          user={user}
          setOldPassword={setOldPassword}
          setNewPassword={setNewPassword}
          setNewPasswordConfirmation={setNewPasswordConfirmation}
        />
      ) : null}
    </Container>
  );
}
