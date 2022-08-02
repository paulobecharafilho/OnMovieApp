import styled from 'styled-components/native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { TouchableOpacity } from 'react-native';

export const Container = styled.View`

`;

export const Content = styled.View`
  flex: 1;
  padding: 20px;
  margin-top: 50px;

  align-items: center;
  justify-content: space-around;
`;

export const TitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
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
  margin-top: 30px;
`;

export const IconButton = styled(TouchableOpacity)`
  padding: 15px
`;
