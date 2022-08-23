import styled from 'styled-components/native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { TouchableOpacity } from 'react-native';

export const Container = styled.View`

`;

export const Content = styled.View`
  flex: 1;
  padding: 20px;
  margin-top: 50px;
`;

export const TitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const TitleWrapper = styled.View``;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_semi_bold};
  font-size: ${RFValue(14)}px;
  color: ${({ theme }) => theme.colors.primary};
`;

export const Subtitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_light};
  font-size: ${RFValue(11)}px;
  color: ${({ theme }) => theme.colors.primary};
`;

export const IconButton = styled(TouchableOpacity)`
  padding: 15px
`;

export const TrashIcon = styled(Ionicons)`
  font-size: ${RFValue(20)}px;
  color: ${({ theme }) => theme.colors.primary};
`;


export const FileContent = styled.View`
  flex: 2;
  align-items: center;
  padding-top: 10px;
`;

export const AddSceneButton = styled(TouchableOpacity)`
  padding: 10px 20px;
  border: solid 0.5px ${({theme}) => theme.colors.primary};
  border-radius: 50px;
  width: 80%;

  background-color: ${({theme}) => theme.colors.primary}

  margin-top: 10%;
`;

export const AddSceneButtonTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_medium};
  font-size: ${RFValue(12)}px;
  color: ${({ theme }) => theme.colors.shape};
  text-align: center;
`;

export const DescriptionContent = styled.View`
  flex: 1;
  margin-top: 10px;
  margin-bottom: 20px;
  align-items: center;
`;

export const SceneInput  = styled.TextInput`
  width: 100%;
  max-height: 50%;
  padding: 20px 10px;
  margin-top: 5px;
  margin-bottom: 5px;

  font-family: ${({ theme }) => theme.fonts.poppins_regular};
  font-size: ${RFValue(10)}px;
  color: ${({ theme }) => theme.colors.primary};

  text-align: center;

  border: solid 0.5px;
  border-color: ${({ theme }) => theme.colors.primary_light};
  border-radius: 50px;
`;


