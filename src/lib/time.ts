import { format, addSeconds } from "date-fns";

/**
 * Formats a duration in seconds to "mm:ss" format.
 * @param {number} seconds - The total number of seconds.
 * @returns {string} The formatted duration string.
 */
export function formatDuration(seconds) {
  // Add the seconds to a new Date object starting at the Unix epoch (1970-01-01T00:00:00Z)
  const helperDate = addSeconds(new Date(0), seconds);
  // Format the helper date to show only minutes and seconds
  return format(helperDate, "mm:ss");
}
