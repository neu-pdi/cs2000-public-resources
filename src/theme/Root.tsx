import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react';
import { ColorModeProvider } from '../components/ui/color-mode';

const system = createSystem(defaultConfig, {
  cssVarsPrefix: 'embedded-chakra',
});

export default function Root({ children }) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider>{children}</ColorModeProvider>
    </ChakraProvider>
  );
}
