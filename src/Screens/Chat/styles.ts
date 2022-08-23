import styled from 'styled-components/native';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { RFValue } from 'react-native-responsive-fontsize';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAvoidingView } from 'react-native';

export const Container = styled.View`
    flex: 1;
`;

export const Header = styled.View`
  height: 13%;
  /* flex: 1; */
  justify-content: flex-end;
  z-index: 1;
  background-color: ${({ theme }) => theme.colors.background_primary}
`;

export const HeaderWrapper = styled.View`
  padding-left: 10px;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const HeaderTitleWrapper = styled.View`
  align-items: center;
`;

export const HeaderTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_semi_bold};
  font-size: ${RFValue(13)}px;
  color: ${({ theme }) => theme.colors.shape}
`;

export const HeaderSubtitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_semi_bold};
  font-size: ${RFValue(9)}px;
  color: ${({ theme }) => theme.colors.shape}
`;

export const HeaderLogo = styled.View`
  width: 10%;
`;

export const Content = styled.KeyboardAvoidingView`
  flex: 1;
  width: 100%;
  justify-content: space-between;
`;

export const ContentChat = styled.View`
  flex: 8;
  padding: 10px 30px 10px 30px;
`;


