import React from "react";

import VectorsFirstPageDown from "../../assets/frames/vectorsFirstPageDown.svg";
import VectorsFirstPageUp from "../../assets/frames/vectorsFirstPageUp.svg";

import {
  Container,
  Title,
  TitleHighlight,
  FooterTitleButton,
  FooterTitle,
} from "./styles";
import { ButtonCustom } from "../../Components/ButtonCustom";
import { Dimensions, StatusBar, StyleSheet } from "react-native";

export function FirstPage({navigation}) {
  
  function handlePressAlreadyClient() {
    navigation.navigate('Login');
  }

  function handlePressRegister() {
    navigation.navigate('Register');
  }

  return (
    <Container>
      <StatusBar
        barStyle='light-content'
        backgroundColor="transparent"
        translucent
      />
      <VectorsFirstPageUp width={Dimensions.get('window').width} style={styles.vectorsUp} />
      <Title>
        Encontre <TitleHighlight>editores</TitleHighlight>
        {"\n"}
        para suas {"\n"}
        ideias.
      </Title>
      <ButtonCustom
        style={{marginTop:50}}
        text={"Cadastrar agora"}
        onPress={handlePressRegister}
      />
      <FooterTitleButton onPress={handlePressAlreadyClient}>
        <FooterTitle>Já tenho uma conta!</FooterTitle>
      </FooterTitleButton>

      <VectorsFirstPageDown width={Dimensions.get('window').width} style={styles.vectorsDown} />
    </Container>
  );
}

const styles = StyleSheet.create({
  vectorsUp: {
    marginTop: -90,
  },
  vectorsDown: {
    marginTop: -10
  }
})
