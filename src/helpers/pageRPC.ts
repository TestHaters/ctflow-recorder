import getAnnotatedDOM, {
  getUniqueElementSelectorId,
} from '../pages/Content/getAnnotatedDOM';
import { copyToClipboard } from '../pages/Content/copyToClipboard';

import ripple from '../pages/Content/ripple';
import { sleep } from './utils';

export const rpcMethods = {
  getAnnotatedDOM,
  getUniqueElementSelectorId,
  ripple,
  copyToClipboard,
} as const;

export type RPCMethods = typeof rpcMethods;
type MethodName = keyof RPCMethods;
type Payload<T extends MethodName> = Parameters<RPCMethods[T]>;
type MethodRT<T extends MethodName> = ReturnType<RPCMethods[T]>;

// Call this function from the content script
export const callRPC = async <T extends MethodName>(
  type: keyof typeof rpcMethods,
  payload?: Payload<T>,
  maxTries = 10
): Promise<MethodRT<T>> => {
  console.log('Start callRPC');

  const url = new URL(window.location.href);
  let tabId = Number(url.searchParams.get('tabId'));

  if (!tabId) {
    let queryOptions = { active: true, currentWindow: true };
    let activeTab = (await chrome.tabs.query(queryOptions))[0];

    // If the active tab is a chrome-extension:// page, then we need to get some random other tab for testing
    if (activeTab.url?.startsWith('chrome')) {
      queryOptions = { active: false, currentWindow: true };
      activeTab = (await chrome.tabs.query(queryOptions))[0];
    }
    console.log('more detail');

    if (!activeTab?.id) throw new Error('callRPC: No active tab found');
    tabId = activeTab.id;
  }

  let err: any;
  for (let i = 0; i < maxTries; i++) {
    try {
      console.log('tried to send message to content script', i);
      const response = await chrome.tabs.sendMessage(tabId, {
        type,
        payload: payload || [],
      });

      console.log('response', response);
      return response;
    } catch (e) {
      console.log('RPC error', e);
      if (i === maxTries - 1) {
        // Last try, throw the error
        err = e;
      } else {
        // Content script may not have loaded, retry
        console.error(e);
        await sleep(1000);
      }
    }
  }
  throw err;
};

const isKnownMethodName = (type: string): type is MethodName => {
  return type in rpcMethods;
};

// This function should run in the content script
export const watchForRPCRequests = () => {
  chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse): true | undefined => {
      const type = message.type;
      if (isKnownMethodName(type)) {
        // @ts-expect-error we need to type payload
        const resp = rpcMethods[type](...message.payload);
        if (resp instanceof Promise) {
          resp.then((resolvedResp) => {
            sendResponse(resolvedResp);
          });

          return true;
        } else {
          sendResponse(resp);
        }
      }
    }
  );
};
