export function dateToNanos(date: Date): bigint {
  return BigInt(date.getTime()) * BigInt(1_000_000);
}

export function nanosToDate(nanos: bigint): Date {
  return new Date(Number(nanos / BigInt(1_000_000)));
}

export function formatReminderTime(nanos: bigint | undefined): string {
  if (!nanos) return 'No reminder';
  
  const date = nanosToDate(nanos);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  
  if (isToday) {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  }
  
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

export function validateReminderInput(dateTimeString: string): Date | null {
  if (!dateTimeString) return null;
  
  const date = new Date(dateTimeString);
  const now = new Date();
  
  if (isNaN(date.getTime())) return null;
  if (date < now) return null;
  
  return date;
}
