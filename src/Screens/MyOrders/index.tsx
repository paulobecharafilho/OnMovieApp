import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
} from "react-native";
import { useRoute } from "@react-navigation/native";

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

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

interface ProjectProps extends ProjectDTO {
  newStatusProj: string;
  highlightColor: string;
}
interface Params {
  projects: ProjectProps[];
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
    wait(2000).then(() => setRefreshing(false));
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

  useEffect(() => {
    async function fetchProjects() {
      try {
        if (params.projects.length > 0) {
          setProjectsAll([]);
          setProjectsAprovados([]);
          setProjectsEmAprovacao([]);
          setProjectsEmEdicao([]);
          setProjectsNaFila([]);

          params.projects.forEach((element) => {
            switch (element.status_proj) {

              case "Na Fila":
                // element.new_satus_proj = "Fila";
                // element.highlightColor = theme.colors.highlight;
                setProjectsNaFila((oldArray) => [...oldArray, element]);
                break;

              case "em edicao":               
                setProjectsEmEdicao((oldArray) => [...oldArray, element]);
                break;

              case "Em edicao":               
                setProjectsEmEdicao((oldArray) => [...oldArray, element]);
                break;

              case "controle":                
                setProjectsEmEdicao((oldArray) => [...oldArray, element]);
                break;

              case "correcao_controle":
                setProjectsEmEdicao((oldArray) => [...oldArray, element]);
                break;

              case "em correcao":
                setProjectsEmEdicao((oldArray) => [...oldArray, element]);
                break;

              case "em aprovacao":
                setProjectsEmAprovacao((oldArray) => [...oldArray, element]);
                break;

              case "Em aprovacao":
                setProjectsEmAprovacao((oldArray) => [...oldArray, element]);
                break;

              case "Aprovado":
                setProjectsAprovados((oldArray) => [...oldArray, element]);
                break;

              default:
                console.log(
                  `Projeto id ${element.id_proj} com status ${element.status_proj} não ficou em nenhuma categoria`
                );
            }

            setProjectsAll((oldArray) => [...oldArray, element]);
          });
          setNoneProjects(false);
          setLoading(false);
        } else {
          setNoneProjects(true);
          setLoading(false);
        }
      } catch (error) {
        console.log(`erro -> ${error}`);
        setLoading(false);
      }
    }

    fetchProjects();
  }, [refreshing]);

  function handleChangeStatus(status) {
    setStatusSelected(status);
  }

  function handleGoToProjectDetails(project: ProjectProps) {
    navigation.navigate(`ProjectDetails`, {
      project: project,
      userId: params.userId
    })
  }

  function handleNewProject() {
    navigation.navigate('NewProject', { userId: params.userId });
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
          return <ProjectListCard onPress={() => handleGoToProjectDetails(item)} project={item} />;
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
          return <ProjectListCard onPress={() => handleGoToProjectDetails(item)} project={item} />;
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
          return <ProjectListCard onPress={() => handleGoToProjectDetails(item)} project={item} />;
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
          return <ProjectListCard onPress={() => handleGoToProjectDetails(item)} project={item} />;
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
          return <ProjectListCard onPress={() => handleGoToProjectDetails(item)} project={item} />;
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
          return <ProjectListCard onPress={() => handleGoToProjectDetails(item)} project={item} />;
        }}
      />
    );
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
