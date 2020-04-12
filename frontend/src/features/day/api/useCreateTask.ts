import axios from 'axios';
import { queryCache, useMutation } from 'react-query';
import produce from 'immer';
import { Toaster } from '@binarycapsule/ui-capsules';
import { DayDto, TaskDto } from './useDay';

interface CreateTaskBody {
  dayId: string;
  sectionId: string;
  payload: {
    title: string;
    notes: string;
    time: number;
    start: number | null;
    completed: boolean;
    scopeId: string | null;
  };
}

export interface CreateTaskVariables {
  dayId: string;
  sectionId: string;
  title: string;
  scopeId: string | null;
}

const getNewTask = (title: string, scopeId: string | null): Omit<TaskDto, 'id'> => ({
  title,
  time: 0,
  start: null,
  scopeId,
  notes: '',
  completed: false,
});

const createTask = async ({ dayId, sectionId, title, scopeId }: CreateTaskVariables) => {
  const body: CreateTaskBody = {
    dayId,
    sectionId,
    payload: getNewTask(title, scopeId),
  };
  const { data } = await axios.post<TaskDto>('/api/tasks', body);
  return data;
};

export const useCreateTask = () => {
  return useMutation(createTask, {
    onMutate: ({ dayId, sectionId, title, scopeId }) => {
      const previousDay = queryCache.getQueryData(['days', dayId]);

      queryCache.setQueryData(['days', dayId], (currentDay: DayDto) => {
        const sectionIndex = currentDay.sections.findIndex(({ id }) => id === sectionId);

        if (sectionIndex > -1) {
          return produce(currentDay, draftState => {
            draftState.sections[sectionIndex].tasks.push({
              ...getNewTask(title, scopeId),
              id: Date.now().toString(),
            });
          });
        }

        return currentDay;
      });

      return () => queryCache.setQueryData(['days', dayId], previousDay);
    },

    onError: (err, newTodo, rollback) => {
      if (typeof rollback === 'function') {
        rollback();
      }

      Toaster.error({
        title: 'Oops, something went wrong',
        message: 'Task was not created',
      });
    },

    onSettled: (result, err, { dayId }) => queryCache.refetchQueries(['days', dayId]),
  });
};
