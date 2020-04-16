import React, { useState } from 'react';
import { Checkbox } from '@binarycapsule/ui-capsules';
import { StyledTask, TaskTitle } from './Task.syles';
import { ScopeCode } from '../../../components/ScopeCode/ScopeCode';
import { TaskDto } from '../api/useDay';
import { RenameTaskModal } from '../modals/RenameTaskModal';
import { StyledIconRightThickArrow } from '../../../components/day/Board/PlanTask/PlanTask.styles';

interface Props {
  dayId: string;
  sectionId: string;
  isPlan?: boolean;
  isSelected?: boolean;
  isActive?: boolean;
  isCompleted?: boolean;
  isInBreak?: boolean;
  isDragging?: boolean;
  onClick?(): void;
  data: TaskDto;
}

export const Task: React.FC<Props> = ({
  dayId,
  sectionId,
  isPlan,
  isSelected,
  isActive,
  isInBreak,
  isCompleted,
  isDragging,
  onClick,
  data,
}) => {
  const [isRenameTaskModalOpen, setIsRenameTaskModalOpen] = useState(false);

  return (
    <>
      <StyledTask
        isPlan={isPlan}
        isSelected={isSelected}
        isActive={isActive}
        isInBreak={isInBreak}
        isCompleted={isCompleted}
        isDragging={isDragging}
        onClick={onClick}
      >
        {isPlan ? (
          <StyledIconRightThickArrow />
        ) : (
          <Checkbox size="large" checked={!!isCompleted} onChange={() => {}} />
        )}
        <TaskTitle onDoubleClick={() => setIsRenameTaskModalOpen(true)}>{data.title}</TaskTitle>
        <ScopeCode scopeCode="scopeCode" />
      </StyledTask>

      {isRenameTaskModalOpen && (
        <RenameTaskModal
          dayId={dayId}
          sectionId={sectionId}
          taskData={data}
          onRequestClose={() => setIsRenameTaskModalOpen(false)}
        />
      )}
    </>
  );
};
