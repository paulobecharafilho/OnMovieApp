import React from 'react';
import { useTheme } from 'styled-components';
import { ProjectProps } from '../utils/Interfaces';
import api, { apiStripe } from './api';
import { getProjectById } from './getProjectById';
import { getProjetctFiles } from './getProjectFiles';


export async function getProjects(userId, theme) {
  // const theme = useTheme();
  
  let projectsAll: ProjectProps[] = [];
  let projectsInCreation: ProjectProps[] = [];
  let lastProjectsInCreation: ProjectProps[] = [];
  let pedidos: ProjectProps[] = [];
  

  let result: string = '';

  await api.get(`list_projects_all.php?userId=${userId}}`)
    .then( async (response) => {
      if (response.data.response === 'Success') {

        for (let item of response.data.projetos) {

          await getProjetctFiles(userId, item.id_proj).then((result) => {
            if (result.result === "Success") {
              item.files = result.libraryDependenciesFiles;
              item.qtd_files = result.libraryDependenciesFiles.length;
            }
          });
  
          switch (item.status_proj) {
            case "Rascunho":
              item.newStatusProj = "Criação";
              item.highlightColor = theme.colors.highlight;
              projectsInCreation.push(item);
              if (lastProjectsInCreation.length <=4) {
                lastProjectsInCreation.push(item);
              }
              break;
  
            case "Na Fila":
              item.newStatusProj = "Fila";
              item.highlightColor = theme.colors.secondary;
              pedidos.push(item);
              break;
  
            case "em edicao":
              item.newStatusProj = "Edição";
              item.highlightColor = theme.colors.title;
              pedidos.push(item);
              break;
  
            case "Em edicao":
              item.newStatusProj = "Edição";
              item.highlightColor = theme.colors.title;
              pedidos.push(item);
              break;
  
            case "controle":
              item.newStatusProj = "Edição";
              item.highlightColor = theme.colors.title;
              pedidos.push(item);
              break;
  
            case "correcao_controle":
              item.newStatusProj = "Edição";
              item.highlightColor = theme.colors.title;
              pedidos.push(item);
              break;
  
            case "em correcao":
              item.newStatusProj = "Correção";
              item.highlightColor = theme.colors.highlight_pink;
              pedidos.push(item);
              break;
  
            case "em aprovacao":
              item.newStatusProj = "Aprovação";
              item.highlightColor = theme.colors.attention;
              pedidos.push(item);
              break;
  
            case "Em aprovacao":
              item.newStatusProj = "Aprovação";
              item.highlightColor = theme.colors.attention;
              pedidos.push(item);
              break;
  
            case "Aprovado":
              item.newStatusProj = "Finalizado";
              item.highlightColor = theme.colors.success;
              pedidos.push(item);
              break;

            case 'com pendencia':
              console.log(`Job ${item.id_proj} estava com pendencia`);
              await apiStripe.post(
                `proc_cancel_checkout.php?userId=${userId}&projId=${item.id_proj}`
              ).then(async () => {
                getProjectById(userId, item.id_proj, theme)
                .then((result) => {
                  if (result.result === 'Success') {
                    item.newStatusProj = "Criação";
                    item.highlightColor = theme.colors.highlight;
                    projectsInCreation.push(item);
                    if (lastProjectsInCreation.length <=4) {
                      lastProjectsInCreation.push(item);
                    }
                  }
                })
              })
              break;
  
            default:
              console.log(
                `Projeto id ${item.id_proj} com status ${item.newStatusProj} não ficou em nenhuma categoria`
              );
          }

          projectsAll.push(item);
        }

        
        result = 'Success';
        
      } else if (response.data.response === 'Erro ao encontrar Projetos') {
        result = 'Nenhum Projeto'
      } 
      
      else {
        result='Não foi possível buscar os projetos'
      }
    })
    .catch((err) => {
      console.log(`erro na captura dos projetos -> ${err}`)
    })
    
    const resultFinal = {
      projectsAll: projectsAll,
      projectsInCreation: projectsInCreation,
      lastProjectsInCreation: lastProjectsInCreation,
      pedidos: pedidos,
      result: result
    }
    return resultFinal;

}