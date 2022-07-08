import styled from 'styled-components/native';
import { Dimensions, FlatList, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';


export const Container = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.highlight}
`;

export const Header = styled.View`
  height: 12%;
  justify-content: flex-end;
  align-items: center;
`;

export const HeaderWrapper = styled.View`
  width: 100%;
  padding: 0 30px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const IconsWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const IconButton = styled(TouchableOpacity)`
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
  margin-left: 20px;
`;

export const IconNotification = styled(Ionicons)`
  font-size: ${RFValue(16)}px;
  color: ${({ theme }) => theme.colors.shape};
`;

export const IconClose = styled(Ionicons)`
  font-size: ${RFValue(25)}px;
  color: ${({ theme }) => theme.colors.shape};
`;

export const Content = styled.View`
  flex: 1;
  width: 100%;
  height: 100%;
  align-items: center;
  
`;

export const ProfileContainer = styled.View`
    margin-top: 30px;

    width: 140px;
    height: 125px;

    align-items: center;
    justify-content: center;
`;

export const PhotoBackgroundIcon = styled.View``;

export const Photo = styled.Image`
    width: 80%;
    height: 90%;
`;

export const ProfileTitleContainer = styled.View`
    margin-top: 15px;
    align-items: center;
`;

export const ProfileTitle = styled.Text`
    font-family: ${({ theme }) => theme.fonts.poppins_medium};
    font-size: ${RFValue(30)}px;
    color: ${({ theme }) => theme.colors.shape}
`;

export const ProjectTitleHighlight = styled.Text`
    color: ${({ theme }) => theme.colors.terciary};
    font-family: ${({ theme }) => theme.fonts.poppins_semi_bold};
`;

export const ProfileSubtitle = styled.Text`
    font-family: ${({ theme }) => theme.fonts.poppins_medium};
    font-size: ${RFValue(12)}px;
    color: ${({ theme }) => theme.colors.shape}
`;

export const ButtonsContainer = styled.View`
  flex-direction: column;
  width: 100%;
  height: 40%;
  justify-content: space-between;
  padding-bottom: 40px;

  margin-top: 40px;
`;

export const ButtonsRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-around;
  height: 35%;
  margin-bottom: 30px;

`;

export const ButtonWrapper = styled.View`
  padding: 0 10px 10px 10px;
  width: 30%;
  align-items: center;
`;

export const ButtonHome = styled(TouchableOpacity)`
  width: 55px;
  height: 55px;

  border-radius: 15px;

  align-items: center;
  justify-content: center;
`;

export const ButtonIconIonicons = styled(Ionicons)`
  font-size: ${RFValue(25)}px;
  color: ${({ theme }) => theme.colors.shape};
`;
export const ButtonIconMaterialCommunity = styled(MaterialCommunityIcons)`
  font-size: ${RFValue(25)}px;
  color: ${({ theme }) => theme.colors.shape};
`;

export const ButtonTitleWrapper = styled.View`
  justify-content: center;
  align-items: center;
`;


export const ButtonTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_medium};
  font-size: ${RFValue(12)}px;
  color: ${({ theme }) => theme.colors.shape};

  text-align: center;
`;

