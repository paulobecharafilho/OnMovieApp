import { ViewProps } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

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
  padding: 20px 30px 30px 30px;
`;

export const ContentHeader = styled.View`
  width: 100%;
`;

export const Thumb = styled.Image`
  width: 30%;
  height: 60px;
`;

export const ContentStatusWrapper = styled.View<StatusProps>`
  margin-top: 20px;
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
  font-size: ${RFValue(30)}px;
  color: ${({ theme }) => theme.colors.shape};

  margin-top: 5px;
`;

export const ContentInfoRow = styled.View`
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: space-between;

  margin-top: 15px;
`;

export const ContentColumWrapper = styled.View`
`;

export const ContentColumSubtitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_regular};
  font-size: ${RFValue(10)}px;
  color: ${({ theme }) => theme.colors.shape};
`;

export const ContentColumTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_medium};
  font-size: ${RFValue(12)}px;
  color: ${({ theme }) => theme.colors.shape};
`;

export const ContentProgress = styled.View`
  margin-top: 25px;
`;

export const ContentProgressTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_regular};
  font-size: ${RFValue(10)}px;
  color: ${({ theme }) => theme.colors.shape};  

  margin-bottom: 10px;
`;

export const ContentCardsScrollView = styled.ScrollView`
  flex: 1;
  margin-top: 40px;
`;

