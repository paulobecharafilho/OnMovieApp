import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  RefreshControl,
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

export function MyOrders({ navigation }) {
  const theme = useTheme();
  const NewLogoMargin = (Dimensions.get("window").width - 73) / 2;

  const route = useRoute();
  const params = route.params as Params;

  const [userId, setUserId] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(100).then(() => setRefreshing(false));
  }, []);

  const statusList = ["Todos", "Fila", "Edição", "Aprovação", "Finalizado"];
  const [statusSelected, setStatusSelected] = useState("Todos");

  const [noneProjects, setNoneProjects] = useState(true);
  const [projectsAll, setProjectsAll] = useState<ProjectProps[]>([]);
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

  useFocusEffect(
    useCallback(() => {
      async function fetchProjects() {
        await getProjects(params.userId, theme)
          .then((result) => {
            if (result.result === "Success") {
              if (result.pedidos.length === 0) {
                setNoneProjects(true);
              } else {
                setNoneProjects(false);
                setProjectsAll(result.pedidos);

                for (let project of result.pedidos) {
                  if (project.newStatusProj === "Fila") {
                    setProjectsNaFila((old) => [...old, project]);
                  } else if (project.newStatusProj === "Edição") {
                    setProjectsEmEdicao((old) => [...old, project]);
                  } else if (project.newStatusProj === "Correção") {
                    setProjectsEmCorrecao((old) => [...old, project]);
                  } else if (project.newStatusProj === "Aprovação") {
                    setProjectsEmAprovacao((old) => [...old, project]);
                  } else if (project.newStatusProj === "Finalizado") {
                    setProjectsAprovados((old) => [...old, project]);
                  } else {
                    console.log(
                      `projeto ${project.id_proj} não ficou em nenhum grupo! -> ${project.newStatusProj}`
                    );
                  }
                }
              }
              setLoading(false);
            } else if(result.result === 'Nenhum Projeto') {
              console.log(`@MyProjects -> Nenhum projeto`)
              setNoneProjects(true);
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

  function handleGoToProjectDetails(project: ProjectProps) {
    navigation.navigate(`ProjectDetails`, {
      project: project,
      userId: params.userId,
    });
  }

  function handleNewProject() {
    navigation.navigate("NewProject", { userId: params.userId });
  }

  function handleBackButton() {
    navigation.goBack();
  }

  //Functions To Show in Render by Status!

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
          return (
            <ProjectListCard
              onPress={() => handleGoToProjectDetails(item)}
              project={item}
            />
          );
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
          return (
            <ProjectListCard
              onPress={() => handleGoToProjectDetails(item)}
              project={item}
            />
          );
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
          return (
            <ProjectListCard
              onPress={() => handleGoToProjectDetails(item)}
              project={item}
            />
          );
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
          return (
            <ProjectListCard
              onPress={() => handleGoToProjectDetails(item)}
              project={item}
            />
          );
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
          return (
            <ProjectListCard
              onPress={() => handleGoToProjectDetails(item)}
              project={item}
            />
          );
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
          return (
            <ProjectListCard
              onPress={() => handleGoToProjectDetails(item)}
              project={item}
            />
          );
        }}
      />
    );
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
            <Title>Meus Pedidos</Title>
            <SubTitle>veja todos os seus pedidos por status!</SubTitle>
          </TitleWrapper>
          {/* <Icon name="add-circle" /> */}
          <IconButton onPress={handleNewProject}>
            <AddIconSvg width={35} height={35} />
          </IconButton>
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
              <NoneProject>Você ainda não possui pedido realizado.</NoneProject>
            ) : statusSelected === "Todos" ? (
              <ProjectsAllScreen />
            ) : statusSelected === "Fila" ? (
              <ProjectsNaFilaScreen />
            ) : statusSelected === "Edição" ? (
              <ProjectsEmEdicaoScreen />
            ) : statusSelected === "Aprovação" ? (
              <ProjectsEmAprovacaoScreen />
            ) : statusSelected === "Finalizado" ? (
              <ProjectsAprovadosScreen />
            ) : null}
          </ProjectsListView>
        </ContentBody>
      </Content>
    </Container>
  );
}
