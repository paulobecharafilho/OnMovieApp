import { useFocusEffect, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Platform,
  Text,
  FlatList,
  KeyboardAvoidingView,
  View,
  StyleSheet,
  Keyboard,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
// import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { useTheme } from "styled-components";
import { BackButton } from "../../Components/BackButton";
import { getChat } from "../../services/getChat";
import { ChatProps, ProjectProps } from "../../utils/Interfaces";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import {
  Container,
  Header,
  HeaderWrapper,
  HeaderLogo,
  HeaderTitleWrapper,
  HeaderTitle,
  HeaderSubtitle,
  Content,
  ContentChat,
} from "./styles";
import { getBottomSpace } from "react-native-iphone-x-helper";
import api from "../../services/api";
import { ChatCard } from "../../Components/ChatCard";

interface Params {
  project: ProjectProps;
}

export function Chat({ navigation }) {
  const theme = useTheme();
  const route = useRoute();

  const params = route.params as Params;

  const [messages, setMessages] = useState<ChatProps[]>([]);
  const [messageToSend, setMessageToSend] = useState("");

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [keyboardHeight, setKeyboardHeight] = useState(getBottomSpace());

  const yourRef = useRef(null);

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(100).then(() => {
      setRefreshing(false);
    });
  }, []);

  async function getChatFromProject2() {
    await getChat(params.project.id_proj).then((response) => {
      if (response.result === "Success") {
        if (response.chats) {
          if (response.chats.length > 0) {
            setMessages(response.chats);
          }
        }
      }
    });
    
    setLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      async function getChatFromProject() {
        await getChat(params.project.id_proj).then((response) => {
          if (response.result === "Success") {
            if (response.chats) {
              if (response.chats.length > 0) {
                setMessages(response.chats);
              }
            }
          }
        });
        
        setLoading(false);
      }

      getChatFromProject();
    }, [refreshing])
  );

  useEffect(() => {
    const interval = setInterval(() => {
      getChatFromProject2();
    }, 10000);

    // return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, []);

  async function onSendMessage() {
    await api
      .post(`api_chat/sendmessage.php`, {
        nome: params.project.nome_proj,
        mensagem: messageToSend,
        idUser: params.project.id_usuario,
        idEdit: params.project.id_editor,
        idPed: params.project.id_proj,
      })
      .then((response) => {
        // console.log(`@Chat - OnSendMessage Response -> ${JSON.stringify(response.data)}`)
        if (response.data.response === "Success") {
          setMessageToSend("");
          Keyboard.dismiss();
          onRefresh();
        }
      })
      .catch((err) => Alert.alert(`Erro -> ${err}`));
  }

  return (
    <Container>
      <Header>
        <HeaderWrapper>
          <BackButton onPress={() => navigation.goBack()} />
          <HeaderTitleWrapper>
            <HeaderTitle>
              Chat com editor do projeto: {params.project.id_proj}
            </HeaderTitle>
            <HeaderSubtitle>{params.project.nome_proj}</HeaderSubtitle>
          </HeaderTitleWrapper>
          <HeaderLogo />
        </HeaderWrapper>
      </Header>

      {!loading ? (
        // <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Content behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <ContentChat>
            {messages.length > 0 ? (
              <FlatList
                data={messages}
                keyExtractor={(item: ChatProps) => item.id_msg}
                renderItem={({ item }) => (
                  <ChatCard message={item} project={params.project} />
                )}
                showsVerticalScrollIndicator={false}
                ref={yourRef}
                onContentSizeChange={() => yourRef.current.scrollToEnd()}
                onLayout={() => yourRef.current.scrollToEnd()}
              />
            ) : (
              <Text>Nenhuma Mensagem</Text>
            )}
          </ContentChat>

          <View style={[styles.contentInput, { bottom: keyboardHeight }]}>
            <TextInput
              value={messageToSend}
              placeholder="Digite aqui sua mensagem"
              style={[
                styles.messageInput,
                { borderColor: theme.colors.primary },
              ]}
              onChangeText={setMessageToSend}
              multiline
              autoCapitalize="sentences"
              autoCorrect
              maxLength={1200}
            />
            <TouchableOpacity
              style={styles.messageSendButton}
              onPress={onSendMessage}
            >
              <MaterialCommunityIcons
                name="send-circle"
                style={[styles.messageIcon, { color: theme.colors.primary }]}
              />
            </TouchableOpacity>
          </View>
        </Content>
      ) : (
        // </TouchableWithoutFeedback>
        <Text>Nenhuma Mensagem</Text>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  contentInput: {
    marginTop: 20,
    width: "90%",
    // position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    alignSelf: "center",
  },
  messageInput: {
    flex: 5,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 5,
    maxHeight: 100,
  },
  messageSendButton: {
    padding: 10,
    paddingBottom: 0,
    alignContent: "center",
    justifyContent: "center",
  },
  messageIcon: {
    fontSize: 35,
  },
});
