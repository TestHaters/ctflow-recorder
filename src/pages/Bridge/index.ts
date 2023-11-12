// https://codesandbox.io/s/silly-lamport-326fy3?file=/src/App.js
console.log(' Init BRIDGE ');
// Let's make this bridge is a routing of messages between the page and the background script.

function originFromWebapp(origin: string) {
  const originURL = new URL(origin);
  return (
    originURL.hostname === 'localhost' ||
    originURL.hostname === 'deploysentinel.com' ||
    originURL.hostname.indexOf('.deploysentinel.com') > -1
  );
}

window.addEventListener('message', (event) => {
  console.log('Page Bridge: Message received from page', event);

  const data = event?.data ?? {};
  console.log('fffdata', data);
  console.log(data?.source === 'control-bar' && data?.type === 'run-task');
  if (
    data?.source === 'deploysentinel-test-editor' &&
    data?.type === 'start-recording' &&
    originFromWebapp(event.origin)
  ) {
    chrome.runtime.sendMessage({ url: data?.url, type: 'start-recording' });
  }

  if (
    data?.source === 'deploysentinel-test-editor' &&
    data?.type === 'ping' &&
    originFromWebapp(event.origin)
  ) {
    window.postMessage({
      source: 'deploysentinel-recorder',
      type: 'pong',
    });
  }

  if (data?.source === 'control-bar' && data?.type === 'run-task') {
    // is this the way we resonpond to the control bar?
    window.postMessage({
      source: 'bridge',
      type: 'start-running-task',
      extra_data: data,
    });
  }
});

chrome.runtime.onMessage.addListener(async function (request) {
  if (request?.type === 'playwright-test-recording') {
    window.postMessage({
      source: 'deploysentinel-recorder',
      type: 'playwright-test-recording',
      code: request?.code,
      actions: request?.actions,
    });
  }
});
