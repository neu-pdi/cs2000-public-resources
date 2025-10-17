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
  const [oaklandInPersonCsvData, setOaklandInPersonCsvData] = useState<
    string[][]
  >([]);
  const [bostonRecitationsCsvData, setBostonRecitationsCsvData] = useState<
    string[][]
  >([]);
  const [oaklandRecitationsCsvData, setOaklandRecitationsCsvData] = useState<
    string[][]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  const [onlineSchedule, setOnlineSchedule] = useState<DaySchedule[]>([]);
  const [inPersonSchedule, setInPersonSchedule] = useState<DaySchedule[]>([]);
  const [oaklandInPersonSchedule, setOaklandInPersonSchedule] = useState<
    DaySchedule[]
  >([]);
  const [bostonRecitationsSchedule, setBostonRecitationsSchedule] = useState<
    DaySchedule[]
  >([]);
  const [oaklandRecitationsSchedule, setOaklandRecitationsSchedule] = useState<
    DaySchedule[]
  >([]);
  const [
    bostonInstructorAssessmentsCsvData,
    setBostonInstructorAssessmentsCsvData,
  ] = useState<string[][]>([]);
  const [
    bostonInstructorAssessmentsSchedule,
    setBostonInstructorAssessmentsSchedule,
  ] = useState<DaySchedule[]>([]);
  const [
    oaklandInstructorAssessmentsCsvData,
    setOaklandInstructorAssessmentsCsvData,
  ] = useState<string[][]>([]);
  const [
    oaklandInstructorAssessmentsSchedule,
    setOaklandInstructorAssessmentsSchedule,
  ] = useState<DaySchedule[]>([]);
  const [onlineRecitationsCsvData, setOnlineRecitationsCsvData] = useState<
    string[][]
  >([]);
  const [onlineRecitationsSchedule, setOnlineRecitationsSchedule] = useState<
    DaySchedule[]
  >([]);
  const [showOaklandTime, setShowOaklandTime] = useState(false);

  const PROXY_URL = "https://metal.dbp.io:10321";

  // The Google Sheets CSV API URL for Online Office Hours
  const onlineOfficeHoursCsvUrl =
    `${PROXY_URL}/spreadsheets/d/19V2RxXUrOb0ORGk6eNzw_Qp0O3bAylI6adsw_qNxjUw/gviz/tq?tqx=out:csv&sheet=Online+Office+Hours`;

  const inPersonOfficeHoursCsvUrl =
    `${PROXY_URL}/spreadsheets/d/19V2RxXUrOb0ORGk6eNzw_Qp0O3bAylI6adsw_qNxjUw/gviz/tq?tqx=out:csv&sheet=In+Person+Office+Hours`;

  const oaklandInPersonOfficeHoursCsvUrl =
    `${PROXY_URL}/spreadsheets/d/19V2RxXUrOb0ORGk6eNzw_Qp0O3bAylI6adsw_qNxjUw/gviz/tq?tqx=out:csv&sheet=Oakland+In+Person`;

  const bostonRecitationsCsvUrl =
    `${PROXY_URL}/spreadsheets/d/19V2RxXUrOb0ORGk6eNzw_Qp0O3bAylI6adsw_qNxjUw/gviz/tq?tqx=out:csv&sheet=Boston+Recitations`;

  const onlineRecitationsCsvUrl =
    `${PROXY_URL}/spreadsheets/d/19V2RxXUrOb0ORGk6eNzw_Qp0O3bAylI6adsw_qNxjUw/gviz/tq?tqx=out:csv&sheet=Online+Recitations`;

  const oaklandRecitationsCsvUrl =
    `${PROXY_URL}/spreadsheets/d/19V2RxXUrOb0ORGk6eNzw_Qp0O3bAylI6adsw_qNxjUw/gviz/tq?tqx=out:csv&sheet=Oakland+Recitations`;

  const bostonInstructorAssessmentsUrl =
    `${PROXY_URL}/spreadsheets/d/19V2RxXUrOb0ORGk6eNzw_Qp0O3bAylI6adsw_qNxjUw/gviz/tq?tqx=out:csv&sheet=Boston+Instructor+Assessments`;

  const oaklandInstructorAssessmentsUrl =
    `${PROXY_URL}/spreadsheets/d/19V2RxXUrOb0ORGk6eNzw_Qp0O3bAylI6adsw_qNxjUw/gviz/tq?tqx=out:csv&sheet=Oakland+Instructor+Assessments`;

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

        // Parse room information from the day header
        const afterDay = firstCol.replace(dayName, '').trim();

        if (afterDay.includes(';')) {
          // Multiple room ranges separated by semicolons
          // e.g., "11-4pm East Village 102; 5-10PM Richards 155"
          const segments = afterDay.split(';');
          for (const segment of segments) {
            const trimmed = segment.trim();
            // Match "time range + room" pattern
            const match = trimmed.match(
              /^(\d+(?::\d+)?(?:am|pm)?-\d+(?::\d+)?(?:am|pm)?)\s+(.+)$/i,
            );
            if (match) {
              const [, timeRange, room] = match;
              rooms.push({ timeRange: timeRange.trim(), room: room.trim() });
            }
          }
        } else if (afterDay) {
          // Single room - could be with time range or just room name
          const timeRoomMatch = afterDay.match(
            /^(\d+(?::\d+)?(?:am|pm)?-\d+(?::\d+)?(?:am|pm)?)\s+(.+)$/i,
          );
          if (timeRoomMatch) {
            const [, timeRange, room] = timeRoomMatch;
            rooms.push({ timeRange: timeRange.trim(), room: room.trim() });
          } else {
            // Just a room name like "Mugar 201"
            rooms.push({ timeRange: 'all day', room: afterDay });
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
            // Parse the start time more carefully to handle formats like "11am-12pm"
            const timeMatch = firstCol.match(/^(\d+)(am|pm)?/i);
            const timeHour = parseInt(timeMatch?.[1] || '0');
            const startPeriod = timeMatch?.[2]?.toLowerCase();

            // If no period specified for start time, infer from context
            let isPM = false;
            if (startPeriod) {
              isPM = startPeriod === 'pm';
            } else {
              // If no start period, infer based on the end time
              // For formats like "12-1pm", the end time suggests start time period
              const endTimeMatch = firstCol.match(/-(\d+)(am|pm)/i);
              if (endTimeMatch) {
                const endPeriod = endTimeMatch[2].toLowerCase();
                // If end is PM, start is likely PM too for consecutive hours
                // Exception: times crossing noon like "11-12pm" would be "11am-12pm"
                if (endPeriod === 'pm') {
                  const endHour = parseInt(endTimeMatch[1]);
                  // If it's a consecutive hour range, start should be PM too
                  // Exception: 11-12pm should be 11am-12pm (crossing noon)
                  isPM = !(timeHour === 11 && endHour === 12);
                } else {
                  isPM = false; // End is AM, so start is AM
                }
              }
            }

            const hour24 =
              isPM && timeHour !== 12
                ? timeHour + 12
                : timeHour === 12 && !isPM
                  ? 0
                  : timeHour;

            if (hour24 >= 11 && hour24 < 17) {
              // 11am-4pm range
              room =
                currentDay.rooms.find(
                  (r) =>
                    r.timeRange.includes('11') && r.timeRange.includes('4'),
                )?.room || '';
            } else if (hour24 >= 17) {
              // 5pm+ range
              room =
                currentDay.rooms.find(
                  (r) =>
                    r.timeRange.includes('5') &&
                    (r.timeRange.includes('10') || r.timeRange.includes('PM')),
                )?.room || '';
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

  const parseOaklandInPersonOfficeHours = (data: string[][]): DaySchedule[] => {
    const schedule: DaySchedule[] = [];
    let currentDay: DaySchedule | null = null;

    for (const row of data) {
      const firstCol = row[0]?.trim() || '';

      // Check if this is a day header row (mentions day name and includes "(PT)")
      if (
        firstCol.match(
          /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/i,
        ) &&
        firstCol.includes('(PT)')
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

        // Handle complex room schedules like "Wednesday (PT) 3-4pm CARN201 4-6pm CPM 200"
        // Remove day name and "(PT)" to get the room information
        let roomInfo = firstCol.replace(dayName, '').replace('(PT)', '').trim();

        // Check for multiple time-room combinations
        const timeRoomPattern =
          /(\d+(?::\d+)?(?:am|pm)?-\d+(?::\d+)?(?:am|pm)?)\s+([A-Z]+\s*\d+)/gi;
        const matches = [...roomInfo.matchAll(timeRoomPattern)];

        if (matches.length > 0) {
          // Multiple time-room combinations found
          for (const match of matches) {
            const timeRange = match[1];
            const room = match[2];
            rooms.push({ timeRange, room });
          }
        } else {
          // Simple case like "Wednesday (PT) CPM 200" - just a room name
          if (roomInfo) {
            rooms.push({ timeRange: 'all day', room: roomInfo });
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

            // Find matching room based on time ranges
            for (const roomEntry of currentDay.rooms) {
              if (roomEntry.timeRange === 'all day') {
                room = roomEntry.room;
                break;
              }

              // Parse the time range to see if current slot falls within it
              const rangeMatch = roomEntry.timeRange.match(
                /(\d+)(?::\d+)?(?:am|pm)?-(\d+)(?::\d+)?(?:am|pm)?/i,
              );
              if (rangeMatch) {
                const startHour = parseInt(rangeMatch[1]);
                const endHour = parseInt(rangeMatch[2]);

                // Simple hour-based matching (can be enhanced for more precision)
                let startHour24 = startHour;
                let endHour24 = endHour;

                // Handle PM times in range
                if (roomEntry.timeRange.toLowerCase().includes('pm')) {
                  if (startHour !== 12) startHour24 += 12;
                  if (endHour !== 12) endHour24 += 12;
                }

                if (hour24 >= startHour24 && hour24 < endHour24) {
                  room = roomEntry.room;
                  break;
                }
              }
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

  const parseRecitationsSchedule = (data: string[][]): DaySchedule[] => {
    const schedule: DaySchedule[] = [];

    for (const row of data) {
      const firstCol = row[0]?.trim() || '';
      const roomCol = row[1]?.trim() || '';

      // Skip header rows and empty rows
      if (
        !firstCol ||
        firstCol.includes('Recitations') ||
        firstCol.includes('TA 1') ||
        firstCol.includes('TA 2')
      ) {
        continue;
      }

      // Skip info rows that don't contain time slots
      if (!firstCol.match(/\d+.*[ap]m/i)) {
        continue;
      }

      // Parse the time and day from the first column
      // Format examples: "12pm-1pm Mondays in person", "11:50am-12:50pm Wednesday", "6-7pm Wednesdays online"
      const timeMatch = firstCol.match(
        /(\d+(?::\d+)?(?:[ap]m)?-\d+(?::\d+)?[ap]m)/i,
      );
      const dayMatch = firstCol.match(
        /(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)s?/i,
      );

      if (!timeMatch || !dayMatch) {
        continue;
      }

      const timeSlot = timeMatch[1];
      const dayName = dayMatch[1];

      // Find or create day schedule
      let daySchedule = schedule.find((d) => d.day === dayName);
      if (!daySchedule) {
        daySchedule = {
          day: dayName,
          slots: [],
          rooms: roomCol ? [{ timeRange: 'all day', room: roomCol }] : [],
        };
        schedule.push(daySchedule);
      }

      // Collect TAs from subsequent columns
      const allTAs: string[] = [];
      for (let i = 2; i < row.length; i++) {
        const ta = row[i]?.trim();
        if (ta && ta !== '') {
          allTAs.push(ta);
        }
      }

      // Add the time slot
      daySchedule.slots.push({
        time: timeSlot,
        ta1: allTAs[0] || undefined,
        ta2: allTAs[1] || undefined,
        room: roomCol || undefined,
        allTAs: allTAs,
      });
    }

    return schedule;
  };

  const fetchCsvData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all schedules: online, in-person, Oakland in-person, recitations, and instructor assessments
      const [
        onlineResponse,
        inPersonResponse,
        oaklandInPersonResponse,
        onlineRecitationsResponse,
        bostonRecitationsResponse,
        oaklandRecitationsResponse,
        bostonInstructorAssessmentsResponse,
        oaklandInstructorAssessmentsResponse,
      ] = await Promise.all([
        fetch(onlineOfficeHoursCsvUrl),
        fetch(inPersonOfficeHoursCsvUrl),
        fetch(oaklandInPersonOfficeHoursCsvUrl),
        fetch(onlineRecitationsCsvUrl),
        fetch(bostonRecitationsCsvUrl),
        fetch(oaklandRecitationsCsvUrl),
        fetch(bostonInstructorAssessmentsUrl),
        fetch(oaklandInstructorAssessmentsUrl),
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
      if (!oaklandInPersonResponse.ok) {
        throw new Error(
          `Oakland in-person office hours HTTP error! status: ${oaklandInPersonResponse.status}`,
        );
      }
      if (!onlineRecitationsResponse.ok) {
        throw new Error(
          `Online recitations HTTP error! status: ${onlineRecitationsResponse.status}`,
        );
      }
      if (!bostonRecitationsResponse.ok) {
        throw new Error(
          `Boston recitations HTTP error! status: ${bostonRecitationsResponse.status}`,
        );
      }
      if (!oaklandRecitationsResponse.ok) {
        throw new Error(
          `Oakland recitations HTTP error! status: ${oaklandRecitationsResponse.status}`,
        );
      }
      if (!bostonInstructorAssessmentsResponse.ok) {
        throw new Error(
          `Boston instructor assessments HTTP error! status: ${bostonInstructorAssessmentsResponse.status}`,
        );
      }
      if (!oaklandInstructorAssessmentsResponse.ok) {
        throw new Error(
          `Oakland instructor assessments HTTP error! status: ${oaklandInstructorAssessmentsResponse.status}`,
        );
      }

      const [
        onlineCsvText,
        inPersonCsvText,
        oaklandInPersonCsvText,
        onlineRecitationsCsvText,
        bostonRecitationsCsvText,
        oaklandRecitationsCsvText,
        bostonInstructorAssessmentsCsvText,
        oaklandInstructorAssessmentsCsvText,
      ] = await Promise.all([
        onlineResponse.text(),
        inPersonResponse.text(),
        oaklandInPersonResponse.text(),
        onlineRecitationsResponse.text(),
        bostonRecitationsResponse.text(),
        oaklandRecitationsResponse.text(),
        bostonInstructorAssessmentsResponse.text(),
        oaklandInstructorAssessmentsResponse.text(),
      ]);

      const onlineParsedData = parseCsv(onlineCsvText);
      const inPersonParsedData = parseCsv(inPersonCsvText);
      const oaklandInPersonParsedData = parseCsv(oaklandInPersonCsvText);
      const onlineRecitationsParsedData = parseCsv(onlineRecitationsCsvText);
      const bostonRecitationsParsedData = parseCsv(bostonRecitationsCsvText);
      const oaklandRecitationsParsedData = parseCsv(oaklandRecitationsCsvText);
      const bostonInstructorAssessmentsParsedData = parseCsv(
        bostonInstructorAssessmentsCsvText,
      );
      const oaklandInstructorAssessmentsParsedData = parseCsv(
        oaklandInstructorAssessmentsCsvText,
      );

      setOnlineCsvData(onlineParsedData);
      setInPersonCsvData(inPersonParsedData);
      setOaklandInPersonCsvData(oaklandInPersonParsedData);
      setOnlineRecitationsCsvData(onlineRecitationsParsedData);
      setBostonRecitationsCsvData(bostonRecitationsParsedData);
      setOaklandRecitationsCsvData(oaklandRecitationsParsedData);
      setBostonInstructorAssessmentsCsvData(
        bostonInstructorAssessmentsParsedData,
      );
      setOaklandInstructorAssessmentsCsvData(
        oaklandInstructorAssessmentsParsedData,
      );

      const onlineParsedSchedule = parseOnlineOfficeHours(onlineParsedData);
      const inPersonParsedSchedule =
        parseInPersonOfficeHours(inPersonParsedData);
      const oaklandInPersonParsedSchedule = parseOaklandInPersonOfficeHours(
        oaklandInPersonParsedData,
      );
      const onlineRecitationsParsedSchedule = parseRecitationsSchedule(
        onlineRecitationsParsedData,
      );
      const bostonRecitationsParsedSchedule = parseRecitationsSchedule(
        bostonRecitationsParsedData,
      );
      const oaklandRecitationsParsedSchedule = parseRecitationsSchedule(
        oaklandRecitationsParsedData,
      );
      const bostonInstructorAssessmentsParsedSchedule =
        parseRecitationsSchedule(bostonInstructorAssessmentsParsedData);
      const oaklandInstructorAssessmentsParsedSchedule =
        parseRecitationsSchedule(oaklandInstructorAssessmentsParsedData);

      setOnlineSchedule(onlineParsedSchedule);
      setInPersonSchedule(inPersonParsedSchedule);
      setOaklandInPersonSchedule(oaklandInPersonParsedSchedule);
      setOnlineRecitationsSchedule(onlineRecitationsParsedSchedule);
      setBostonRecitationsSchedule(bostonRecitationsParsedSchedule);
      setOaklandRecitationsSchedule(oaklandRecitationsParsedSchedule);
      setBostonInstructorAssessmentsSchedule(
        bostonInstructorAssessmentsParsedSchedule,
      );
      setOaklandInstructorAssessmentsSchedule(
        oaklandInstructorAssessmentsParsedSchedule,
      );
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
    isOakland: boolean = false,
    skipLocationInfo: boolean = false,
    enableUrlRendering: boolean = false,
    anchorId?: string,
  ) => {
    // Get timezone info for display
    const timezoneInfo = skipLocationInfo
      ? ''
      : isOakland
        ? ''
        : isInPerson
          ? '(Boston)'
          : showOaklandTime
            ? '(Oakland/PT)'
            : '(Boston/ET)';

    return (
      <Box mb={8}>
        <HStack justify="space-between" align="center" mb={4}>
          <Heading size="md" id={anchorId}>
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

        {title.includes('Assessable@Hours') && (
          <Text fontSize="sm" color="gray.600" mb={4}>
            These hours can be used for skill assessments, as described at{' '}
            <a
              href="/skills#assessablehours"
              style={{ textDecoration: 'underline', color: '#7c3aed' }}
            >
              /skills#assessablehours
            </a>
          </Text>
        )}

        {loading ? (
          <Box textAlign="center" py={4}>
            <Spinner size="md" />
            <Text mt={2} fontSize="sm" color="gray.500">Loading...</Text>
          </Box>
        ) : schedule.length === 0 ? (
          <Text fontSize="sm" color="gray.500">No schedule available</Text>
        ) : null}

        {!loading && schedule.length > 0 && (

        <Box
          overflowX="auto"
          border="1px"
          borderColor="gray.200"
          borderRadius="md"
        >
          <Table.Root size="sm">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader
                  fontWeight="bold"
                  bg={{ base: 'gray.100', _dark: 'gray.700' }}
                  p={2}
                >
                  Time{' '}
                  {isOakland
                    ? '(PT)'
                    : isInPerson
                      ? '(ET)'
                      : showOaklandTime
                        ? '(PT)'
                        : '(ET)'}
                </Table.ColumnHeader>
                {schedule.map((day, dayIndex) => (
                  <Table.ColumnHeader
                    key={dayIndex}
                    fontWeight="bold"
                    bg={{ base: 'gray.100', _dark: 'gray.700' }}
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
                    // Handle both "11am-12pm" and "11:50am-12:50pm" formats
                    const match = time.match(/(\d+)(?::(\d+))?([ap]m)/i);
                    if (match) {
                      let hours = parseInt(match[1]);
                      const minutes = parseInt(match[2] || '0');
                      const period = match[3].toLowerCase();

                      if (period === 'pm' && hours !== 12) hours += 12;
                      if (period === 'am' && hours === 12) hours = 0;

                      return hours * 60 + minutes;
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
                      <Table.Cell
                        fontWeight="bold"
                        p={2}
                        bg={{ base: 'gray.50', _dark: 'gray.600' }}
                      >
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
                                {(isInPerson || enableUrlRendering) &&
                                slot.allTAs ? (
                                  // For in-person, show all TAs
                                  <>
                                    {slot.allTAs.length > 0 ? (
                                      <>
                                        {slot.room && (
                                          <>
                                            {slot.room.startsWith('http') ? (
                                              <>
                                                <a
                                                  href={slot.room.split(' ')[0]}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  style={{
                                                    color: '#7c3aed',
                                                    fontWeight: 'bold',
                                                    fontSize: '10px',
                                                    textDecoration: 'underline',
                                                  }}
                                                >
                                                  ONLINE
                                                </a>
                                                {(() => {
                                                  const passcodeMatch =
                                                    slot.room.match(
                                                      /Passcode:\s*(\d+)/i,
                                                    );
                                                  return passcodeMatch ? (
                                                    <>
                                                      <br />
                                                      <Text
                                                        as="span"
                                                        fontSize="2xs"
                                                        color="gray.600"
                                                      >
                                                        Passcode:{' '}
                                                        {passcodeMatch[1]}
                                                      </Text>
                                                    </>
                                                  ) : null;
                                                })()}
                                                <br />
                                              </>
                                            ) : (
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
        )}
      </Box>
    );
  };

  return (
    <Layout
      title="Office Hours / Recitations"
      description="Office Hours and Recitation Schedule"
    >
      <Box p={6} maxW="1200px" mx="auto">
        <VStack gap={6} align="stretch">
          <Box>
            <Heading size="xl" mb={4}>
              ONLINE Office Hours / Recitations
            </Heading>
            <Text color="gray.600" mb={4}>
              Online and in-person office hours schedules. Online times can be
              viewed in Eastern (ET) or Pacific (PT) time.
            </Text>

            <Box
              bg="blue.50"
              border="1px"
              borderColor="blue.200"
              borderRadius="md"
              p={4}
              mb={4}
              _dark={{ bg: 'blue.900', borderColor: 'blue.700' }}
            >
              <Text
                fontWeight="bold"
                color="blue.800"
                _dark={{ color: 'blue.200' }}
              >
                📢 Office hours are available on Discord via the #office-hours
                channel.{' '}
                <Text
                  as="span"
                  color="blue.600"
                  textDecoration="underline"
                  _dark={{ color: 'blue.300' }}
                >
                  <a
                    href="https://discord.gg/HsKXgZXXKH"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Join Discord here
                  </a>
                </Text>
              </Text>
            </Box>

            <HStack>
              <Button
                onClick={fetchCsvData}
                loading={loading}
                colorScheme="blue"
                size="sm"
              >
                {loading ? 'Loading...' : 'Refresh Schedule'}
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

          {/* Render online, in-person, and Oakland in-person schedules */}
          {renderScheduleTable(
            onlineSchedule,
            'ONLINE Office Hours Schedule',
            false,
            false,
            false,
            false,
            'online-office-hours',
          )}
          {renderScheduleTable(
            inPersonSchedule,
            'IN-PERSON Office Hours Schedule',
            true,
            false,
            false,
            false,
            'boston-office-hours',
          )}
          {renderScheduleTable(
            oaklandInPersonSchedule,
            'IN-PERSON Office Hours Schedule (Oakland)',
            true,
            true,
            false,
            false,
            'oakland-office-hours',
          )}
          {renderScheduleTable(
            onlineRecitationsSchedule,
            'ONLINE Recitations Schedule',
            false,
            false,
            false,
            true,
            'online-recitations',
          )}
          {renderScheduleTable(
            bostonRecitationsSchedule,
            'RECITATIONS Schedule (Boston)',
            true,
            false,
            true,
            false,
            'boston-recitations',
          )}
          {renderScheduleTable(
            oaklandRecitationsSchedule,
            'RECITATIONS Schedule (Oakland)',
            true,
            true,
            false,
            false,
            'oakland-recitations',
          )}
          {renderScheduleTable(
            bostonInstructorAssessmentsSchedule,
            'INSTRUCTOR Assessable@Hours Schedule (Boston)',
            true,
            false,
            true,
            false,
            'boston-assessablehours',
          )}
          {renderScheduleTable(
            oaklandInstructorAssessmentsSchedule,
            'INSTRUCTOR Assessable@Hours Schedule (Oakland)',
            true,
            true,
            true,
            false,
            'oakland-assessablehours',
          )}

        </VStack>
      </Box>
    </Layout>
  );
}
