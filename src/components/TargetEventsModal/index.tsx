import React, { useState } from 'react';

import {
  EventsFragmentTypes,
  useEventsFragment,
} from '@umk-stat/statistic-client-relay';

import {
  Modal, DetailsList, Label, CheckboxVisibility,
  ContextualMenu, IModalProps, Spinner, FontWeights,
  IconButton, IIconProps, getTheme, mergeStyleSets,
  DialogType, ICommandBarItemProps, CommandBar,
  ICommandBarStyles,
} from '@fluentui/react';
import { DeleteEventDialog } from '../DeleteEventDialog';
import { CreateEventDialog } from '../CreateEventDialog';

export type TargetEventsModalProps = {
  target: EventsFragmentTypes.EventsFragment$key,
  targetId: string,
  targetName: string,
} & IModalProps;

export function TargetEventsModal({
  target, targetId, targetName, ...overProps
}: TargetEventsModalProps): JSX.Element {
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

  const cancelIcon: IIconProps = { iconName: 'Cancel' };

  const theme = getTheme();

  const iconButtonStyles = {
    root: {
      color: theme.palette.neutralPrimary,
      marginLeft: 'auto',
      marginTop: '4px',
      marginRight: '5px',
    },
    rootHovered: {
      color: theme.palette.neutralDark,
    },
  };

  const contentStyles = mergeStyleSets({
    container: {
      display: 'flex',
      flexFlow: 'column nowrap',
      alignItems: 'stretch',
    },
    header: [
      theme.fonts.xLargePlus,
      {
        flex: '1 1 auto',
        borderTop: `4px solid ${theme.palette.themePrimary}`,
        color: theme.palette.neutralPrimary,
        display: 'flex',
        alignItems: 'center',
        fontWeight: FontWeights.semibold,
        padding: '12px 12px 14px 24px',
      },
    ],
  });

  const [modalHidden, setModalHidden] = useState(true);
  const [dialogHidden, setDialogHidden] = useState(true);
  const [removableEvent, setRemovableEvent] = useState<{ id: string, name: string }>();

  const dialogModalProps = {
    type: DialogType.normal,
    title: `Удалить событие «${removableEvent?.name}» для цели «${targetName}»?`,
  };

  const dialogContentProps = {
    type: DialogType.normal,
    title: 'Добавить событие',
  };

  const items: ICommandBarItemProps[] = [
    {
      key: 'createEvent', text: 'Добавить событие', onClick: () => setDialogHidden(false), iconProps: { iconName: 'Edit' },
    },
  ];

  const commandBarStyles: ICommandBarStyles = {
    root: {
      border: '1px solid #eee',
      marginLeft: '-29px',
      paddingLeft: '29px',
    },
  };

  const EventCommandBar = () => (
    <>
      <CommandBar
        items={items}
        styles={commandBarStyles}
      />
      <CreateEventDialog
        dialogContentProps={dialogContentProps}
        hidden={dialogHidden}
        onDismiss={() => setDialogHidden(true)}
        targetId={targetId}
      />
    </>
  );

  return (
    <>
      <Modal
        {...modalProps}
      >
        <div className={contentStyles.header}>
          <span>{`События для цели «${targetName}»`}</span>
          <IconButton
            styles={iconButtonStyles}
            iconProps={cancelIcon}
            ariaLabel="Close popup modal"
            onClick={() => overProps.onDismiss?.()}
          />
        </div>
        {events.length
          ? (
            <>
              <EventCommandBar />
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
                  {
                    key: 'column3',
                    name: '',
                    className: 'CellId',
                    fieldName: 'event_delete',
                    minWidth: 50,
                    maxWidth: 100,
                    data: 'string',
                    onRender: (item: EventsFragmentTypes.EventsFragment['events'][0]) => (
                      <div>
                        <IconButton
                          iconProps={
                            { iconName: 'Delete' }
                          }
                          title="Удалить событие"
                          onClick={() => {
                            setRemovableEvent({ id: item.id, name: item.name });
                            setModalHidden(false);
                          }}
                        />
                      </div>
                    ),
                  },
                ]}
              />
            </>
          )
          : (
            <>
              <Label styles={{ root: { margin: '10px' } }}>
                Событий для этой цели не назначено
              </Label>
              <EventCommandBar />
            </>
          )}
        {removableEvent && (
          <DeleteEventDialog
            dialogContentProps={dialogModalProps}
            hidden={modalHidden}
            onDismiss={() => {
              setModalHidden(true);
              setRemovableEvent(undefined);
            }}
            eventId={removableEvent.id}
            targetId={targetId}
            eventName={removableEvent.name}
          />
        )}
      </Modal>
    </>
  );
}
