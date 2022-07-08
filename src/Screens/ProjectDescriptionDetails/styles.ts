import styled from 'styled-components/native';
import { ViewProps } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { getBottomSpace } from 'react-native-iphone-x-helper';

interface StatusProps extends ViewProps {
  backgroundColor?: string
}

export const Container = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.background_primary};
`;

export const Header = styled.View`
  height: 13%;
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

export const HeaderTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_semi_bold};
  font-size: ${RFValue(13)}px;
  color: ${({ theme }) => theme.colors.shape}
`;

export const HeaderLogo = styled.View`
  width: 10%;
`;

export const Content = styled.View`
  flex: 1;
  padding: 20px 0 0 0;
`;

export const ContentHeader = styled.View`
  flex: 1;  
  width: 100%;
  padding-left: 30px;
  padding-right: 30px;
`;

export const Thumb = styled.Image`
  width: 30%;
  height: 60px;
`;

export const ContentStatusWrapper = styled.View<StatusProps>`
  padding: 5px 10px;
  
  max-width: 30%;
  
  align-items: center;
  justify-content: center;

  border-radius: 30px;

  background-color: ${({theme, backgroundColor}) => backgroundColor ? backgroundColor : theme.colors.secondary}
`;

export const ContentStatus = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_medium};
  font-size: ${RFValue(11)}px;
  color: ${({ theme }) => theme.colors.shape}
`;

export const ContentTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_medium};
  font-size: ${RFValue(20)}px;
  color: ${({ theme }) => theme.colors.shape};

  margin-top: 5px;
`;

export const InfoContainer = styled.View`
  flex: 7;
  background-color: ${({ theme }) => theme.colors.background_secondary};

  justify-content: space-around;
  
  width: 100%;

  border-radius: 50px;

  padding-top: 20px;
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: ${getBottomSpace()}px;
`;

export const InfoTitleWrapperFlex1 = styled.View`
  flex: 1;
`;

export const InfoTitleWrapperFlex2 = styled.View`
  flex: 2;
`;

export const InfoTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_medium};
  font-size: ${RFValue(12)}px;
  color: ${({ theme }) => theme.colors.primary};
`;

export const InfoSubtitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_light};
  font-size: ${RFValue(10)}px;
  color: ${({ theme }) => theme.colors.primary};
`;

export const ButtonWrapper = styled.View`
  flex: 1;
  align-self: center;
  justify-content: flex-end;
`;

