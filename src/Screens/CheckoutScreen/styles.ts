import { getBottomSpace } from 'react-native-iphone-x-helper';
import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
    flex: 1;
`;

export const Header = styled.View`
  height: 13%;
  justify-content: flex-end;
  z-index: 1;
  background-color: ${({ theme }) => theme.colors.background_primary}
`;

export const HeaderWrapper = styled.View`
  padding-left: 10px;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const HeaderTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_semi_bold};
  font-size: ${RFValue(13)}px;
  color: ${({ theme }) => theme.colors.shape}
`;

export const HeaderLogo = styled.View`
  width: 10%;
`;

export const Content = styled.View`
    flex: 1;
    justify-content: space-between;
    padding: 30px 30px ${getBottomSpace() + 20}px 30px;
`;


export const ContentContainerInit = styled.View`
    flex: 3;
`;

export const TitleWrapper = styled.View`
    padding: 20px 0 20px 0;

`;

export const Title = styled.Text`
    font-family: ${({ theme }) => theme.fonts.poppins_medium};
    font-size: ${RFValue(15)}px;
    color: ${({ theme }) => theme.colors.primary};
`;

export const Subtitle = styled.Text`
    font-family: ${({ theme }) => theme.fonts.poppins_regular};
    font-size: ${RFValue(11)}px;
    color: ${({ theme }) => theme.colors.primary};
`;

export const CardsContainer = styled.View`
    flex: 6;
`;

export const ContentContainerEnd = styled.View`
    flex: 2;
    width: 100%;
    justify-content: space-between;
`;

export const TotalPriceWrapper = styled.View`
    align-items: center;

`;

export const PriceTitle = styled.Text`
    font-family: ${({ theme }) => theme.fonts.poppins_semi_bold};
    font-size: ${RFValue(14)}px;
    color: ${({ theme }) => theme.colors.primary};
`;

export const PriceSubtitle = styled.Text`
    font-family: ${({ theme }) => theme.fonts.poppins_regular};
    font-size: ${RFValue(11)}px;
    color: ${({ theme }) => theme.colors.primary};
`;


export const CouponWrapper = styled.View`
    padding: 0;
    align-items: center;
`;

export const CouponButton = styled.TouchableOpacity`
    padding: 5px;
`;

export const CouponTitle = styled.Text`
    font-family: ${({ theme }) => theme.fonts.poppins_regular};
    font-size: ${RFValue(10)}px;
    color: ${({ theme }) => theme.colors.primary};

    text-decoration: underline;
    text-decoration-color: ${({ theme }) => theme.colors.primary};
`;

export const CouponInputRow = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    width: 100%;
`;

export const CouponInput = styled.TextInput`
    flex: 2;
    max-width: 70%;
    border: solid 0.5px ${({ theme }) => theme.colors.primary_light};
    border-radius: 10px;
    padding: 5px;
`;


