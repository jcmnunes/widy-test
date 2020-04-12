import React, { useState } from 'react';
import {
  Draggable,
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
} from 'react-beautiful-dnd';
import { Button } from '@binarycapsule/ui-capsules';
import { Task } from '../Task/Task';
import { SectionEmpty } from './Section.empty';
import { SectionDto } from '../api/useDay';
import { AddTaskModal } from '../modals/AddTaskModal';
import { SectionWithTasks, StyledSection } from './Section.styles';
import { Heading2 } from '../../../components/common/Typography';

interface Props {
  dayId: string;
  data: SectionDto;
}

export const Section: React.FC<Props> = ({ dayId, data: { id, isPlan, title, tasks } }) => {
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  const renderSection = (provided: DroppableProvided, _snapshot: DroppableStateSnapshot) => (
    <SectionWithTasks ref={provided.innerRef} {...provided.droppableProps}>
      {tasks.map((taskData, index) => (
        <Draggable key={taskData.id} draggableId={taskData.id} index={index}>
          {(provided1, snapshot) => (
            <div
              ref={provided1.innerRef}
              {...provided1.draggableProps}
              {...provided1.dragHandleProps}
            >
              {isPlan ? (
                <Task dayId={dayId} sectionId={id} data={taskData} />
              ) : (
                <Task dayId={dayId} sectionId={id} data={taskData} />
              )}
            </div>
          )}
        </Draggable>
      ))}
      {provided.placeholder}
    </SectionWithTasks>
  );

  const renderEmptySection = (provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
    <div ref={provided.innerRef} {...provided.droppableProps}>
      <SectionEmpty
        title={title}
        isPlan={isPlan}
        isDraggingOver={snapshot.isDraggingOver}
        onClick={() => {}}
      />
      {provided.placeholder}
    </div>
  );

  return (
    <>
      <StyledSection>
        <Heading2>{title}</Heading2>
        <Droppable droppableId={id}>
          {tasks.length > 0 ? renderSection : renderEmptySection}
        </Droppable>

        <Button
          appearance="minimal"
          iconBefore="plus"
          onClick={() => setIsAddTaskModalOpen(true)}
          style={{ marginTop: 8 }}
        >
          {isPlan ? 'Add to Plan' : 'Add task'}
        </Button>
      </StyledSection>

      {isAddTaskModalOpen && (
        <AddTaskModal
          dayId={dayId}
          sectionId={id}
          onRequestClose={() => setIsAddTaskModalOpen(false)}
        />
      )}
    </>
  );
};
