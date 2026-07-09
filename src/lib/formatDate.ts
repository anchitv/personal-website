type DateStyle = 'long' | 'short' | 'month-year';

const OPTIONS: Record<DateStyle, Intl.DateTimeFormatOptions> = {
  long: { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' },
  short: { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' },
  'month-year': { year: 'numeric', month: 'short', timeZone: 'UTC' },
};

/** Format a content date in UTC so output doesn't shift a day on non-UTC build machines. */
export function formatDate(date: Date | string, style: DateStyle = 'long'): string {
  return new Date(date).toLocaleDateString('en-US', OPTIONS[style]);
}
