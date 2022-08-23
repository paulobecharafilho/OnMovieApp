import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { useFocusEffect, useRoute } from "@react-navigation/native";

import { BackButton } from "../../Components/BackButton";

import NewLogo from "../../assets/logos/newLogo.svg";
import AddIconSvg from "../../assets/icons/AddIcon.svg";

interface ProjectProps extends ProjectDTO {
  new_satus_proj: string;
  highlightColor: string;
}

import {
  Container,
  Header,
  HeaderWrapper,
  Content,
  ContentHeader,
  StatusFlatList,
  StatusView,
  StatusText,
  StatusLine,
  TitleWrapper,
  Title,
  SubTitle,
  IconButton,
  ContentBody,
  ProjectsListView,
  ProjectsList,
  NoneProject,
} from "./styles";
import { ProjectDTO } from "../../dtos/ProjectDTO";
import { ProjectListCard } from "../../Components/ProjectListCard";
import { useTheme } from "styled-components";
import api from "../../services/api";
import { getProjects } from "../../services/getProjects";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

interface ProjectProps extends ProjectDTO {
  newStatusProj: string;
  highlightColor: string;
}
interface Params {
  projects?: ProjectProps[];
  userId: number;
}

export function MyProjects({ navigation }) {
  const theme = useTheme();
  const NewLogoMargin = (Dimensions.get("window").width - 73) / 2;

  const route = useRoute();
  const { projects, userId } = route.params as Params;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(100).then(() => setRefreshing(false));
  }, []);

  const statusList = [
    "Todos",
    "Fila",
    "Edição",
    "Aprovação",
    "Finalizado",
  ];
  const [statusSelected, setStatusSelected] = useState("Todos");

  const [noneProjects, setNoneProjects] = useState(true);
  const [ProjectsInCreation, setProjectsInCreation] = useState<ProjectProps[]>([]);
  

  useFocusEffect(
    useCallback(() => {
      async function fetchProjects() {
        await getProjects(userId, theme)
          .then((result) => {
            if (result.result === "Success") {
              if (result.pedidos.length === 0) {
                setNoneProjects(true);
              } else {
                setNoneProjects(false);
                setProjectsInCreation(result.projectsInCreation);
              }
              setLoading(false);
            } else {
              console.log(`erro no if do result -> ${result.result}`);
            }
          })
          .catch((error) => {
            Alert.alert(
              `Não foi possível carregar os pedidos -> Erro: ${error}`
            );
          });
      }

      fetchProjects();
    }, [navigation, refreshing === true])
  );
 
  function handleChangeStatus(status) {
    setStatusSelected(status);
  }

  function handleNewProject() {
    navigation.navigate('NewProject', { userId: userId })
  }

  function handleGoToProjectDetails(project: ProjectProps) {
    navigation.navigate(`ProjectDetails`, {
      project: project,
      userId: userId
    })
  }

  function ProjectsInCreationScreen() {
    return (
      <ProjectsList
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        data={ProjectsInCreation}
        showsVerticalScrollIndicator={false}
        keyExtractor={(e: ProjectProps) => e.id_proj}
        renderItem={({ item }) => {
          return <ProjectListCard onPress={() => handleGoToProjectDetails(item)} project={item} />;
        }}
      />
    );
  }

  function handleBackButton() {
    navigation.goBack();
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
        <ContentHeader>
          <TitleWrapper>
            <Title>Minhas Criações</Title>
            <SubTitle>veja todos os seus projetos em criação!</SubTitle>
          </TitleWrapper>
          {/* <Icon name="add-circle" /> */}
          <IconButton onPress={handleNewProject}>
            <AddIconSvg width={35} height={35} />
          </IconButton>
        </ContentHeader>

        <ContentBody>
          <ProjectsListView>
            {loading ? (
              <ActivityIndicator
                style={{ alignSelf: "center" }}
                color={theme.colors.shape}
              />
            ) : noneProjects ? (
              <NoneProject>Você ainda não possui nenhum projeto</NoneProject>
            ) : <ProjectsInCreationScreen /> 
            }
          </ProjectsListView>
        </ContentBody>
      </Content>
    </Container>
  );
}
