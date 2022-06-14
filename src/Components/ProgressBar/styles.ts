import styled from 'styled-components/native';

export const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;

    padding: 8px;
`;

export const ProgressBarEmpty = styled.View`
  background-color: ${({ theme }) => theme.colors.inactive};

  flex-direction: row;

  height: 10px;

  border-radius: 5%;

`;

export const ProgressBarFilled = styled.View`
  position: absolute;

  height: 10px;

  border-radius: 5%;

  align-self: flex-start;
`;
