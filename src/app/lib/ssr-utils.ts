// SSR-safe date formatting utilities
// These functions ensure consistent date formatting between server and client

export function formatDateSSR(dateString: string): string {
  const date = new Date(dateString);
  
  // Use UTC methods to ensure consistency between server and client
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const weekday = weekdays[date.getUTCDay()];
  const monthName = months[month];
  
  return `${weekday}, ${monthName} ${day}`;
}

export function formatTimeSSR(dateString: string): string {
  const date = new Date(dateString);
  
  // Use UTC methods for consistency
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  
  // Format as HH:MM (24-hour format)
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  
  return `${formattedHours}:${formattedMinutes}`;
}

export function formatTimeRangeSSR(startDate: string, endDate: string): string {
  const startTime = formatTimeSSR(startDate);
  const endTime = formatTimeSSR(endDate);
  return `${startTime} - ${endTime}`;
}

// Price formatting utility
export function formatPriceSSR(pricePaise: number): string {
  if (pricePaise === 0) return 'Free Entry';
  return `₹${pricePaise / 100}`;
}
