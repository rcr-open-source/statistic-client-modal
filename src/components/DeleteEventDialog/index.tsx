import React, { useState } from 'react';
import {
  useDeleteEventMutation,
} from '@umk-stat/statistic-client-relay';
import {
  DefaultButton, Dialog, DialogFooter, PrimaryButton,
  ContextualMenu, IDialogProps, Spinner,
} from '@fluentui/react';

export type DeleteEventDialogProps = {
  eventId: string,
  targetId: string,
  eventName: string,
} & IDialogProps;

export function DeleteEventDialog({
  eventId,
  targetId,
  eventName,
  ...overProps
}: DeleteEventDialogProps) {
  const [commit, isInFlight] = useDeleteEventMutation();

  const modalPropsStyles = { main: { maxWidth: 450 } };

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

  const handleDelete = () => {
    overProps.onDismiss?.();
    commit(
      {
        variables: {
          id: eventId,
        },
        onCompleted: () => {
          alert(`Событие ${eventName} удалено`);
        },
        onError: (error: any) => {
          alert(error);
        },
      },
      targetId,
    );
  };

  return (
    <>
      <Dialog
        {...dialogProps}
      >
        <DialogFooter>
          <PrimaryButton
            text="Да"
            onClick={handleDelete}
            disabled={isInFlight}
            onRenderIcon={
              () => (isInFlight ? <Spinner /> : <></>)
            }
          />
          <DefaultButton onClick={() => overProps.onDismiss} text="Отмена" />
        </DialogFooter>
      </Dialog>
    </>
  );
}
