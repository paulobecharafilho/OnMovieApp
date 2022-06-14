import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Ionicons } from '@expo/vector-icons';

export const Container = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.background_primary};
`;

export const Header = styled.View`
  height: 15%;
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


export const Content = styled.View`
  flex: 1;
  padding: 0 30px;
  padding-top: 40px;
  align-items: center;
`;

export const UserRow = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const UserInformations = styled.View``;

export const UserName = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_medium};
  font-size: ${RFValue(24)}px;
  color: ${({ theme }) => theme.colors.shape}
`;

export const TextHighlight = styled.Text`
  color: ${({ theme }) => theme.colors.highlight}
`;

export const UserCredits = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_medium};
  font-size: ${RFValue(10)}px;
  color: ${({ theme }) => theme.colors.shape}
`;

export const UserProfileWrapper = styled.View`
  align-items: center;
  justify-content: center;
`;

export const UserPhotoBackground = styled.View`
  width: 60px;
  height: 60px;
  border-radius: 25px;
  background-color: ${({ theme }) => theme.colors.text_highlight};

  align-items: center;
  justify-content: center;
`;

export const UserPhoto = styled.Image`
  width: 45px;
  height: 45px;
  align-self: center;
`;


export const MovieCloudContainer = styled.View`
  width: 100%;
  margin-top: 30px;
  background-color: ${({ theme }) => theme.colors.dark_inactive};

  border-radius: 10px;

  padding: 20px 20px 25px 20px;
  justify-content: space-between;
`;

export const MovieCloudRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 15px;
`;

export const MovieCloudTitleWrapper = styled.View`
  justify-content: center;
`;

export const MovieCloudTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_medium};
  font-size: ${RFValue(12)}px;
  color: ${({ theme }) => theme.colors.shape};

  line-height: 18px;
`;

export const MovieCloudSubtitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_regular};
  font-size: ${RFValue(10)}px;
  color: ${({ theme }) => theme.colors.shape};
  
`;

export const MovieCloudDiskSpace = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_regular};
  font-size: ${RFValue(10)}px;
  color: ${({ theme }) => theme.colors.shape};
`;

