import React, { useState } from 'react';

import {
  EventsFragmentTypes,
  useEventsFragment,
} from '@umk-stat/statistic-client-relay';

import {
  Modal, DetailsList, Label, CheckboxVisibility,
  ContextualMenu, IModalProps, Spinner,
} from '@fluentui/react';

export type TargetEventsModalProps = {
  target: EventsFragmentTypes.EventsFragment$key,
} & IModalProps;

export function TargetEventsModal({ target, ...overProps }: TargetEventsModalProps): JSX.Element {
  const dragOptions = {
    moveMenuItemText: 'Move',
    closeMenuItemText: 'Close',
    menu: ContextualMenu,
  };

  const { events } = useEventsFragment(target);

  const modalProps: IModalProps = {
    dragOptions,
    isBlocking: true,
    ...overProps,
  };

  return (
    <>
      <Modal
        {...modalProps}
      >
        {events.length
          ? (
            <DetailsList
              items={[...events]}
              checkboxVisibility={CheckboxVisibility.hidden}
              columns={[
                {
                  key: 'column1',
                  name: 'Название события',
                  className: 'CellId',
                  fieldName: 'event_name',
                  minWidth: 200,
                  maxWidth: 300,
                  data: 'string',
                  onRender: (item) => (<span>{item.name}</span>),
                },
                {
                  key: 'column2',
                  name: 'Выполнено',
                  className: 'CellId',
                  fieldName: 'event_done',
                  minWidth: 200,
                  maxWidth: 300,
                  data: 'string',
                  onRender: (item) => (<span>Нет</span>),
                },
              ]}
            />
          )
          : <Label>Событий для этой цели не назначено</Label>}
      </Modal>
    </>
  );
}
