import { Box, ChakraProvider, Heading, HStack } from '@chakra-ui/react';
import React from 'react';
import { useAppState } from '../state/store';
import ModelDropdown from './ModelDropdown';
import SetAPIKey from './SetAPIKey';
import TaskUI from './TaskUI';
import OptionsDropdown from './OptionsDropdown';
import logo from '../assets/img/icon-128.png';
import type { Action } from '../pages/types';

const CTFlowAI = () => {
  const openAIKey = useAppState((state) => state.settings.openAIKey);
  // const openAIKey = false;

  // console.log("render ctflow ai from panel")
  // return (
  //   <div>
  //     <h1> CTFLOW AI</h1>
  //     <TaskUI />
  //   </div>
  // );
  return (
    <ChakraProvider>
      <Box p="8" fontSize="lg" w="full" h="400px" overflowY="scroll">
        <HStack mb={4} alignItems="center">
          <HStack spacing={2}>
            <ModelDropdown />
            <OptionsDropdown />
          </HStack>
        </HStack>
      </Box>
    </ChakraProvider>
  );
};

export default CTFlowAI;
