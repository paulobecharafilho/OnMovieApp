import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  RefreshControl,
  Text,
} from "react-native";
import { NavigationContainer, useRoute } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

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
  // Icon,
  ContentBody,
  ProjectsListView,
  ProjectsList,
  NoneProject,
} from "./styles";
import { ProjectDTO } from "../../dtos/ProjectDTO";
import api from "../../services/api";
import { ProjectListCard } from "../../Components/ProjectListCard";
import { useTheme } from "styled-components";
import AsyncStorage from "@react-native-async-storage/async-storage";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

interface Params {
  userId: number;
}

export function MyProjects({ navigation }) {
  const theme = useTheme();
  const NewLogoMargin = (Dimensions.get("window").width - 73) / 2;

  const route = useRoute();
  const userIdParams = route.params as Params;

  const [userId, setUserId] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const statusList = [
    "Todos",
    "Criação",
    "Fila",
    "Edição",
    "Aprovação",
    "Correção",
    "Finalizado",
  ];
  const [statusSelected, setStatusSelected] = useState("Todos");

  const [noneProjects, setNoneProjects] = useState(true);
  const [projectsAll, setProjectsAll] = useState<ProjectProps[]>([]);
  const [projectsRascunho, setProjectsRascunho] = useState<ProjectProps[]>([]);
  const [projectsNaFila, setProjectsNaFila] = useState<ProjectProps[]>([]);
  const [projectsEmEdicao, setProjectsEmEdicao] = useState<ProjectProps[]>([]);
  const [projectsEmAprovacao, setProjectsEmAprovacao] = useState<
    ProjectProps[]
  >([]);
  const [projectsEmCorrecao, setProjectsEmCorrecao] = useState<ProjectProps[]>(
    []
  );
  const [projectsAprovados, setProjectsAprovados] = useState<ProjectProps[]>(
    []
  );

  useEffect(() => {
    async function fetchProjects() {
      const user_id = await AsyncStorage.getItem("@onmovieapp:userId");

      api
        .get(`list_projects_all.php?userId=${user_id}`)
        .then((response) => {
          if (
            response.data.response === "" ||
            response.data.response === null ||
            response.data.response === undefined
          ) {
            Alert.alert(`Erro -> Usuário não encontrado`);
          } else if (response.data.response === "Success") {
            setProjectsAll([]);
            setProjectsRascunho([]);
            setProjectsNaFila([]);
            setProjectsEmEdicao([]);
            setProjectsEmAprovacao([]);
            setProjectsEmCorrecao([]);
            setProjectsAprovados([]);
            setProjectsAll(response.data.projetos);

            response.data.projetos.forEach((element) => {
              switch (element.status_proj) {
                case "Rascunho":
                  element.new_satus_proj = "Criação";
                  element.highlightColor = theme.colors.text;
                  setProjectsRascunho((oldArray) => [...oldArray, element]);
                  break;

                case "Na Fila":
                  element.new_satus_proj = "Fila";
                  element.highlightColor = theme.colors.highlight;
                  setProjectsNaFila((oldArray) => [...oldArray, element]);
                  break;

                case "em edicao":
                  element.new_satus_proj = "Edição";
                  element.highlightColor = theme.colors.secondary;
                  setProjectsEmEdicao((oldArray) => [...oldArray, element]);
                  break;

                case "Em edicao":
                  element.new_satus_proj = "Edição";
                  element.highlightColor = theme.colors.secondary;
                  setProjectsEmEdicao((oldArray) => [...oldArray, element]);
                  break;

                case "controle":
                  element.new_satus_proj = "Edição";
                  element.highlightColor = theme.colors.secondary;
                  setProjectsEmEdicao((oldArray) => [...oldArray, element]);
                  break;

                case "correcao_controle":
                  element.new_satus_proj = "Edição";
                  element.highlightColor = theme.colors.secondary;
                  setProjectsEmEdicao((oldArray) => [...oldArray, element]);
                  break;

                case "em correcao":
                  element.new_satus_proj = "Correção";
                  element.highlightColor = theme.colors.highlight_pink;
                  setProjectsEmCorrecao((oldArray) => [...oldArray, element]);
                  break;

                case "em aprovacao":
                  element.new_satus_proj = "Aprovação";
                  element.highlightColor = theme.colors.attention;
                  setProjectsEmAprovacao((oldArray) => [...oldArray, element]);
                  break;

                case "Em aprovacao":
                  element.new_satus_proj = "Aprovação";
                  element.highlightColor = theme.colors.attention;
                  setProjectsEmAprovacao((oldArray) => [...oldArray, element]);
                  break;

                case "Aprovado":
                  element.new_satus_proj = "Finalizado";
                  element.highlightColor = theme.colors.success;
                  setProjectsAprovados((oldArray) => [...oldArray, element]);
                  break;

                default:
                  console.log(
                    `Projeto id ${element.id_proj} com status ${element.status_proj} não ficou em nenhuma categoria`
                  );
              }
            });

            setNoneProjects(false);
            setLoading(false);
          } else {
            setLoading(false);
            setNoneProjects(true);
            // Alert.alert(`Erro -> ${response.data.response}`);
          }
        })
        .catch((error) => {
          console.log(`error -> ${error}`);
        });
    }
    fetchProjects();
  }, [refreshing]);

  function handleChangeStatus(status) {
    setStatusSelected(status);
  }

  function ProjectsAllScreen() {
    return (
      <ProjectsList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={projectsAll}
        showsVerticalScrollIndicator={false}
        keyExtractor={(e: ProjectProps) => e.id_proj}
        renderItem={({ item }) => {
          return <ProjectListCard project={item} />;
        }}
      />
    );
  }

  function ProjectsRascunhoScreen() {
    return (
      <ProjectsList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={projectsRascunho}
        showsVerticalScrollIndicator={false}
        keyExtractor={(e: ProjectProps) => e.id_proj}
        renderItem={({ item }) => {
          return <ProjectListCard project={item} />;
        }}
      />
    );
  }

  function ProjectsNaFilaScreen() {
    return (
      <ProjectsList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={projectsNaFila}
        showsVerticalScrollIndicator={false}
        keyExtractor={(e: ProjectProps) => e.id_proj}
        renderItem={({ item }) => {
          return <ProjectListCard project={item} />;
        }}
      />
    );
  }

  function ProjectsEmEdicaoScreen() {
    return (
      <ProjectsList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={projectsEmEdicao}
        showsVerticalScrollIndicator={false}
        keyExtractor={(e: ProjectProps) => e.id_proj}
        renderItem={({ item }) => {
          return <ProjectListCard project={item} />;
        }}
      />
    );
  }

  function ProjectsEmCorrecaoScreen() {
    return (
      <ProjectsList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={projectsEmCorrecao}
        showsVerticalScrollIndicator={false}
        keyExtractor={(e: ProjectProps) => e.id_proj}
        renderItem={({ item }) => {
          return <ProjectListCard project={item} />;
        }}
      />
    );
  }

  function ProjectsEmAprovacaoScreen() {
    return (
      <ProjectsList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={projectsEmAprovacao}
        showsVerticalScrollIndicator={false}
        keyExtractor={(e: ProjectProps) => e.id_proj}
        renderItem={({ item }) => {
          return <ProjectListCard project={item} />;
        }}
      />
    );
  }

  function ProjectsAprovadosScreen() {
    return (
      <ProjectsList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={projectsAprovados}
        showsVerticalScrollIndicator={false}
        keyExtractor={(e: ProjectProps) => e.id_proj}
        renderItem={({ item }) => {
          return <ProjectListCard project={item} />;
        }}
      />
    );
  }

  function handleBackButton() {
    navigation.goBack();
  }

  return (
    <Container
      colors={[
        theme.colors.background_gradient_01,
        theme.colors.background_gradient_02,
      ]}
      start={[0, 0.4]}
      end={[0, 1]}
    >
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
            <Title>Meus Projetos</Title>
            <SubTitle>veja todos os seus projetos por status!</SubTitle>
          </TitleWrapper>
          {/* <Icon name="add-circle" /> */}
          <AddIconSvg width={35} height={35} />
        </ContentHeader>

        <ContentBody>
          <StatusFlatList
            data={statusList}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item}
            renderItem={({ item }) => {
              return (
                <StatusView onPress={() => handleChangeStatus(item)}>
                  <StatusText
                    style={{
                      color:
                        statusSelected === item
                          ? theme.colors.shape
                          : theme.colors.shape_inactive,

                      fontFamily:
                        statusSelected === item
                          ? theme.fonts.poppins_medium
                          : theme.fonts.poppins_regular,
                    }}
                  >
                    {item}
                  </StatusText>
                  {statusSelected === item ? <StatusLine /> : null}
                </StatusView>
              );
            }}
          />
          <ProjectsListView>
            {loading ? (
              <ActivityIndicator
                style={{ alignSelf: "center" }}
                color={theme.colors.shape}
              />
            ) : noneProjects ? (
              <NoneProject>Você ainda não possui nenhum projeto</NoneProject>
            ) : statusSelected === "Todos" ? (
              <ProjectsAllScreen />
            ) : statusSelected === "Criação" ? (
              <ProjectsRascunhoScreen />
            ) : statusSelected === "Fila" ? (
              <ProjectsNaFilaScreen />
            ) : statusSelected === "Edição" ? (
              <ProjectsEmEdicaoScreen />
            ) : statusSelected === "Aprovação" ? (
              <ProjectsEmAprovacaoScreen />
            ) : statusSelected === "Correção" ? (
              <ProjectsEmCorrecaoScreen />
            ) : statusSelected === "Finalizado" ? (
              <ProjectsAprovadosScreen />
            ) : null}
          </ProjectsListView>
        </ContentBody>
      </Content>
    </Container>
  );
}
