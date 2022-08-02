import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { TouchableOpacity } from 'react-native';

export const Container = styled(TouchableOpacity)`
    width: 130px;
    height: 70%;

    padding: 20px 20px;

    margin-right: 15px;

    border: solid 0.5px;
    border-color: ${({ theme }) => theme.colors.text_light};
    border-radius: 10px;
    
    justify-content: space-between;
`;

export const ThumbImage = styled.Image``;

export const TitleWrapper = styled.View`
  margin-top: 10px;
  height: 30%;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_medium};
  font-size: ${RFValue(12)}px;
  color: ${({ theme }) => theme.colors.shape};

`;

export const Subtitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_regular};
  font-size: ${RFValue(10)}px;
  color: ${({ theme }) => theme.colors.shape};
`;

export const StatusView = styled.View`
  width: 70%;
  padding: 2px 8px;
  border-radius: 60px;
  align-items: center;
  justify-content: center;
`;

export const StatusTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_medium};
  font-size: ${RFValue(8)}px;
  color: ${({ theme }) => theme.colors.shape};

  text-align: center;
`;

export const ProgressView = styled.View``;

export const ProgressSubtitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_light};
  font-size: ${RFValue(10)}px;
  color: ${({ theme }) => theme.colors.shape};
`;

