import React from 'react';
import { Meta } from '@storybook/react';
import { DeleteModal as DeleteModalComponent } from './delete-modal.component';

export const DeleteModal = (props) => <DeleteModalComponent {...props} />;

const meta: Meta = {
  title: 'Templates/Delete Modal',
  component: DeleteModalComponent,
  argTypes: {
    isLoading: { control: 'boolean' },
    error: { control: 'text' },
    headline: { control: 'text' },
    description: { control: 'text' },
    deleteInputLabel: { control: 'text' },
    cancelButtonLabel: { control: 'text' },
    confirmButtonLabel: { control: 'text' },
  },
  args: {
    closeModal: () => console.log('close'),
    onConfirmDelete: () => console.log('onDelete'),
    headline: 'headline',
    description: 'Do you really want to delete this resource ?',
    deleteInputLabel: 'Type TERMINATE to delete the resource',
    isLoading: false,
    cancelButtonLabel: 'Cancel',
    confirmButtonLabel: 'Delete',
    error: '',
  },
};

export default meta;