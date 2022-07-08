import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  RefreshControl,
  StyleSheet,
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
import api from "../../services/api";

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

export function MyProjects({ navigation }) {
  const theme = useTheme();
  const NewLogoMargin = (Dimensions.get("window").width - 73) / 2;

  const route = useRoute();
  const { projects, userId } = route.params as Params;

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
  const [ProjectsInCreation, setProjectsInCreation] = useState<ProjectProps[]>([]);
  

  useEffect(() => {
    async function fetchProjects() {
      try {
        if (projects.length > 0) {
          setProjectsInCreation([]);

          projects.forEach((element) => {
            switch (element.status_proj) {
              case "Rascunho":
                // element.new_satus_proj = "Criação";
                // element.highlightColor = theme.colors.highlight;
                setProjectsInCreation((oldArray) => [...oldArray, element]);
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
          setNoneProjects(true);
          setLoading(false);
        }
      } catch (error) {
        console.log(`erro -> ${error}`);
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);


  // useEffect(() => {
  //   async function fetchProjects() {

  //     api
  //       .get(`list_projects_all.php?userId=${userId}`)
  //       .then((response) => {
  //         if (
  //           response.data.response === "" ||
  //           response.data.response === null ||
  //           response.data.response === undefined
  //         ) {
  //           Alert.alert(`Erro -> Usuário não encontrado`);
  //         } else if (response.data.response === "Success") {
  //           setProjectsInCreation([]);
  //           const lastProjectsAux = [];

  //           response.data.projetos.forEach((item, i) => {
  //             switch (item.status_proj) {
  //               case "Rascunho":
  //                 item.newStatusProj = "Criação";
  //                 item.highlightColor = theme.colors.highlight;
  //                 setProjectsInCreation((old) => [...old, item]);
  //                 break;

  //               default:
  //                 console.log(
  //                   `Projeto id ${item.id_proj} com status ${item.newStatusProj} não ficou em nenhuma categoria`
  //                 );
  //             }

  //           });

  //           setNoneProjects(false);
  //           setLoading(false);
  //         } else {
  //           setLoading(false);
  //           setNoneProjects(true);
  //           // Alert.alert(`Erro -> ${response.data.response}`);
  //         }
  //       })
  //       .catch((error) => {
  //         console.log(`error na home -> ${error}`);
  //       });
  //   }

  //   fetchProjects();
  // }, [refreshing]);


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
        data={projects}
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
