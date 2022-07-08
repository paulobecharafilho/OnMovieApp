import React, { useEffect, useState } from "react";

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
import { Alert, Dimensions, StatusBar, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../services/api";
import { useRoute } from "@react-navigation/native";

interface Params {
  password: string
  email: string,
}

export function Typ({navigation}) {

  const route = useRoute();
  const {password, email } = route.params as Params;

  const [userId, setUserId] = useState(0);

  useEffect(() => {
    console.log(`email: ${email}, password: ${password}`)
    async function getUser() {
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
            const user_id = response.data.result[0].userId;
            setUserIdStorage(String(user_id));
            setUserId(user_id)
          } else {
            Alert.alert(`Senha incorreta`);
          }
        })
        .catch((error) => {
          console.log(`error -> ${error}`);
          console.log(`error.response -> ${error.message}`);
        });
    }
    getUser();
  }, [])

  async function setUserIdStorage(value) {
    try {
      await AsyncStorage.setItem('@onmovieapp:userId', value)
    } catch(e) {
      console.log(`Erro no SetUserIdStorage -> ${e}`)
    }
  
    console.log('Done.')
  }

  function handlePressContinue() {
    navigation.navigate('Home', {userId: userId});
  }


  return (
    <Container>
      <StatusBar
        barStyle='light-content'
        backgroundColor="transparent"
        translucent
      />
      <Title>
        Seja muito <TitleHighlight>bem-vindo(a)</TitleHighlight>. {'\n'}
        Agora você já pode usar nossos recursos!
      </Title>
      <ButtonCustom
        style={{marginTop:100}}
        text={"Fazer Login"}
        onPress={handlePressContinue}
      />

      <VectorsFirstPageDown width={Dimensions.get('window').width} style={styles.vectorsDown} />
    </Container>
  );
}

const styles = StyleSheet.create({

  vectorsDown: {
    position: "absolute",
    bottom: -80
  }
})
