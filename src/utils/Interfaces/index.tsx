import { ProjectDTO } from "../../dtos/ProjectDTO";

export interface ProjectProps extends ProjectDTO {
  highlightColor?: string;
  newStatusProj?: string;
  dateCreatedFormatted?: string;
  dateModifiedFormatted?: string;
}

export interface FilesProps {
  file_type:  string,
  file_name: string,
  file_size:  string,
  file_description:  string,
  file_id:  number,
  file_thumb:  string,
  file_duration: number,
}