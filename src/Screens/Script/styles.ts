import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { Dimensions, Platform, TouchableOpacity } from 'react-native';

export const Container = styled.View`
  flex: 1;
  height: ${Dimensions.get('window').height}px;
  background-color: ${({ theme }) => theme.colors.background_primary};
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
  padding: 30px 30px ${Platform.OS==='ios' ? getBottomSpace() : 30}px 30px;

  background-color: ${({ theme }) => theme.colors.background_secondary};

  border-radius: 50px;

`;

export const ContentTitleWrapper = styled.View`
  padding: 10px 20px 10px 0;
`;

export const ContentTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_semi_bold};
  font-size: ${RFValue(15)}px;
  color: ${({ theme }) => theme.colors.primary}

`;

export const ContentSubtitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_regular};
  font-size: ${RFValue(10)}px;
  color: ${({ theme }) => theme.colors.primary}

`;


export const AddSceneButton = styled(TouchableOpacity)`
  width: 50%;
  padding: 20px 20px;
  flex-direction: row;
  align-items: center;

  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50px;
`;

export const AddSceneIcon = styled(Ionicons)`
  font-size: ${RFValue(25)}px;
  color: ${({ theme }) => theme.colors.shape}
`;

export const AddSceneTitleWrapper = styled.View`
  padding-left: 10px;
`;

export const AddSceneTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_regular};
  font-size: ${RFValue(12)}px;
  color: ${({ theme }) => theme.colors.shape}
`;

export const AddSceneSubtitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_light};
  font-size: ${RFValue(10)}px;
  color: ${({ theme }) => theme.colors.shape}
`;
