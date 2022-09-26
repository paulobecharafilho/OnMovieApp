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
  z-index: 1;
`;

export const HeaderWrapper = styled.View`
  padding-left: 10px;
  width: 100%;
  flex-direction: row;
  align-items: center;
`;

export const Content = styled.KeyboardAvoidingView`
  flex: 1;
  align-items: center;
  justify-content: center;
  z-index: 1;
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
  justify-content: space-between;

  margin-top: 50px;
  /* background-color: orange; */
`;

export const TextWrapper = styled.View`
  justify-content: center;
  padding: 10px;
`;

export const TextRemove = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_regular};
  font-size: ${RFValue(13)}px;
  color: ${({ theme }) => theme.colors.shape};

  text-align: center;
`;