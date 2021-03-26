import React, { useState } from 'react';
import {
  useCreateEventMutation,
} from '@umk-stat/statistic-client-relay';
import {
  DefaultButton, Dialog, DialogFooter, PrimaryButton,
  ContextualMenu, TextField, ITextFieldStyles, IDialogProps, Spinner,
} from '@fluentui/react';
import { ValidationError } from 'sequelize';

export type CreateEventDialogProps = {
  targetId: string,
} & IDialogProps;

export function CreateEventDialog({ targetId, ...overProps }: CreateEventDialogProps): JSX.Element {
  const [targetName, setTargetName] = useState('');
  const [commit, isInFlight] = useCreateEventMutation();

  const modalPropsStyles = { main: { maxWidth: 450 } };
  const textFieldStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 300 } };

  const dragOptions = {
    moveMenuItemText: 'Move',
    closeMenuItemText: 'Close',
    menu: ContextualMenu,
  };

  const dialogProps: IDialogProps = {
    ...overProps,
    modalProps: {
      ...overProps.modalProps,
      dragOptions,
    },
    isBlocking: true,
    styles: modalPropsStyles,
  };

  const handleChange = React.useCallback(
    (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
      setTargetName(newValue || '');
    },
    [],
  );

  const handleSubmit = () => {
    commit(
      {
        variables: {
          name: targetName,
          targetID: targetId,
        },
        onCompleted: (response) => {
          overProps.onDismiss?.();
          alert(`Новое событие ${response.createEvent.name} добавлено`);
        },
        onError: (error: any) => {
          alert('Такое имя уже существует');
        },
      },
      targetId,
    );

    setTargetName('');
  };

  return (
    <>
      <Dialog
        {...dialogProps}
      >
        <TextField
          label="Название"
          value={targetName}
          onChange={handleChange}
          styles={textFieldStyles}
          placeholder="Например, «Нажатие по кнопке»"
        />

        <DialogFooter>
          <PrimaryButton
            onClick={handleSubmit}
            disabled={isInFlight}
            onRenderIcon={
              () => (isInFlight ? <Spinner /> : <></>)
            }
            text="Создать событие"
          />
          <DefaultButton onClick={() => overProps.onDismiss} text="Отмена" />
        </DialogFooter>
      </Dialog>
    </>
  );
}
