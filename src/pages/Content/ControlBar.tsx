import React, { useState, useEffect, useCallback } from 'react';

import ControlBarStyle from './ControlBar.css';

import CustomReactTabStyle from './CustomReactTabs.css';
import { useAppState } from '../../state/store';
import { useToast } from '@chakra-ui/react';

export default function ControlBar({ onExit }: { onExit: () => void }) {
  const state = useAppState((state) => ({
    taskHistory: state.currentTask.history,
    taskStatus: state.currentTask.status,
    runTask: state.currentTask.actions.runTask,
    instructions: state.ui.instructions,
    setInstructions: state.ui.actions.setInstructions,
  }));
  const [lastTriggerAITaskAt, setLastTriggerAITaskAt] = useState<number>();

  const toast = useToast();

  const toastError = useCallback(
    (message: string) => {
      toast({
        title: 'Error',
        description: message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
    [toast]
  );

  const onRunTask = () => {
    console.log('instructions', state.instructions);
    state.instructions && state.runTask(toastError);
  };

  useEffect(() => {
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
      console.log('onRunTask', onRunTask);
      onRunTask();
    } else if (lastTriggerAITaskAt) {
      onRunTask();
    }
  }, [lastTriggerAITaskAt]);

  return (
    <div>
      <style>{ControlBarStyle}</style>
      <style>{CustomReactTabStyle}</style>
      <button
        // onClick={() => setShowBar(true)}
        onClick={() => setLastTriggerAITaskAt(Date.now())}
        className="px-4 py-2 no-default rounded-md bg-common text-lg font-bold fixed bottom-1 right-1 "
      >
        🤖 CTFlow
      </button>
    </div>
  );
}
