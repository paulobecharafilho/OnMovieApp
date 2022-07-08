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

  height: 8px;

  border-radius: 200px;

`;

export const ProgressBarFilled = styled.View`
  position: absolute;

  height: 8px;

  border-radius: 200px;

  align-self: flex-start;
`;
