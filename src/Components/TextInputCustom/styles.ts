import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons'; 


export const Container = styled.SafeAreaView`
    width: 80%;
    height: 50px;
    background-color: ${({ theme }) => theme.colors.inactive};
    
    border-radius: 10px;
    padding-left: 20px;

    flex-direction: row;

    align-items: center;

`;

export const Icon = styled(MaterialIcons)`
    font-family: ${({ theme }) => theme.fonts.poppins_regular};
    font-size: ${RFValue(15)}px;
    color: ${({ theme }) => theme.colors.shape};

    margin-right: 10px;
`;

export const Title = styled.TextInput`
    font-family: ${({ theme }) => theme.fonts.poppins_regular};
    font-size: ${RFValue(15)}px;
    color: ${({ theme }) => theme.colors.shape};


`;