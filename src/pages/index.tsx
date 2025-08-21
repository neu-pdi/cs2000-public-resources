import Layout from '@theme/Layout';

import { GlobalPluginData } from '@docusaurus/plugin-content-docs/client';
import { usePluginData } from '@docusaurus/useGlobalData';
import DaySummary from '../components/DaySummary';
import { Alert, Box, Heading, Text } from '@chakra-ui/react';
import { Blockquote } from '@chakra-ui/react';
import { Highlight } from 'prism-react-renderer';
import { LuConstruction } from 'react-icons/lu';

export default function Hello() {
  const pluginData = usePluginData(
    'docusaurus-plugin-content-docs',
  ) as GlobalPluginData;
  return (
    <Layout title="Course Overview" description="CS 2000 Course Overview">
      <Box p={4}>
        <Heading size="xl">
          CS 2000: Introduction to Program Design and Implementation
        </Heading>
        <Blockquote.Root>
          <Blockquote.Content>
            Introduces computer science and data science to students with no
            programming experience. Starts by building programs with numbers,
            text, and images, then moves to exploring real, complex data sets
            both interactively and through coding. Students then practice coding
            using a popular industrial language with a professional programmer’s
            interface to the code. Students learn to identify and respond to
            ethical challenges in program design. 
          </Blockquote.Content>
        </Blockquote.Root>
        <Alert.Root status="warning">
          <Alert.Indicator>
            <LuConstruction />
          </Alert.Indicator>
          <Alert.Title>Draft Content</Alert.Title>
          <Alert.Content>
            <Alert.Description>
              This content is a work in progress.
            </Alert.Description>
          </Alert.Content>
        </Alert.Root>
        <Heading size="lg">Day Overview</Heading>
        <DaySummary version={pluginData.versions[0].name} />
      </Box>
    </Layout>
  );
}
