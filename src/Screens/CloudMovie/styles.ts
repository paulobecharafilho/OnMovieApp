import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { Dimensions, FlatList, Platform, TouchableOpacity } from 'react-native';
import { FilesProps } from '../../utils/Interfaces';


export const Container = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.background_primary};
`;

export const FormContainer = styled.View`
  flex: 1;
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

export const CloseIcon = styled(MaterialCommunityIcons)`
  font-family: ${({ theme }) => theme.fonts.poppins_regular};
  font-size: ${RFValue(25)}px;
  color: ${({ theme }) => theme.colors.text};

`;

export const FilesContainer = styled.View`
  flex: 1;
  align-self: center;
  margin-top: 10px;
  padding-top: 50px;
  background-color: ${({ theme }) => theme.colors.background_secondary};
  width: ${Dimensions.get('window').width}px;
  padding: 20px 20px;
  padding-bottom: 120px;

  border-radius: 50px;
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
  color: ${({ theme }) => theme.colors.secondary};
`;

export const ListContent = styled.View`
`;

export const CategoriesListView = styled.View`
  padding: 0 20px;
`;

export const CategoriesButton = styled(TouchableOpacity)``;

export const CategoriesTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_regular};
  font-size: ${RFValue(11)}px;
  color: ${({ theme }) => theme.colors.primary};
`;

