import axios from 'axios';
import { useQuery } from 'react-query';

export interface TaskDto {
  id: string;
  title: string;
  scopeId: string | null;
  start: number | null;
  completed: boolean;
  notes: string;
  time: number;
}

export interface SectionDto {
  id: string;
  isPlan: boolean;
  title: string;
  tasks: TaskDto[];
}

export interface DayDto {
  id: string;
  day: string;
  sections: SectionDto[];
}

const getDayById = async (_: string, dayId: string) => {
  const { data } = await axios.get<DayDto>(`/api/days/${dayId}`);
  return data;
};

export default function useDay(dayId?: string) {
  return useQuery(dayId ? ['days', dayId] : null, getDayById);
}
