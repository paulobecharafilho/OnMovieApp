import styled from 'styled-components/native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { TouchableOpacity } from 'react-native';

export const Container = styled.View`
  flex: 1;
`;

export const Content = styled.KeyboardAvoidingView`
  flex: 1;
  padding: 20px;
  padding-top: 0;
  justify-content: space-around;
  margin-top: 70px;
`;

export const ContentInit = styled.View`
  flex: 6;
`;

export const ContentEnd = styled.View`
  flex: 2;
  align-items: center;
`;

export const TitleWrapper = styled.View``;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_semi_bold};
  font-size: ${RFValue(14)}px;
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
`;

export const Subtitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_light};
  font-size: ${RFValue(11)}px;
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  margin-bottom: 10px;

`;

export const IconButton = styled(TouchableOpacity)`
  padding: 15px
`;
