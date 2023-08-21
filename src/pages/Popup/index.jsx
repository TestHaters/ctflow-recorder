// import React from 'react';
// import { render } from 'react-dom';
import { createRoot } from 'react-dom/client';
import Popup from './Popup';
// import IndexStyle from './index.css';
// import CommonStyle from '../Common/styles.css';
// import FaStyle from '@fortawesome/fontawesome-svg-core/styles.css';

// render(
//   <>
//     <style>
//       {FaStyle}
//       {CommonStyle}
//       {IndexStyle}
//     </style>
//     <Popup />
//   </>,
//   window.document.querySelector('#app-container')
// );

// https://react.dev/blog/2022/03/08/react-18-upgrade-guide#updates-to-client-rendering-apis

// const container = document.querySelector('#app-container');
// const root = createRoot(container);
// root.render(
//   <>
//     <style>
//       {FaStyle}
//       {CommonStyle}
//       {IndexStyle}
//     </style>
//     <Popup />
//   </>
// );

// https://codesandbox.io/s/ctflow-chakra-ui-7grl2y?file=/theme.ts:0-84
import React from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
export const theme = extendTheme({});

const container = document.querySelector('#app-container');
const root = createRoot(container);
root.render(
  <>
    <ChakraProvider theme={theme}>
      <Popup />
    </ChakraProvider>
  </>
);

if (module.hot) module.hot.accept();
