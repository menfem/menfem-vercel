// ABOUTME: Utility functions for formatting video duration
// ABOUTME: Converts between seconds and human-readable time formats

/**
 * Formats duration in seconds to human-readable format (MM:SS or HH:MM:SS)
 */
export function formatDuration(seconds: number): string {
  if (seconds < 0) return '0:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Parses ISO 8601 duration format (used by YouTube API) to seconds
 * Example: "PT4M13S" -> 253 seconds
 */
export function parseISO8601Duration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  
  if (!match) return 0;
  
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  
  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Formats duration in a more human-friendly way for display
 * Examples: "4 minutes", "1 hour 23 minutes", "45 seconds"
 */
export function formatDurationHuman(seconds: number): string {
  if (seconds < 0) return '0 seconds';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  const parts: string[] = [];
  
  if (hours > 0) {
    parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
  }
  
  if (minutes > 0) {
    parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
  }
  
  if (remainingSeconds > 0 && hours === 0) {
    parts.push(`${remainingSeconds} second${remainingSeconds > 1 ? 's' : ''}`);
  }
  
  if (parts.length === 0) {
    return '0 seconds';
  }
  
  if (parts.length === 1) {
    return parts[0];
  }
  
  if (parts.length === 2) {
    return `${parts[0]} ${parts[1]}`;
  }
  
  return `${parts[0]} ${parts[1]}`;
}

/**
 * Estimates reading time based on video duration
 * Assumes 150 words per minute speaking rate
 */
export function estimateWordCount(durationInSeconds: number): number {
  const wordsPerSecond = 150 / 60; // 150 words per minute
  return Math.round(durationInSeconds * wordsPerSecond);
}