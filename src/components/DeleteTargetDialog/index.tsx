import React, { useState } from 'react';
import {
  useDeleteTargetMutation,
} from '@umk-stat/statistic-client-relay';
import {
  DefaultButton, Dialog, DialogFooter, PrimaryButton,
  ContextualMenu, IDialogProps, Spinner,
} from '@fluentui/react';

export type DeleteDialogTargetProps = {
  targetId: string,
  systemId: string,
  targetName: string,
} & IDialogProps;

export function DeleteTargetDialog({
  targetId,
  systemId,
  targetName,
  ...overProps
}: DeleteDialogTargetProps) {
  const [commit, isInFlight] = useDeleteTargetMutation();

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
          id: targetId,
        },
        onCompleted: () => {
          alert(`Цель ${targetName} удалена`);
        },
        onError: (error) => {
          alert(error);
        },
      },
      systemId,
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
