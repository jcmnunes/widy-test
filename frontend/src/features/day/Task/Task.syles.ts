import styled, { css } from 'styled-components/macro';
import { Theme } from '@binarycapsule/ui-capsules/dist/types';

const getColors = (props: StyledTaskProps & { theme: Theme }) => {
  const colors = {
    border: props.theme.neutral200,
    background: 'white',
  };

  if (props.isCompleted) {
    colors.border = props.theme.neutral100;
    colors.background = props.theme.neutral025;
  }

  if (props.isSelected) {
    colors.border = props.theme.yellow500;
    colors.background = props.isPlan ? props.theme.neutral075 : props.theme.yellow050;
  }

  if (props.isInBreak) {
    colors.border = props.theme.blue200;
  }

  if (props.isDragging) {
    colors.background = props.theme.blue050;
    colors.border = props.theme.blue050;
  }

  return colors;
};

export const StyledCopyButton = styled.div`
  display: none;
  height: 24px;
`;

const isActiveMixin = css`
  border-color: ${({ theme }) => theme.yellow700};
  box-shadow: 0 0 0 4px ${({ theme }) => theme.yellow200};
`;

const isInBreakMixin = css`
  border-color: ${({ theme }) => theme.blue400};
  box-shadow: 0 0 0 4px ${({ theme }) => theme.blue100};
`;

interface StyledTaskProps {
  isPlan?: boolean;
  isCompleted?: boolean;
  isActive?: boolean;
  isInBreak?: boolean;
  isSelected?: boolean;
  isDragging?: boolean;
}

export const StyledTask = styled.div<StyledTaskProps>`
  display: flex;
  align-items: center;
  flex-direction: row;
  border: ${props => (props.isPlan ? 'none' : `1px solid ${getColors(props).border}`)};
  border-radius: ${({ isPlan }) => (isPlan ? 0 : '4px')};
  background-color: ${props => getColors(props).background};
  padding: 8px;
  font-size: 16px;
  margin: ${({ isPlan }) => (isPlan ? 0 : '4px 0')};
  color: ${props => (props.isCompleted ? props.theme.neutral300 : props.theme.neutral700)};
  cursor: pointer;
  ${({ isActive }) => isActive && isActiveMixin};
  ${({ isInBreak }) => isInBreak && isInBreakMixin};

  &:hover {
    background-color: ${props =>
      // eslint-disable-next-line no-nested-ternary
      props.isPlan
        ? props.isSelected
          ? props.theme.neutral075
          : props.theme.neutral050
        : props.isSelected
        ? props.theme.yellow075
        : props.theme.neutral025};

    ${StyledCopyButton} {
      display: block;
    }
  }
`;

export const TaskTitle = styled.span`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 0;
  margin-right: 16px;
  text-align: left;
`;
