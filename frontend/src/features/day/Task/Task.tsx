import React, { useState } from 'react';
import { Checkbox } from '@binarycapsule/ui-capsules';
import { StyledTask, TaskTitle } from './Task.syles';
import { ScopeCode } from '../../../components/ScopeCode/ScopeCode';
import { TaskDto } from '../api/useDay';
import { RenameTaskModal } from '../modals/RenameTaskModal';

interface Props {
  dayId: string;
  sectionId: string;
  data: TaskDto;
}

export const Task: React.FC<Props> = ({ dayId, sectionId, data }) => {
  const [isRenameTaskModalOpen, setIsRenameTaskModalOpen] = useState(false);

  return (
    <>
      <StyledTask>
        <Checkbox size="large" checked={false} onChange={() => {}} />
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
