import React, { useEffect, useState } from 'react';
import { setRecordingAction } from '../../helpers/firestore';
import { callRPC } from '../../helpers/pageRPC';
import { getSimplifiedDom } from '../../helpers/simplifyDom';
import { callDOMAction } from '../../helpers/domActions';
import { setAIRecord } from '../../helpers/firestore';
import { v4 as uuidv4 } from 'uuid';

const AIPanel = () => {
  const [currentHTML, setCurrentHTML] = useState('');
  const [simplifiedDom, setSimplifiedDom] = useState('');
  const [aIRecordId, setAIRecordId] = useState(uuidv4());

  const updateCurrentHTML = async () => {
    const fullDom = await callRPC('getAnnotatedDOM', [], 3);
    setCurrentHTML(String(fullDom));
  };

  const updateSimplifiedDom = async () => {
    const simplifiedDom = await getSimplifiedDom();
    setSimplifiedDom(String(simplifiedDom?.innerHTML));
  };

  useEffect(() => {
    updateCurrentHTML();
    updateSimplifiedDom();
  }, []);

  useEffect(() => {
    console.log('update AI Record on Firebase');
    setAIRecord(aIRecordId, 'currentHTML', simplifiedDom);
  }, [aIRecordId, currentHTML, simplifiedDom]);

  // after the action is determined, perform the action on the browser.
  const sampleCodeToCallActions = async (action: any) => {
    if (
      action === null ||
      action.parsedAction.name === 'finish' ||
      action.parsedAction.name === 'fail'
    ) {
      return;
    }

    if (action.parsedAction.name === 'click') {
      await callDOMAction('click', action.parsedAction.args);
    } else if (action.parsedAction.name === 'setValue') {
      await callDOMAction(action?.parsedAction.name, action?.parsedAction.args);
    }
  };

  return (
    <div>
      <p> {aIRecordId} </p>
      <h1> FULL DOM </h1>
      <pre>
        <code>{currentHTML}</code>
      </pre>

      <hr />

      <h1> Simplified DOM </h1>

      <pre>{simplifiedDom}</pre>
    </div>
  );
};

export default AIPanel;
