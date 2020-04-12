import React, { useState } from 'react';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalTitle,
  Select,
} from '@binarycapsule/ui-capsules';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { FormHeading, Section } from '../../../components/modals/AddTask/AddTask.styles';
import CustomLabel from '../../../components/day/ScopeSelect/components/CustomLabel';
import { scopesOptionsSelector } from '../../../selectors/scopes/scopesSelectors';
import { ScopesModal } from './ScopesModal';
import { CreateTaskVariables, useCreateTask } from '../api/useCreateTask';

interface ScopeOption {
  value: string;
  label: string;
  shortCode: string;
}

interface FormValues {
  title: string;
  scope: ScopeOption | null;
}

const initialValues: FormValues = {
  title: '',
  scope: null,
};

interface Props {
  dayId: string;
  sectionId: string;
  onRequestClose(): void;
}

export const AddTaskModal: React.FC<Props> = ({ dayId, sectionId, onRequestClose }) => {
  const [isScopesModalOpen, setIsScopesModalOpen] = useState(false);

  const scopesOptions = useSelector(scopesOptionsSelector);

  const filterScopes = (
    { data: { label, shortCode } }: { data: { label: string; shortCode: string } },
    input: string,
  ) => {
    if (input) {
      return (
        label.toLowerCase().includes(input.toLowerCase()) ||
        shortCode.toLowerCase().includes(input.toLowerCase())
      );
    }
    return true;
  };

  const [createDay] = useCreateTask();

  const formik = useFormik({
    initialValues,
    // validationSchema,
    onSubmit: ({ title, scope }) => {
      const createTaskVariables: CreateTaskVariables = {
        dayId,
        sectionId,
        title,
        scopeId: scope ? scope.value : null,
      };

      createDay(createTaskVariables);
      onRequestClose();
    },
  });

  return (
    <>
      <Modal isOpen onRequestClose={onRequestClose} contentLabel="Modal - Add a new task">
        <form onSubmit={formik.handleSubmit}>
          <ModalBody>
            <Section>
              <ModalTitle>What will you be working on?</ModalTitle>
              <Input
                name="title"
                type="text"
                value={formik.values.title}
                placeholder="Task name"
                onChange={formik.handleChange}
                size="large"
                autoFocus
                error={formik.errors.title}
              />
            </Section>
            <FormHeading>Task scope</FormHeading>
            <Select
              isClearable
              value={formik.values.scope}
              options={scopesOptions}
              placeholder="No scope"
              onChange={formik.handleChange}
              formatOptionLabel={CustomLabel}
              menuPortalTarget={document.body}
              filterOption={filterScopes}
            />
            <Button onClick={() => setIsScopesModalOpen(true)} appearance="none" size="small">
              + Create new scope
            </Button>
          </ModalBody>
          <ModalFooter>
            <Button appearance="secondary" size="large" onClick={onRequestClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={false} appearance="primary" size="large">
              Add task
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {isScopesModalOpen && <ScopesModal />}
    </>
  );
};
