import React, { useEffect, useState } from 'react';
import {
  firestoreDB,
  testFirestore,
  initTestDbOnFirestore,
  testFirestoreSync,
  addRecordingAction,
  setRecordingAction,
} from '../../helpers/firestore';

import { usePreferredLibrary, useRecordingState } from '../Common/hooks';
import { genCode } from '../builders';
import { ScriptType } from '../types';
import YAML from 'yaml';

const ConnectionPanel = () => {
  // testFirestore()
  // testFirestoreSync()

  // const [recordingTabId, actions] = useRecordingState();

  // useEffect(() => {
  //   if (actions.length > 0) {
  //     const ctflowCode = genCode(actions, true, ScriptType.Cypress);
  //     console.log(ctflowCode);
  //     const testData = YAML.parse(ctflowCode);
  //     console.log(testData);

  //     setRecordingAction(
  //       String(recordingTabId),
  //       Object.values(testData['nodes'] || []),
  //       Object.values(testData['edges'] || [])
  //     );
  //   }
  // }, [actions, recordingTabId]);

  return <></>;
};

export default ConnectionPanel;
