import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

import TextHighlightFrame from '../../assets/frames/textHighlightFrame.svg'

export const Container = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.background_primary}
`;

export const Header = styled.View`
  height: 15%;
  justify-content: flex-end;
`;

export const HeaderWrapper = styled.View`
  padding-left: 10px;
  width: 100%;
  flex-direction: row;
  align-items: center;
`;

export const Content = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  /* background-color: red */
`;

export const TitleWrapper = styled.View`
  justify-content: center;
  padding: 10px;
`;

export const Shape = styled(TextHighlightFrame)`
  position: absolute;
  top: 5%;
  align-self: center;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_medium};
  font-size: ${RFValue(25)}px;
  color: ${({ theme }) => theme.colors.shape};

  line-height: ${RFValue(45)}px;

  text-align: center;
`;

export const SubTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_light};
  font-size: ${RFValue(25)}px;
  color: ${({ theme }) => theme.colors.shape};

  line-height: ${RFValue(45)}px;

  text-align: center;
`;

export const InputWrapper = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;

  margin-top: 50px;
  /* background-color: orange; */
`;

export const FooterTitle = styled.Text``;
