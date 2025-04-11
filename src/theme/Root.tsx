import * as React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { createSystem } from '@chakra-ui/react';
import { defaultConfig } from '@chakra-ui/react';
import { ColorModeProvider } from '../components/ui/color-mode';

const system = createSystem(defaultConfig, {
  cssVarsPrefix: 'embedded-chakra',
  cssVarsRoot: '#chakra-root',
})

export default function Root({ children }) {
  return (
    <div id="chakra-root">
      <ChakraProvider value={system}>
        <ColorModeProvider>
          {children}
        </ColorModeProvider>
      </ChakraProvider>
    </div>
  );
}