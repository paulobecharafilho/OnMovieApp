import styled from 'styled-components/native';
import { Feather } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';


export const Container = styled.TouchableOpacity`
    height: 40px;
    width: 40px;
    justify-content: center;
    align-items: center;
`;

export const Icon = styled(Feather)`
  font-size: ${RFValue(25)}px;
`;