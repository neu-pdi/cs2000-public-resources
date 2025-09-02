import React from 'react';
import Layout from '@theme/Layout';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';

/*
import { useState, useEffect } from 'react';
import {
  Button,
  Alert,
  Table,
  HStack,
  Code,
  Spinner,
} from '@chakra-ui/react';

interface CsvRow {
  [key: string]: string;
}

export default function CsvTest() {
  const [csvData, setCsvData] = useState<CsvRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  // The Google Sheets CSV API URL
  const csvUrl =
    'https://docs.google.com/spreadsheets/d/1DKngiBfI2cGTVEazFEyXf7H4mhl8IU5yv2TfZWv6Rc8/gviz/tq?tqx=out:csv&sheet=Orig+Data';

  const parseCsv = (csvText: string): CsvRow[] => {
    const lines = csvText.trim().split('\n');
    if (lines.length === 0) return [];

    // Parse CSV with proper quote handling
    const parseRow = (row: string): string[] => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < row.length; i++) {
        const char = row[i];
        const nextChar = row[i + 1];

        if (char === '"') {
          if (inQuotes && nextChar === '"') {
            // Escaped quote
            current += '"';
            i++; // Skip next quote
          } else {
            // Toggle quote state
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          // End of field
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }

      // Add the last field
      result.push(current.trim());
      return result;
    };

    const headers = parseRow(lines[0]);
    const rows: CsvRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseRow(lines[i]);
      const row: CsvRow = {};

      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });

      rows.push(row);
    }

    return rows;
  };

  const fetchCsvData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(csvUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const csvText = await response.text();
      const parsedData = parseCsv(csvText);

      setCsvData(parsedData);
      setLastFetch(new Date());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on component mount
  useEffect(() => {
    fetchCsvData();
  }, []);

  const headers = csvData.length > 0 ? Object.keys(csvData[0]) : [];
  const nonEmptyHeaders = headers.filter(
    (header) =>
      header.trim() !== '' && csvData.some((row) => row[header]?.trim() !== ''),
  );

  return (
    <Layout title="CSV Test" description="Test loading CSV from Google Sheets">
      <Box p={6} maxW="1200px" mx="auto">
        <VStack spacing={6} align="stretch">
          <Box>
            <Heading size="xl" mb={4}>
              Google Sheets CSV API Test
            </Heading>
            <Text color="gray.600" mb={4}>
              Testing client-side CSV loading from Google Spreadsheet API
            </Text>
            <Code p={2} borderRadius="md" fontSize="sm" wordBreak="break-all">
              {csvUrl}
            </Code>
          </Box>

          <HStack>
            <Button
              onClick={fetchCsvData}
              isLoading={loading}
              loadingText="Fetching..."
              colorScheme="blue"
            >
              Refresh Data
            </Button>
            {lastFetch && (
              <Text fontSize="sm" color="gray.500">
                Last fetched: {lastFetch.toLocaleTimeString()}
              </Text>
            )}
          </HStack>

          {error && (
            <Alert.Root status="error">
              <Alert.Title>Error loading CSV data</Alert.Title>
              <Alert.Content>
                <Alert.Description>{error}</Alert.Description>
              </Alert.Content>
            </Alert.Root>
          )}

          {loading && (
            <Box textAlign="center" py={8}>
              <Spinner size="lg" />
              <Text mt={2}>Loading CSV data...</Text>
            </Box>
          )}

          {csvData.length > 0 && !loading && (
            <Box>
              <Heading size="md" mb={4}>
                Data Preview ({csvData.length} rows)
              </Heading>

              <Box
                overflowX="auto"
                border="1px"
                borderColor="gray.200"
                borderRadius="md"
              >
                <Table.Root size="sm">
                  <Table.Header>
                    <Table.Row>
                      {nonEmptyHeaders.map((header, index) => (
                        <Table.ColumnHeader key={index} whiteSpace="nowrap">
                          {header || `Column ${index + 1}`}
                        </Table.ColumnHeader>
                      ))}
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {csvData.slice(0, 10).map((row, rowIndex) => (
                      <Table.Row key={rowIndex}>
                        {nonEmptyHeaders.map((header, colIndex) => (
                          <Table.Cell
                            key={colIndex}
                            maxW="200px"
                            overflow="hidden"
                            textOverflow="ellipsis"
                          >
                            {row[header] || '—'}
                          </Table.Cell>
                        ))}
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Box>

              {csvData.length > 10 && (
                <Text fontSize="sm" color="gray.500" mt={2}>
                  Showing first 10 rows of {csvData.length} total rows
                </Text>
              )}
            </Box>
          )}

          {csvData.length === 0 && !loading && !error && (
            <Alert.Root status="info">
              <Alert.Title>No data</Alert.Title>
              <Alert.Content>
                <Alert.Description>
                  Click "Refresh Data" to load CSV data from the Google Sheet
                </Alert.Description>
              </Alert.Content>
            </Alert.Root>
          )}

          <Box>
            <Heading size="md" mb={2}>
              Technical Notes
            </Heading>
            <VStack align="stretch" spacing={2} fontSize="sm" color="gray.600">
              <Text>
                • This page fetches CSV data directly from Google Sheets using
                their CSV export API
              </Text>
              <Text>
                • The API endpoint returns CSV format when using{' '}
                <Code>tqx=out:csv</Code>
              </Text>
              <Text>
                • Data is parsed client-side with proper CSV quote handling
              </Text>
              <Text>
                • CORS should work since Google Sheets allows cross-origin
                requests for public sheets
              </Text>
              <Text>
                • For calendar data, you can modify the sheet parameter:{' '}
                <Code>&sheet=YourSheetName</Code>
              </Text>
            </VStack>
          </Box>
        </VStack>
      </Box>
    </Layout>
  );
}
*/

export default function OfficeHours() {
  return (
    <Layout
      title="Office Hours / Recitations"
      description="Office Hours and Recitation Schedule"
    >
      <Box p={6} maxW="1200px" mx="auto">
        <VStack spacing={8} align="center" py={16}>
          <Heading size="2xl" textAlign="center">
            Office Hours / Recitations
          </Heading>
          <Box textAlign="center">
            <Heading size="lg" color="gray.500" mb={4}>
              Coming Soon
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="md">
              Office hours and recitation schedules will be available here
              shortly. Please check back soon for the latest information.
            </Text>
          </Box>
        </VStack>
      </Box>
    </Layout>
  );
}
