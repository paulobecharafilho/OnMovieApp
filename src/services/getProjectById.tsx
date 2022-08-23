import React from 'react';
import { useTheme } from 'styled-components';
import { ProjectProps } from '../utils/Interfaces';
import api from './api';
import { getProjetctFiles } from './getProjectFiles';


export async function getProjectById(userId, projectId, theme) {
  // const theme = useTheme();


  let projectResult: ProjectProps;
  let result: string = '';

  await api.get(`list_project_by_id.php?userId=${userId}&projectId=${projectId}`)
    .then( async (response) => {
      if (response.data.response === 'Success') {
        // console.log(`@CheckoutScreen -> refreshProject -> ${JSON.stringify(response.data.projetos[0])}`);
        let item: ProjectProps = response.data.projetos[0];

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
            break;

          case "Na Fila":
            item.newStatusProj = "Fila";
            item.highlightColor = theme.colors.secondary;
            break;

          case "em edicao":
            item.newStatusProj = "Edição";
            item.highlightColor = theme.colors.title;
            break;

          case "Em edicao":
            item.newStatusProj = "Edição";
            item.highlightColor = theme.colors.title;
            break;

          case "controle":
            item.newStatusProj = "Edição";
            item.highlightColor = theme.colors.title;
            break;

          case "correcao_controle":
            item.newStatusProj = "Edição";
            item.highlightColor = theme.colors.title;
            break;

          case "em correcao":
            item.newStatusProj = "Correção";
            item.highlightColor = theme.colors.highlight_pink;
            break;

          case "em aprovacao":
            item.newStatusProj = "Aprovação";
            item.highlightColor = theme.colors.attention;
            break;

          case "Em aprovacao":
            item.newStatusProj = "Aprovação";
            item.highlightColor = theme.colors.attention;
            break;

          case "Aprovado":
            item.newStatusProj = "Finalizado";
            item.highlightColor = theme.colors.success;
            break;

          default:
            console.log(
              `Projeto id ${item.id_proj} com status ${item.newStatusProj} não ficou em nenhuma categoria`
            );
        }
        projectResult = item;
        result = 'Success';
        
      } else {
        result='Não foi possível buscar o projeto'
      }
    })
    
    const resultFinal = {
      projectResult: projectResult,
      result: result
    }
    return resultFinal;

}