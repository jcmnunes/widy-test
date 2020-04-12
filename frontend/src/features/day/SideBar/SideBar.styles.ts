import styled from 'styled-components/macro';

export const StyledSideBar = styled.div`
  flex: 1;
  min-width: 640px;
  padding: 32px;
  height: 100vh;
  overflow-y: auto;
  background: ${({ theme }) => theme.yellow050};
`;
