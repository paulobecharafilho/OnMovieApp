import React, { useCallback, useEffect, useState } from "react";
import {
  Modal,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
} from "react-native";
import { useTheme } from "styled-components";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import {
  Container,
  Content,
  TitleRow,
  TitleWrapper,
  Title,
  Subtitle,
  IconButton,
} from "./styles";
import { NotificationsProps, ProjectProps } from "../../utils/Interfaces";
import { useFocusEffect } from "@react-navigation/native";
import { getNotifications } from '../../services/getNotifications';
import { NotificationsCard } from "../NotificationsCard";


interface NotificationsModalParams {
  userId: number;
  handleCloseNotificationModal: () => void;
}

export function NotificationsModal({
  userId, handleCloseNotificationModal
}: NotificationsModalParams) {
  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [notifications, setNotifications] = useState<NotificationsProps[]>([]);


  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(100).then(() => {
      setRefreshing(false);
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      getNotifications(userId)
      .then((result) => {
        if (result.result === 'Success') {
          setNotifications(result.notificacoes);
          setLoading(false);
        } else {
          console.log(`@NotificationsModal -> Erro no getNotifications -> ${JSON.stringify(result)}`);
          setLoading(false);
        }
      })
    }, [refreshing === true])
  )


  return (
    <Modal
      animationType="slide"
      transparent={true}
      // visible={sceneModalVisible}
      // onRequestClose={handleCloseSceneModal}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container style={styles(theme).fileModalView}>
          <TouchableOpacity
            style={styles(theme).modalCloseButton}
            onPress={handleCloseNotificationModal}
          >
            <MaterialCommunityIcons
              name="close"
              style={styles(theme).closeIcon}
            />
          </TouchableOpacity>

          <Content
            // behavior={Platform.OS === "ios" ? "padding" : "height"}
            // style={{ flex: 1 }}
          >
            <TitleRow>
              <TitleWrapper>
                <Title>Notificações</Title>
                {/* <Subtitle>Conte-nos como você quer sua cena</Subtitle> */}
              </TitleWrapper>
            </TitleRow>

           <FlatList 
            data={notifications}
            keyExtractor={(item) => String(item.id_notifica)}
            renderItem={({item}) => (
              <NotificationsCard 
                title={item.origem}
                message={item.descricao}
                icon='movie'
              />
            )}
           />
          
          </Content>
        </Container>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = (theme: any) =>
  StyleSheet.create({
    fileModalView: {
      position: "absolute",
      bottom: 0,
      height: "90%",
      width: "100%",
      paddingBottom: "20%",
      backgroundColor: theme.colors.shape,
      borderRadius: 50,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalCloseButton: {
      position: "absolute",
      top: 10,
      right: 20,
      padding: 10,
    },
    closeIcon: {
      fontFamily: theme.fonts.poppins_regular,
      fontSize: 30,
      color: theme.colors.text,
    },

    video: {
      flex: 3,
      alignSelf: "center",
      width: "90%",
    },
    buttons: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      flex: 1,
      fontFamily: theme.fonts.poppins_semi_bold,
      fontSize: 15,
      color: theme.colors.primary,
      marginTop: 60,
      marginLeft: 20,
    },
    image: {
      alignSelf: "center",
      width: "100%",
      height: "90%",
      resizeMode: "contain",
    },
    textInput: {
      flex: 2,
      width: "90%",
      alignSelf: "center",
      borderStyle: "solid",
      borderColor: theme.colors.primary,
      borderRadius: 10,
      marginTop: 5,
    },
    buttonsView: {
      flex: 2,
      flexDirection: "row",
      width: "80%",
      alignSelf: "center",
      alignItems: "center",
      justifyContent: "space-between",
    },
    editDescriptionButton: {
      paddingHorizontal: 15,
      paddingVertical: 15,
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primary,
    },
    AttachButton: {
      paddingHorizontal: 15,
      paddingVertical: 15,
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.highlight,
    },
    DetachButton: {
      paddingHorizontal: 15,
      paddingVertical: 15,
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.attention,
    },
    textButton: {
      fontFamily: theme.fonts.poppins_medium,
      fontSize: 13,
      color: theme.colors.shape,
      textAlign: "center",
    },
    fileContentView: {
      width: "100%",
      flex: 2,
      maxHeight: "80%",
      // backgroundColor: theme.colors.attention,
      alignItems: "center",
    },
    saveButton: {
      marginTop: 30,
      width: "70%",
      padding: 10,
      alignSelf: "center",
      borderRadius: 50,
      
    },
  });
