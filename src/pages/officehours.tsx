import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Alert,
  Table,
  Code,
  Spinner,
  Grid,
  GridItem,
  Card,
  Badge,
} from '@chakra-ui/react';

interface CsvRow {
  [key: string]: string;
}

interface OfficeHoursSlot {
  time: string;
  ta1?: string;
  ta2?: string;
  room?: string;
  allTAs?: string[]; // For in-person with up to 4 TAs
}

interface DaySchedule {
  day: string;
  slots: OfficeHoursSlot[];
  rooms?: { timeRange: string; room: string }[]; // For in-person with multiple rooms per day
}

export default function OfficeHours() {
  const [onlineCsvData, setOnlineCsvData] = useState<string[][]>([]);
  const [inPersonCsvData, setInPersonCsvData] = useState<string[][]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  const [onlineSchedule, setOnlineSchedule] = useState<DaySchedule[]>([]);
  const [inPersonSchedule, setInPersonSchedule] = useState<DaySchedule[]>([]);
  const [showOaklandTime, setShowOaklandTime] = useState(false);

  // The Google Sheets CSV API URL for Online Office Hours
  const onlineOfficeHoursCsvUrl =
    'https://docs.google.com/spreadsheets/d/19V2RxXUrOb0ORGk6eNzw_Qp0O3bAylI6adsw_qNxjUw/gviz/tq?tqx=out:csv&sheet=Online+Office+Hours';

  const inPersonOfficeHoursCsvUrl =
    'https://docs.google.com/spreadsheets/d/19V2RxXUrOb0ORGk6eNzw_Qp0O3bAylI6adsw_qNxjUw/gviz/tq?tqx=out:csv&sheet=In+Person+Office+Hours';

  const parseCsv = (csvText: string): string[][] => {
    const lines = csvText.trim().split('\n');
    if (lines.length === 0) return [];

    // Parse CSV with proper quote handling - return as array of arrays instead of objects
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

    // Return all rows as arrays (skip header row since it's problematic)
    const rows: string[][] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = parseRow(lines[i]);
      rows.push(values);
    }

    return rows;
  };

  const parseOnlineOfficeHours = (data: string[][]): DaySchedule[] => {
    const schedule: DaySchedule[] = [];
    let currentDay: DaySchedule | null = null;

    for (const row of data) {
      const firstCol = row[0]?.trim() || '';

      // Check if this is a day header row (contains "(ET)" and mentions day)
      if (
        firstCol.includes('(ET)') &&
        firstCol.match(
          /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/i,
        )
      ) {
        // This is a new day
        if (currentDay) {
          schedule.push(currentDay);
        }
        currentDay = {
          day: firstCol.replace(' (ET)', '').trim(),
          slots: [],
        };
      } else if (
        currentDay &&
        firstCol &&
        (firstCol.match(/^\d+:\d+/) ||
          firstCol.match(/^\d+(am|pm)/i) ||
          firstCol.match(/^\d+\s*-\s*\d+/) ||
          firstCol.includes('-'))
      ) {
        // This is a time slot
        // Only look at columns 1 and 2 for TA names (ignore any TAs beyond that)
        const ta1 = row[1]?.trim();
        const ta2 = row[2]?.trim();

        // Filter out non-name values (PT times, empty strings, etc.)
        const isValidTA = (value: string) => {
          if (!value || value === '') return false;
          if (value.includes('(PT)') || value.includes('(ET)')) return false;
          if (value.match(/^\d+(am|pm)/i)) return false;
          if (value.match(/^\d+\s*-\s*\d+(am|pm)/i)) return false;
          return true;
        };

        currentDay.slots.push({
          time: firstCol,
          ta1: isValidTA(ta1) ? ta1 : undefined,
          ta2: isValidTA(ta2) ? ta2 : undefined,
        });
      }
    }

    // Don't forget the last day
    if (currentDay) {
      schedule.push(currentDay);
    }

    return schedule;
  };

  const parseInPersonOfficeHours = (data: string[][]): DaySchedule[] => {
    const schedule: DaySchedule[] = [];
    let currentDay: DaySchedule | null = null;

    for (const row of data) {
      const firstCol = row[0]?.trim() || '';

      // Check if this is a day header row (mentions day name)
      if (
        firstCol.match(
          /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/i,
        )
      ) {
        // This is a new day with room information
        if (currentDay) {
          schedule.push(currentDay);
        }

        // Parse room information from the day header
        const dayName =
          firstCol.match(
            /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/i,
          )?.[0] || '';
        const rooms: { timeRange: string; room: string }[] = [];

        // Handle complex room schedules like "Thursday 11-4pm East Village 102 5-10PM Cargill 097"
        if (firstCol.includes('11-4pm') && firstCol.includes('5-10')) {
          // Special case for Thursday with multiple rooms
          rooms.push(
            { timeRange: '11am-4pm', room: 'East Village 102' },
            { timeRange: '5pm-10pm', room: 'Cargill 097' },
          );
        } else {
          // Simple case like "Wednesday Mugar 201"
          const roomMatch = firstCol.replace(dayName, '').trim();
          if (roomMatch) {
            rooms.push({ timeRange: 'all day', room: roomMatch });
          }
        }

        currentDay = {
          day: dayName,
          slots: [],
          rooms: rooms,
        };
      } else if (
        currentDay &&
        firstCol &&
        (firstCol.match(/^\d+:\d+/) ||
          firstCol.match(/^\d+(am|pm)/i) ||
          firstCol.match(/^\d+\s*-\s*\d+/) ||
          firstCol.includes('-'))
      ) {
        // This is a time slot
        // Collect ALL TA names from columns after the first (up to 4 TAs)
        const allTAs: string[] = [];

        const isValidTA = (value: string) => {
          if (!value || value === '') return false;
          if (value.includes('(PT)') || value.includes('(ET)')) return false;
          if (value.match(/^\d+(am|pm)/i)) return false;
          if (value.match(/^\d+\s*-\s*\d+(am|pm)/i)) return false;
          return true;
        };

        // Check all columns after the first for TA names
        for (let i = 1; i < row.length; i++) {
          const value = row[i]?.trim();
          if (isValidTA(value)) {
            allTAs.push(value);
          }
        }

        // Determine room for this time slot
        let room = '';
        if (currentDay.rooms && currentDay.rooms.length > 0) {
          if (currentDay.rooms.length === 1) {
            room = currentDay.rooms[0].room;
          } else {
            // Multiple rooms - determine which one based on time
            const timeHour = parseInt(firstCol.match(/(\d+)/)?.[1] || '0');
            const isPM = firstCol.toLowerCase().includes('pm');
            const hour24 =
              isPM && timeHour !== 12
                ? timeHour + 12
                : timeHour === 12 && !isPM
                  ? 0
                  : timeHour;

            if (hour24 >= 11 && hour24 < 17) {
              // 11am-4pm
              room =
                currentDay.rooms.find((r) => r.timeRange.includes('11am-4pm'))
                  ?.room || '';
            } else if (hour24 >= 17) {
              // 5pm+
              room =
                currentDay.rooms.find((r) => r.timeRange.includes('5pm-10pm'))
                  ?.room || '';
            }
          }
        }

        currentDay.slots.push({
          time: firstCol,
          ta1: allTAs[0] || undefined,
          ta2: allTAs[1] || undefined,
          room: room || undefined,
          // Store all TAs for potential future use
          allTAs: allTAs,
        });
      }
    }

    // Don't forget the last day
    if (currentDay) {
      schedule.push(currentDay);
    }

    return schedule;
  };

  const fetchCsvData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch both online and in-person schedules
      const [onlineResponse, inPersonResponse] = await Promise.all([
        fetch(onlineOfficeHoursCsvUrl),
        fetch(inPersonOfficeHoursCsvUrl),
      ]);

      if (!onlineResponse.ok) {
        throw new Error(
          `Online office hours HTTP error! status: ${onlineResponse.status}`,
        );
      }
      if (!inPersonResponse.ok) {
        throw new Error(
          `In-person office hours HTTP error! status: ${inPersonResponse.status}`,
        );
      }

      const [onlineCsvText, inPersonCsvText] = await Promise.all([
        onlineResponse.text(),
        inPersonResponse.text(),
      ]);

      const onlineParsedData = parseCsv(onlineCsvText);
      const inPersonParsedData = parseCsv(inPersonCsvText);

      setOnlineCsvData(onlineParsedData);
      setInPersonCsvData(inPersonParsedData);

      const onlineParsedSchedule = parseOnlineOfficeHours(onlineParsedData);
      const inPersonParsedSchedule =
        parseInPersonOfficeHours(inPersonParsedData);

      setOnlineSchedule(onlineParsedSchedule);
      setInPersonSchedule(inPersonParsedSchedule);
      setLastFetch(new Date());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on component mount and detect timezone
  useEffect(() => {
    fetchCsvData();

    // Detect user's timezone and set initial mode
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const isPacificTime =
      userTimezone.includes('Los_Angeles') ||
      userTimezone.includes('America/Vancouver') ||
      userTimezone.includes('America/Tijuana') ||
      userTimezone.includes('US/Pacific') ||
      userTimezone.includes('PST') ||
      userTimezone.includes('PDT');

    setShowOaklandTime(isPacificTime);
  }, []);

  const convertTimeToOakland = (timeStr: string): string => {
    // Convert ET time to PT (Oakland) time by subtracting 3 hours

    // Handle different time formats: "11am-12pm", "12-1pm", "1-2pm", etc.
    const timeMatch = timeStr.match(/^(\d+)(am|pm)?-(\d+)(am|pm)$/i);
    if (!timeMatch) {
      return timeStr; // Return original if can't parse
    }

    const startHour = parseInt(timeMatch[1]);
    const startPeriod = timeMatch[2]?.toLowerCase();
    const endHour = parseInt(timeMatch[3]);
    const endPeriod = timeMatch[4].toLowerCase();

    // For formats like "12-1pm", infer the start period
    let actualStartPeriod = startPeriod;
    if (!actualStartPeriod) {
      // If no start period specified, infer based on context
      if (endPeriod === 'pm') {
        // If end is PM, start is PM if it's a consecutive hour (like 12-1pm)
        // Otherwise start is AM (like crossing noon: 11am-12pm would be written as 11-12pm)
        actualStartPeriod = 'pm';
      } else {
        actualStartPeriod = 'am';
      }
    }

    // Convert to 24-hour format
    let start24 = startHour;
    if (actualStartPeriod === 'pm' && startHour !== 12) start24 += 12;
    if (actualStartPeriod === 'am' && startHour === 12) start24 = 0;

    let end24 = endHour;
    if (endPeriod === 'pm' && endHour !== 12) end24 += 12;
    if (endPeriod === 'am' && endHour === 12) end24 = 0;

    // Subtract 3 hours for PT
    start24 -= 3;
    end24 -= 3;

    // Handle negative hours (wrap to previous day)
    if (start24 < 0) start24 += 24;
    if (end24 < 0) end24 += 24;

    // Convert back to 12-hour format
    const formatHour = (hour24: number) => {
      if (hour24 === 0) return '12am';
      if (hour24 < 12) return `${hour24}am`;
      if (hour24 === 12) return '12pm';
      return `${hour24 - 12}pm`;
    };

    return `${formatHour(start24)}-${formatHour(end24)}`;
  };

  const renderScheduleTable = (
    schedule: DaySchedule[],
    title: string,
    isInPerson: boolean = false,
  ) => {
    if (schedule.length === 0) return null;

    // Get timezone info for display
    const timezoneInfo = isInPerson
      ? '(Boston)'
      : showOaklandTime
        ? '(Oakland/PT)'
        : '(Boston/ET)';

    return (
      <Box mb={8}>
        <HStack justify="space-between" align="center" mb={4}>
          <Heading size="md">
            {title} {timezoneInfo}
          </Heading>
          {!isInPerson && (
            <Button
              size="sm"
              onClick={() => setShowOaklandTime(!showOaklandTime)}
              colorScheme={showOaklandTime ? 'orange' : 'blue'}
            >
              {showOaklandTime ? 'Show Boston Time' : 'Show Oakland Time'}
            </Button>
          )}
        </HStack>

        <Box
          overflowX="auto"
          border="1px"
          borderColor="gray.200"
          borderRadius="md"
        >
          <Table.Root size="sm">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader fontWeight="bold" bg="gray.100" p={2}>
                  Time {isInPerson ? '(ET)' : showOaklandTime ? '(PT)' : '(ET)'}
                </Table.ColumnHeader>
                {schedule.map((day, dayIndex) => (
                  <Table.ColumnHeader
                    key={dayIndex}
                    fontWeight="bold"
                    bg="gray.100"
                    p={2}
                    textAlign="center"
                  >
                    {day.day}
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {/* Get all unique time slots across all days */}
              {Array.from(
                new Set(
                  schedule.flatMap((day) => day.slots.map((slot) => slot.time)),
                ),
              )
                .sort((a, b) => {
                  // Sort times chronologically (always sort by original ET times)
                  const timeToMinutes = (time: string) => {
                    const match = time.match(/(\d+)(am|pm)/i);
                    if (match) {
                      let hours = parseInt(match[1]);
                      if (match[2].toLowerCase() === 'pm' && hours !== 12)
                        hours += 12;
                      if (match[2].toLowerCase() === 'am' && hours === 12)
                        hours = 0;
                      return hours * 60;
                    }
                    return 0;
                  };
                  return timeToMinutes(a) - timeToMinutes(b);
                })
                .map((timeSlot, timeIndex) => {
                  // Convert time for display if needed
                  const displayTime =
                    !isInPerson && showOaklandTime
                      ? convertTimeToOakland(timeSlot)
                      : timeSlot;

                  return (
                    <Table.Row key={timeIndex}>
                      <Table.Cell fontWeight="bold" p={2} bg="gray.50">
                        {displayTime}
                      </Table.Cell>
                      {schedule.map((day, dayIndex) => {
                        const slot = day.slots.find((s) => s.time === timeSlot);
                        return (
                          <Table.Cell
                            key={dayIndex}
                            p={1}
                            verticalAlign="top"
                            fontSize="xs"
                            lineHeight="1.1"
                          >
                            {slot ? (
                              <>
                                {isInPerson && slot.allTAs ? (
                                  // For in-person, show all TAs
                                  <>
                                    {slot.allTAs.length > 0 ? (
                                      <>
                                        {slot.room && (
                                          <>
                                            <Text
                                              as="span"
                                              fontWeight="bold"
                                              color="purple.600"
                                              fontSize="2xs"
                                            >
                                              {slot.room}
                                            </Text>
                                            <br />
                                          </>
                                        )}
                                        {slot.allTAs.map((ta, taIndex) => (
                                          <React.Fragment key={taIndex}>
                                            {ta}
                                            {taIndex <
                                              slot.allTAs!.length - 1 && <br />}
                                          </React.Fragment>
                                        ))}
                                      </>
                                    ) : (
                                      <span style={{ color: 'gray' }}>—</span>
                                    )}
                                  </>
                                ) : (
                                  // For online, show only first two TAs
                                  <>
                                    {slot.ta1 && <>{slot.ta1}</>}
                                    {slot.ta1 && slot.ta2 && <br />}
                                    {slot.ta2 && <>{slot.ta2}</>}
                                    {!slot.ta1 && !slot.ta2 && (
                                      <span style={{ color: 'gray' }}>—</span>
                                    )}
                                  </>
                                )}
                              </>
                            ) : (
                              <span style={{ color: 'gray' }}>—</span>
                            )}
                          </Table.Cell>
                        );
                      })}
                    </Table.Row>
                  );
                })}
            </Table.Body>
          </Table.Root>
        </Box>
      </Box>
    );
  };

  return (
    <Layout
      title="Office Hours / Recitations"
      description="Office Hours and Recitation Schedule"
    >
      <Box p={6} maxW="1200px" mx="auto">
        <VStack spacing={6} align="stretch">
          <Box>
            <Heading size="xl" mb={4}>
              ONLINE Office Hours / Recitations
            </Heading>
            <Text color="gray.600" mb={4}>
              Online and in-person office hours schedules. Online times can be
              viewed in Eastern (ET) or Pacific (PT) time.{' '}
              <Text as="span" fontWeight="bold">
                Access online office hours via{' '}
                <Text
                  as="a"
                  href="https://app.pawtograder.com/"
                  color="blue.600"
                  textDecoration="underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Pawtograder
                </Text>
              </Text>
            </Text>

            <HStack>
              <Button
                onClick={fetchCsvData}
                isLoading={loading}
                loadingText="Loading..."
                colorScheme="blue"
                size="sm"
              >
                Refresh Schedule
              </Button>
              {lastFetch && (
                <Text fontSize="sm" color="gray.500">
                  Last updated: {lastFetch.toLocaleTimeString()}
                </Text>
              )}
            </HStack>
          </Box>

          {error && (
            <Alert.Root status="error">
              <Alert.Title>Error loading schedule</Alert.Title>
              <Alert.Content>
                <Alert.Description>{error}</Alert.Description>
              </Alert.Content>
            </Alert.Root>
          )}

          {loading && (
            <Box textAlign="center" py={8}>
              <Spinner size="lg" />
              <Text mt={2}>Loading office hours schedule...</Text>
            </Box>
          )}

          {/* Render both online and in-person schedules */}
          {!loading && (
            <>
              {renderScheduleTable(
                onlineSchedule,
                'ONLINE Office Hours Schedule',
                false,
              )}
              {renderScheduleTable(
                inPersonSchedule,
                'IN-PERSON Office Hours Schedule',
                true,
              )}
            </>
          )}

          {onlineSchedule.length === 0 &&
            inPersonSchedule.length === 0 &&
            !loading &&
            !error && (
              <Alert.Root status="info">
                <Alert.Title>No schedule data</Alert.Title>
                <Alert.Content>
                  <Alert.Description>
                    Click "Refresh Schedule" to load the latest office hours
                    schedule
                  </Alert.Description>
                </Alert.Content>
              </Alert.Root>
            )}

          {/* Recitation Schedule Section */}
          <Box mt={8} pt={6} borderTop="1px solid" borderColor="gray.200">
            <Heading size="lg" mb={4} color="gray.600">
              Recitation Schedule
            </Heading>
            <Text fontSize="lg" color="gray.500">
              Coming soon
            </Text>
          </Box>
        </VStack>
      </Box>
    </Layout>
  );
}
