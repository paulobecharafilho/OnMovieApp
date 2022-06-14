import { TouchableOpacity } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';


export const Container = styled(TouchableOpacity)`
    width: 70%;

    background-color: ${({ theme, disabled }) => disabled ? theme.colors.inactive : theme.colors.shape};

    border-radius: 45px;

    padding: 15px 60px;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_semi_bold};
  font-size: ${RFValue(15)}px;

  text-align: center;
`;