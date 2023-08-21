import React, { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, ButtonGroup } from '@chakra-ui/react';

import {
  faSquare,
  faCircle,
  faInfoCircle,
  faCopy,
  faCheck,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';

import Logo from '../Common/Logo';
import CodeGen from '../Content/CodeGen';
import ActionList from '../Content/ActionList';
import { endRecording } from '../Common/endRecording';
import { genCode } from '../builders';
import {
  setStartRecordingStorage,
  getCurrentTab,
  executeScript,
  executeCleanUp,
  isCypressBrowser,
  getCypressAutFrame,
} from '../Common/utils';
import { usePreferredLibrary, useRecordingState } from '../Common/hooks';
import ScriptTypeSelect from '../Common/ScriptTypeSelect';

import type { Action } from '../types';
import { ActionsMode, ScriptType } from '../types';
import { onPageView, onNewRecording } from './analytics';

onPageView('/popup');

function LastStepPanel({
  actions,
  onBack,
}: {
  actions: Action[];
  onBack: () => void;
}) {
  const [preferredLibrary, setPreferredLibrary] = usePreferredLibrary();

  const [showActionsMode, setShowActionsMode] = useState<ActionsMode>(
    ActionsMode.Code
  );
  const [copyCodeConfirm, setCopyCodeConfirm] = useState<boolean>(false);

  const displayedScriptType = preferredLibrary ?? ScriptType.Cypress;

  return (
    <div>
      {/* <div>
        <span className="text-button text-sm" onClick={onBack}>
          <FontAwesomeIcon icon={faChevronLeft} /> Back
        </span>
      </div> */}
      <div className="d-flex justify-between mt-4 items-end text-sm">
        <Button>
          <span
            className="link-button"
            onClick={() => {
              setShowActionsMode(
                showActionsMode === ActionsMode.Actions
                  ? ActionsMode.Code
                  : ActionsMode.Actions
              );
            }}
          >
            Show{' '}
            {showActionsMode === ActionsMode.Actions
              ? 'Generated Code'
              : 'Actions'}
          </span>
        </Button>
      </div>
      {showActionsMode === ActionsMode.Code && (
        <div className="mt-4">
          <div className="d-flex justify-between items-end mb-4">
            <ScriptTypeSelect
              onChange={(val) => setPreferredLibrary(val)}
              value={displayedScriptType}
            />
            <CopyToClipboard
              text={genCode(actions, true, displayedScriptType)}
              onCopy={() => {
                setCopyCodeConfirm(true);
                setTimeout(() => {
                  setCopyCodeConfirm(false);
                }, 2000);
              }}
            >
              <Button
                className={`text-sm link-button ${
                  copyCodeConfirm ? 'text-green' : ''
                }`}
              >
                <FontAwesomeIcon
                  icon={copyCodeConfirm ? faCheck : faCopy}
                  size="sm"
                />{' '}
                Copy Code
              </Button>
            </CopyToClipboard>
          </div>
          <CodeGen
            actions={actions}
            library={displayedScriptType}
            styles={{ height: 400 }}
          />
        </div>
      )}
      {showActionsMode === ActionsMode.Actions && (
        <div className="mt-4">
          <ActionList actions={actions} />
        </div>
      )}
    </div>
  );
}

const RecordingPanel = () => {
  const [preferredLibrary, setPreferredLibrary] = usePreferredLibrary();

  const [recordingTabId, actions] = useRecordingState();

  const [currentTabId, setCurrentTabId] = useState<number | null>(null);

  const [isShowingLastTest, setIsShowingLastTest] = useState<boolean>(false);

  const [showBetaCTA, setShowBetaCTA] = useState<boolean>(
    localStorage.getItem('showBetaCta') !== 'false'
  );

  useEffect(() => {
    getCurrentTab().then((tab) => {
      const { id } = tab;
      setCurrentTabId(id ?? null);
    });
  }, []);

  // Sets Cypress as default library if we're in the Cypress test browser
  useEffect(() => {
    (async () => {
      const currentTab = await getCurrentTab();
      const tabId = currentTab.id;
      if (tabId == undefined) {
        return;
      }
      const isCypress = await isCypressBrowser(tabId);
      if (isCypress) {
        setPreferredLibrary(ScriptType.Cypress);
      }
    })();
  }, []);

  const onRecordNewTestClick = async () => {
    onNewRecording(preferredLibrary ?? ScriptType.Cypress);

    const currentTab = await getCurrentTab();
    const tabId = currentTab.id;

    if (tabId == null) {
      throw new Error('No tab id found');
    }

    const isCypress = await isCypressBrowser(tabId);
    if (isCypress) {
      const autFrame = await getCypressAutFrame(tabId);
      if (autFrame == null) {
        throw new Error('No AUT frame found');
      }

      const frameId = autFrame.frameId;
      const frameUrl = autFrame.url;

      setStartRecordingStorage(tabId, frameId, frameUrl);
      await executeCleanUp(tabId, frameId);
      await executeScript(tabId, frameId, 'contentScript.bundle.js');
    } else {
      setStartRecordingStorage(tabId, 0, currentTab.url || '');
      await executeCleanUp(tabId, 0);
      await executeScript(tabId, 0, 'contentScript.bundle.js');
    }

    window.close();
  };

  const activePage =
    recordingTabId != null
      ? 'recording'
      : isShowingLastTest
      ? 'lastTest'
      : 'home';

  const isRecordingCurrentTab = currentTabId === recordingTabId;

  return (
    <>
      <div className="Popup">
        {activePage === 'recording' && (
          // {(
          <>
            <Logo />
            <div className="text-center" style={{ marginTop: '2em' }}>
              <div className="text-xl text-red">
                Currently Recording
                {isRecordingCurrentTab ? ' Test...' : ' on Another Tab'}
              </div>
              {!isRecordingCurrentTab && recordingTabId != null && (
                <div className="mt-4">
                  <span
                    className="link-button"
                    onClick={() => {
                      chrome.tabs.update(recordingTabId, { active: true });
                      window.close();
                    }}
                  >
                    Go To Active Recording Tab
                  </span>
                </div>
              )}
              <Button
                className="btn-primary-outline m-4"
                style={{ marginTop: '2em' }}
                onClick={() => endRecording()}
                data-testid="end-test-recording"
              >
                <FontAwesomeIcon className="mr-1" icon={faSquare} />
                &nbsp; End Test Recording
              </Button>
            </div>
          </>
        )}
        {activePage === 'home' && (
          // {(
          <>
            <div className="d-flex justify-between items-center">
              <Logo />
            </div>
            <div className="text-center mt-12">
              <Button
                className="btn-primary mt-8"
                onClick={() => onRecordNewTestClick()}
                data-testid="record-new-test"
              >
                <FontAwesomeIcon
                  className="mr-1"
                  style={{ color: '#EA4240' }}
                  icon={faCircle}
                />
                &nbsp; Start Recording from Current Tab
              </Button>

              {showBetaCTA &&
                (preferredLibrary === ScriptType.Cypress ||
                  preferredLibrary == null) && (
                  <div
                    style={{ background: '#21272e' }}
                    className="rounded p-3 text-left mt-12"
                  >
                    <div className="fw-bold">
                      <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                      Fix Flaky Cypress Tests w/ DeploySentinel
                    </div>
                    <div className="mt-4" style={{ lineHeight: '1.5rem' }}>
                      Save time debugging test failures & flakes using DOM,
                      network, and console events captured while running in CI.
                    </div>
                    <div className="mt-4">
                      <a
                        href="https://deploysentinel.com?utm_source=rcd&utm_medium=bnr"
                        target="_blank"
                        className="link-button text-decoration-none fw-bold mr-5"
                      >
                        Learn More
                      </a>
                      <span
                        className="text-button text-grey"
                        onClick={() => {
                          localStorage?.setItem('showBetaCta', 'false');
                          setShowBetaCTA(false);
                        }}
                        data-testid="view-last-test"
                      >
                        No Thanks
                      </span>
                    </div>
                  </div>
                )}
            </div>
          </>
        )}

        {/* {(true || (activePage === 'lastTest')) && ( */}
        <LastStepPanel
          actions={actions}
          onBack={() => {
            setIsShowingLastTest(false);
          }}
        />
        {/* )} */}
      </div>
    </>
  );
};

export default RecordingPanel;
