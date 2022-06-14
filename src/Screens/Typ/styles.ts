import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
    flex: 1;
    padding-top: 60%;
    background-color: ${({ theme }) => theme.colors.background_primary};
    align-items: center;
`;

export const Title = styled.Text`
  width: 80%;
  font-family: ${({ theme }) => theme.fonts.poppins_regular};
  font-size: ${RFValue(25)}px;
  color: ${({ theme }) => theme.colors.shape};

  text-align: center;
`;

export const TitleHighlight = styled.Text`
  color: ${({ theme }) => theme.colors.text_highlight};
`;

export const FooterTitleButton = styled.TouchableOpacity`
  width: 70%;
  background-color: transparent;

  padding: 13px 40px;

  margin-top: 50px;
`;

export const FooterTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_regular};
  font-size: ${RFValue(12)}px;
  color: ${({ theme }) => theme.colors.shape};

  text-align: center;
`;

