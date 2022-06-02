import React, { useState } from "react";
import { Dimensions } from "react-native";

import NewLogo from "../../assets/logos/newLogo.svg";
import { BackButton } from "../../Components/BackButton";
import { TextInputCustom } from "../../Components/TextInputCustom";

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
  FooterTitle,
} from "./styles";

export function Login({ navigation }) {
  const NewLogoMargin = (Dimensions.get("window").width - 73) / 2;

  const [email, setEmail] = useState("");

  function handleBackButton() {
    navigation.goBack();
  }

  function handleChangeEmailText(text) {
    setEmail(text);
    console.log(`Changing Email Text --> ${email}`);
  }

  return (
    <Container>
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

      <Content>
        <TitleWrapper>
          <Shape />
          <Title>Bem-vindo</Title>
          <SubTitle>de volta</SubTitle>
        </TitleWrapper>

        <InputWrapper>
          <TextInputCustom
            text="E-mail"
            icon="email"
            onChangeText={(text) => handleChangeEmailText(text)}
          />
        </InputWrapper>
      </Content>
    </Container>
  );
}
