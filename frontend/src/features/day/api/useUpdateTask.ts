import axios from 'axios';
import { queryCache, useMutation } from 'react-query';
import produce from 'immer';
import { Toaster } from '@binarycapsule/ui-capsules';
import { DayDto, TaskDto } from './useDay';

interface UpdateTaskBody {
  dayId: string;
  sectionId: string;
  payload: Partial<TaskDto>;
}

export interface UpdateTaskVariables {
  taskId: string;
  body: UpdateTaskBody;
}

const updateTask = async ({ taskId, body }: UpdateTaskVariables) => {
  const { data } = await axios.put<TaskDto>(`/api/tasks/${taskId}`, body);
  return data;
};

export const useUpdateTask = () => {
  return useMutation(updateTask, {
    onMutate: ({ taskId, body: { dayId, sectionId, payload } }) => {
      const previousDay = queryCache.getQueryData(['days', dayId]);

      queryCache.setQueryData(['days', dayId], (currentDay: DayDto) => {
        const sectionIndex = currentDay.sections.findIndex(({ id }) => id === sectionId);
        const taskIndex = currentDay.sections[sectionIndex]?.tasks.findIndex(
          ({ id }) => id === taskId,
        );

        if (sectionIndex > -1 && taskIndex > -1) {
          const task = currentDay.sections[sectionIndex].tasks[taskIndex];

          return produce(currentDay, draftState => {
            draftState.sections[sectionIndex].tasks[taskIndex] = { ...task, ...payload };
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
        message: 'Task was not updated',
      });
    },

    onSettled: (result, err, { body: { dayId } }) => queryCache.refetchQueries(['days', dayId]),
  });
};
