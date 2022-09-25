import styled from 'styled-components/native';
import { AntDesign } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { getBottomSpace } from 'react-native-iphone-x-helper';

export const Container = styled.KeyboardAvoidingView`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.background_primary};
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

export const Content = styled.View`
  width: 100%;
  height: 75%;
  align-items: center;
  padding-bottom: ${getBottomSpace() + 35}px;
  justify-content: space-between;
`;

export const ContentHeader = styled.View`
  width: 90%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const TitleWrapper = styled.View``;

export const SubTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_regular};
  font-size: ${RFValue(14)}px;
  color: ${({ theme }) => theme.colors.shape};

  line-height: ${RFValue(20)}px;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_medium};
  font-size: ${RFValue(20)}px;
  color: ${({ theme }) => theme.colors.shape};

  line-height: ${RFValue(30)}px;
`;

export const TermContent = styled.View`
  flex-direction: row;
  margin-bottom: 40px;
  padding: 0 30px 0 30px;
`;
