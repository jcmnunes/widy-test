import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { ReactQueryDevtools } from 'react-query-devtools';
import { DaysNav } from '../daysNav/DaysNav';
import { StyledDay } from './Day.styles';
import useDays from '../daysNav/api/useDays';
import { Board } from './Board/Board';
import { SideBar } from './SideBar/SideBar';
import { StatusBar } from '../../components/StatusBar/StatusBar';

interface Props {}

export const Day: React.FC<Props> = () => {
  const { dayId } = useParams();
  const history = useHistory();

  const { days } = useDays();

  useEffect(() => {
    if (!dayId && days && days.length > 0) {
      history.replace(`/day/${days[0].id}`);
    }
  }, [dayId, days, history]);

  return (
    <>
      <StyledDay>
        <StatusBar />
        <DaysNav />
        <Board dayId={dayId} />
        <SideBar />
      </StyledDay>

      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
};
