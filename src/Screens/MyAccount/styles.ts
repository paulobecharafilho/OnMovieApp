import { getBottomSpace } from 'react-native-iphone-x-helper';
import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.background_primary}

`;

export const Header = styled.View`
  height: 13%;
  /* flex: 1; */
  justify-content: flex-end;
  z-index: 1;
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

export const Content = styled.View`
  flex: 1;
  justify-content: space-around;
  padding: 10px 30px ${getBottomSpace() + 20}px 30px;
`;


export const UserInfo = styled.View`
  flex: 1;
  justify-content: space-between;
  padding: 10px 0 30px 0;
`;

export const TitleWrapper = styled.View``;

export const Title = styled.Text`
margin-bottom: 10px;
font-family: ${({ theme }) => theme.fonts.poppins_semi_bold};
font-size: ${RFValue(12)}px;
color: ${({ theme }) => theme.colors.shape};
`;

export const Subtitle = styled.Text`
margin-bottom: 10px;
font-family: ${({ theme }) => theme.fonts.poppins_medium};
font-size: ${RFValue(11)}px;
color: ${({ theme }) => theme.colors.shape};
`;

export const ButtonsContent = styled.View`
  flex: 1;
  justify-content: space-between;
  padding: 10px 0 30px 0;
`;