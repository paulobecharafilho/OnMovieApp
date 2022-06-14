import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

export const Container = styled(LinearGradient)`
    flex: 1;
    /* background-color: ${({ theme }) => theme.colors.background_primary}; */
    
`;

export const Header = styled.View`
  height: 13%;
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
  flex: 1;

  padding: 5% 5%;

  align-items: center;
`;

export const ContentHeader = styled.View`
  width: 100%;
  
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const ContentBody = styled.View`
  width: 100%;
  height: 100%;

  justify-content: flex-start;
  align-items: center;

`;


export const StatusFlatList = styled(FlatList)`
  width: 100%;
`;

export const StatusView = styled(TouchableOpacity)`
  margin-top: 25px;
  padding: 2px 7px;
  height: 30px;

`;

export const StatusText = styled.Text`
  font-size: ${RFValue(12)}px;

  line-height: ${RFValue(18)}px;
`;

export const StatusLine = styled.View`
  width: 100%;
  border: 2px solid;
  border-radius: 10px;
  border-color: ${({ theme }) => theme.colors.shape};
`;

export const TitleWrapper = styled.View`
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_medium};
  font-size: ${RFValue(18)}px;
  color: ${({ theme }) => theme.colors.shape};

  line-height: ${RFValue(27)}px;

`;

export const SubTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.poppins_regular};
  font-size: ${RFValue(10)}px;
  color: ${({ theme }) => theme.colors.shape};

  line-height: ${RFValue(15)}px;

`;



export const ProjectsListView = styled.View`
    width: 100%;
    height: 90%;
`;

export const ProjectsList = styled(FlatList)`
  width: 100%;
  height: 100%;
`;

export const NoneProject = styled.Text`
  margin-top: 50px;
  font-family: ${({ theme }) => theme.fonts.poppins_regular};
  font-size: ${RFValue(15)}px;
  color: ${({ theme }) => theme.colors.text_highlight};

  line-height: ${RFValue(20)}px;

`;

// export const Icon = styled(MaterialIcons)`
//   font-size: ${RFValue(25)}px;
//   color: ${({ theme }) => theme.colors.highlight};
// `;


