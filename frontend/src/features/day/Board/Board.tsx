import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import useDay from '../api/useDay';
import { Section } from '../Section/Section';
import { BoardLoading } from './Board.loading';
import { StyledBoard } from './Board.styles';
import { BoardHeader } from './BoardHeader/BoardHeader';
import { BoardError } from './Board.error';

interface Props {
  dayId?: string;
}

export const Board: React.FC<Props> = ({ dayId }) => {
  const { status, data: day } = useDay(dayId);

  return (
    <StyledBoard>
      <BoardHeader status={status} day={day} />
      {status === 'loading' && <BoardLoading />}
      {/* TODO ➜ BoardError */}
      {status === 'error' && <BoardError />}

      <DragDropContext onDragEnd={() => {}}>
        {status === 'success' &&
          day &&
          day.sections.map(data => <Section key={data.id} dayId={day.id} data={data} />)}
      </DragDropContext>
    </StyledBoard>
  );
};
