import React, { useState } from 'react';
import {
  useTargetCreateMutation,

} from '@umk-stat/statistic-client-relay';
import {
  DefaultButton, Dialog, DialogFooter, PrimaryButton,
  ContextualMenu, TextField, ITextFieldStyles, IDialogProps, Spinner,
} from '@fluentui/react';

export type CreateDialogTargetProps = {
  systemID: string,
} & IDialogProps;

export function CreateTargetDialog({ systemID, ...overProps }: CreateDialogTargetProps): JSX.Element {
  const [targetName, setTargetName] = useState('');
  const [commit, isInFlight] = useTargetCreateMutation();

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
          systemID,
        },
        onCompleted: (response) => {
          overProps.onDismiss?.();
          alert(`Новая цель ${response.createTarget.name} добавлена`);
        },
      },
      systemID,
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
          placeholder="Например, клип по кнопке «Оставить заявку»"
        />

        <DialogFooter>
          <PrimaryButton
            onClick={handleSubmit}
            disabled={isInFlight}
            onRenderIcon={
              () => (isInFlight ? <Spinner /> : <></>)
            }
            text="Создать цель"
          />
          <DefaultButton onClick={() => overProps.onDismiss} text="Отмена" />
        </DialogFooter>
      </Dialog>
    </>
  );
}
