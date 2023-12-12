import { Button, HStack, Icon } from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { useAppState } from '../state/store';
import { BsPlayFill, BsStopFill } from 'react-icons/bs';

export default function RunTaskButton(props: { runTask: () => void }) {
  const state = useAppState((state) => ({
    taskState: state.currentTask.status,
    instructions: state.ui.instructions,
    interruptTask: state.currentTask.actions.interrupt,
  }));

  const [lastTriggerAITaskAt, setLastTriggerAITaskAt] =
    React.useState<number>();
  const onRunTask = props.runTask;

  console.log('HEY FROM RUN TASK BUTTON');

  if (chrome.debugger !== undefined) {
    console.log('add listener to RUNT TASK BUTTON only');
    chrome.runtime.onMessage.addListener(async function (
      request,
      sender,
      sendResponse
    ) {
      console.log(
        'RUN TASK BTN:Message received from RUNT TASK BUTTON index.ts',
        request
      );
      onRunTask();
      // const [lastTriggerAITaskAt, setLastTriggerAITaskAt] = React.useState<number>();
    });
  }

  React.useEffect(() => {
    if (lastTriggerAITaskAt === undefined) {
      return;
    }

    console.log(lastTriggerAITaskAt, 'RUN TASK BUTTON - CHANGE AND TRIGGER');
    console.log('chrome.debugger', chrome.debugger);

    if (chrome.debugger === undefined) {
      console.log('trigger chrome runtime message');
      chrome.runtime.sendMessage({
        source: 'control-bar',
        type: 'run-task',
      });
    } else if (lastTriggerAITaskAt) {
      onRunTask();
    }
  }, [lastTriggerAITaskAt]);

  let button = (
    <Button
      rightIcon={<Icon as={BsPlayFill} boxSize={6} />}
      //onClick={props.runTask}
      onClick={() => setLastTriggerAITaskAt(Date.now())}
      colorScheme="green"
      disabled={state.taskState === 'running' || !state.instructions}
    >
      Start Task
    </Button>
  );

  if (state.taskState === 'running') {
    button = (
      <Button
        rightIcon={<Icon as={BsStopFill} boxSize={6} />}
        onClick={state.interruptTask}
        colorScheme="red"
      >
        Stop
      </Button>
    );
  }

  return <HStack alignItems="center">{button}</HStack>;
}
