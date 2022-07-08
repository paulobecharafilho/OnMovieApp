import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { SimpleLineIcons } from '@expo/vector-icons';

export const Container = styled.View`
  padding: 15px 15px 20px 15px;
  
  border: solid 0.5px;
  border-radius: 10px;

  margin-top: 15px;
`;

export const ContainerRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const InitialRow = styled.View`
  flex: 4;
  padding-right: 20px;
  flex-direction: row;
  align-items: center;
`;

export const Thumb = styled.Image``;

export const TitleWrapper = styled.View`
  margin-left: 20px;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_medium};
  font-size: ${RFValue(12)}px;
`;

export const Subtitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_regular};
  font-size: ${RFValue(10)}px;
`;

export const FinalRow = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

export const Time = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_medium};
  font-size: ${RFValue(12)}px;
`;

export const IconButton = styled(TouchableOpacity)`

`;

export const IconOptions = styled(SimpleLineIcons)`
  font-family: ${({ theme }) => theme.fonts.poppins_medium};
  font-size: ${RFValue(15)}px;
  margin-left: 10px;
`;
