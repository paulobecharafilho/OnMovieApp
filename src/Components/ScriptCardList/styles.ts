import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons} from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled(TouchableOpacity)`
    width: 100%;

    border: solid 0.5px ${({theme}) => theme.colors.primary};
    border-radius: 50px;

    padding: 10px 20px;
    margin-bottom: 10px;
`;

export const SceneRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const SceneRowBegin = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const SceneDragIcon = styled(MaterialCommunityIcons)`
  font-size: ${RFValue(25)}px;
  color: ${({ theme }) => theme.colors.primary};
`;

export const SceneThumb = styled.Image`
  margin-left: 15px;
  width: 25px;
  height: 25px;
  border-radius: 12px;
`;

export const SceneTitleWrapper = styled.View`
  margin-left: 15px;
`;

export const SceneTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_medium};
  font-size: ${RFValue(12)}px;
  color: ${({ theme }) => theme.colors.primary};
`;

export const SceneSubtitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_light};
  font-size: ${RFValue(10)}px;
  color: ${({ theme }) => theme.colors.primary};
`;

export const SceneRowEnd = styled.View``;

export const SceneFinalIcon = styled(MaterialCommunityIcons)`
  font-size: ${RFValue(15)}px;
  color: ${({ theme }) => theme.colors.primary};
`;
