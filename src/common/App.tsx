import { Box, ChakraProvider, Heading, HStack } from '@chakra-ui/react';
import React from 'react';
import { useAppState } from '../state/store';
import ModelDropdown from './ModelDropdown';
import SetAPIKey from './SetAPIKey';
import TaskUI from './TaskUI';
import OptionsDropdown from './OptionsDropdown';
import logo from '../assets/img/icon-128.png';

const App = () => {
  const openAIKey = useAppState((state) => state.settings.openAIKey);

  console.log('render ctflow ai from panel', openAIKey);
  // return <h1> CTFLOW AI </h1>;
  return (
    <ChakraProvider>
      <Box p="8" fontSize="lg" w="full">
        <HStack mb={4} alignItems="center">
          <img
            src={logo}
            width={32}
            height={32}
            className="App-logo"
            alt="logo"
          />

          <Heading as="h1" size="lg" flex={1}>
            CTFlow AI
          </Heading>
          <h1>
            Common/App.ts: I need your love tonight, I want to hold you tight
          </h1>
          <HStack spacing={2}>
            <ModelDropdown />
            <OptionsDropdown />
          </HStack>
        </HStack>
      </Box>
    </ChakraProvider>
  );
};

export default App;
