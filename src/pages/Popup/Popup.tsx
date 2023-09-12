import React, { useEffect, useState } from 'react';
import { onPageView, onNewRecording } from './analytics';
import CTFlowAI from '../../common/CTFlowAI';

import { Heading, Text, Box, Badge } from '@chakra-ui/react';

import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';

onPageView('/popup');

import RecordingPanel from './RecordingPanel';
import ConnectionPanel from './ConnectionPanel';

const Popup = () => {
  return (
    <div>
      <Box my="6">
        <Heading textAlign="center" size="xl">
          CTFLOW
        </Heading>
        <Text fontSize="xs" textAlign="center">
          Make end-2-end test no more hassle
        </Text>
      </Box>

      <Accordion allowMultiple>
        <AccordionItem>
          <h2>
            <AccordionButton
              _expanded={{ bg: 'green.200' }}
              backgroundColor="green.100"
            >
              <Box as="span" flex="1" textAlign="left">
                <Heading size="sm">
                  <span role="img" aria-label="AI">
                    {' '}
                    👽{' '}
                  </span>
                  <span> AI </span>
                  <Badge colorScheme="blue"> Running </Badge>{' '}
                  <span>
                    {' '}
                    <Badge colorScheme="green"> 32 </Badge>{' '}
                  </span>
                </Heading>
                <Text pt="2" fontSize="sm">
                  Enter `thientran@coderpush.com` as email
                </Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
            <CTFlowAI />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton
              _expanded={{ bg: 'green.300' }}
              backgroundColor="green.200"
            >
              <Box as="span" flex="1" textAlign="left">
                <Heading size="sm">
                  <span role="img" aria-label="Recorder">
                    {' '}
                    🎥{' '}
                  </span>
                  <span> Recorder </span>
                  <Badge colorScheme="blue"> Recording </Badge>{' '}
                  <span>
                    {' '}
                    <Badge colorScheme="green"> 32 </Badge>{' '}
                  </span>
                </Heading>
                <Text pt="2" fontSize="sm">
                  Enter `thientran@coderpush.com` as email
                </Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <RecordingPanel />
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton
              _expanded={{ bg: 'green.400' }}
              backgroundColor="green.300"
            >
              <Box as="span" flex="1" textAlign="left">
                <Heading size="sm">
                  <span role="img" aria-label="Settings">
                    {' '}
                    ⚙️{' '}
                  </span>
                  <span> Settings </span>
                </Heading>
                <Text pt="2" fontSize="sm">
                  Visual Code Connection: Active
                </Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
            <ConnectionPanel />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      {/* <Tabs
        isFitted
        align="center"
        size="md"
        variant="soft-rounded"
        colorScheme="green"
      >
        <TabList>
          <Tab> xAI 👽 </Tab>
          <Tab> Recorder 🎥 </Tab>
          <Tab> Settings ⚙️ </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <p>one!</p>
          </TabPanel>
          <TabPanel>
            <p>two!</p>
          </TabPanel>
          <TabPanel>
            <p>three!</p>
          </TabPanel>
        </TabPanels>
      </Tabs> */}
    </div>
  );
};

export default Popup;
