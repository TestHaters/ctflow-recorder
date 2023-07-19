import { Box, ChakraProvider, Heading, HStack } from '@chakra-ui/react';
import React from 'react';
// import { useAppState } from '../state/store';
import ModelDropdown from './ModelDropdown';
import SetAPIKey from './SetAPIKey';
import TaskUI from './TaskUI';
import OptionsDropdown from './OptionsDropdown';
import logo from '../assets/img/icon-128.png';
import type { Action } from '../pages/types';

const CTFlowAI = ({
  actions,
  onBack,
}: {
  actions: Action[];
  onBack: () => void;
}) => {
  // const openAIKey = useAppState((state) => state.settings.openAIKey);
  const openAIKey = true;

  // console.log("render ctflow ai from panel")
  return (
    <div>
      <h1> CTFLOW AI</h1>
      <TaskUI />
    </div>
  );
  // return (
  //   <ChakraProvider>
  //     <Box p="8" fontSize="lg" w="full">
  //       <HStack mb={4} alignItems="center">
  //         <img
  //           src={logo}
  //           width={32}
  //           height={32}
  //           className="App-logo"
  //           alt="logo"
  //         />

  //         <Heading as="h1" size="lg" flex={1}>
  //           CTFlow AI 11
  //         </Heading>
  //         <h1>
  //           Common/App.ts: I need your love tonight, I want to hold you tight
  //         </h1>
  //         <HStack spacing={2}>
  //           <ModelDropdown />
  //           <OptionsDropdown />
  //         </HStack>
  //       </HStack>
  //       {openAIKey ? <TaskUI /> : <SetAPIKey />}
  //     </Box>
  //   </ChakraProvider>
  // );
};

export default CTFlowAI;
