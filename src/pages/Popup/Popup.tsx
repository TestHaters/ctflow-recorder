import React, { useEffect, useState } from 'react';
import { onPageView, onNewRecording } from './analytics';
import CTFlowAI from '../../common/CTFlowAI';
import { callRPC } from '../../helpers/pageRPC';

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
import AIPanel from './AIPanel';

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
        {/* AI PANEL */}
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
            This is the way you work with it
            <AIPanel></AIPanel>
            <CTFlowAI />
          </AccordionPanel>
        </AccordionItem>

        {/* RECORDING PANEL */}
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
        {/* END OF RECORDING PANEL */}

        {/* SETTINGS PANEL */}
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
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sequi, sit
            nemo est nulla ex esse quia reiciendis dolorem doloribus. Soluta
            aperiam modi nobis voluptates facere corrupti? Atque, quam eaque?
            Laboriosam?
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
