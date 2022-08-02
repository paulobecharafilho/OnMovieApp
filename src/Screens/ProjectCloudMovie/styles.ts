import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { FlatList, TouchableOpacity } from 'react-native';
import { FilesProps } from '../../utils/Interfaces';

export const Container = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.background_primary}
`;

export const ContentBegin = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const TitleBegin = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_medium};
  font-size: ${RFValue(25)}px;
  color: ${({ theme }) => theme.colors.shape};

  text-align: center;
`;

export const FormContainer = styled.View`
  flex: 1;
  padding-bottom: ${getBottomSpace()}px;
`;

export const Header = styled.View`
  height: 12%;
  justify-content: flex-end;
  padding: 0 30px;
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const PageTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_semi_bold};
  font-size: ${RFValue(12)}px;
  color: ${({ theme }) => theme.colors.shape}

`;

export const HeaderIcon = styled(MaterialCommunityIcons)`
  font-size: ${RFValue(18)}px;
  color: ${({ theme }) => theme.colors.shape}
`;

export const Content = styled.View`
  flex: 1;
  padding: 30px 30px 0 30px;
  
`;

export const ContentTitleRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const IconButton = styled(TouchableOpacity)`
  padding: 10px;
  align-items: center;
  justify-content: center;
`;

export const ContentTitleWrapper = styled.View``;

export const ContentTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_semi_bold};
  font-size: ${RFValue(15)}px;
  color: ${({ theme }) => theme.colors.shape};
`;

export const ContentSubtitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_regular};
  font-size: ${RFValue(11)}px;
  color: ${({ theme }) => theme.colors.shape};
`;

export const CloudMovieButton = styled(TouchableOpacity)`
  margin-top: 30px;
  width: 100%;
  padding: 15px 15px 15px 20px;

  background-color: ${({ theme }) => theme.colors.secondary};
  
  border: solid 0.5px;
  border-color: ${({ theme }) => theme.colors.shape_inactive};
  border-radius: 20px;
  box-shadow: 5px 2px 3px ${({ theme }) => theme.colors.title};
`;

export const CloudMovieRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const CloudMovieIconAndTitle = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const CloudMovieIcon = styled(MaterialCommunityIcons)`
  font-family: ${({ theme }) => theme.fonts.poppins_regular};
  font-size: ${RFValue(20)}px;
  color: ${({ theme }) => theme.colors.shape};

  margin-right: 15px;
`;

export const CloudMovieTitleWrapper = styled.View``;

export const CloudMovieTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_medium};
  font-size: ${RFValue(12)}px;
  color: ${({ theme }) => theme.colors.shape};
`;

export const CloudMovieSubtitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_regular};
  font-size: ${RFValue(10)}px;
  color: ${({ theme }) => theme.colors.shape};
`;

export const FilesContainer = styled.View`
  flex: 1;
  margin-top: 50px;
`;

export const FilesTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_semi_bold};
  font-size: ${RFValue(12)}px;
  color: ${({ theme }) => theme.colors.shape};

  margin-bottom: 15px;
`;

export const FilesFlatList = styled(FlatList as new () => FlatList<FilesProps>)``;

export const NoneProjectTitle = styled.Text`
  margin-top: 20px;
  font-family: ${({ theme }) => theme.fonts.poppins_regular};
  font-size: ${RFValue(12)}px;
  color: ${({ theme }) => theme.colors.text_highlight};
`;

export const CloseIcon = styled(MaterialCommunityIcons)`
  font-family: ${({ theme }) => theme.fonts.poppins_regular};
  font-size: ${RFValue(25)}px;
  color: ${({ theme }) => theme.colors.text};

`;
