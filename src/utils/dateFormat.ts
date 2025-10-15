// Date formatting utility for consistent date display across the platform
// Format: "Month Day, Year" (e.g., "January 15, 2024")

export const formatDate = (dateString: string | Date | null | undefined): string => {
  // Handle null, undefined, or empty string
  if (!dateString) {
    return 'N/A';
  }

  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;

  // Check if date is valid
  if (!date || isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDateTime = (dateString: string | Date | null | undefined): string => {
  // Handle null, undefined, or empty string
  if (!dateString) {
    return 'N/A';
  }

  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;

  // Check if date is valid
  if (!date || isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDateShort = (dateString: string | Date | null | undefined): string => {
  // Handle null, undefined, or empty string
  if (!dateString) {
    return 'N/A';
  }

  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;

  // Check if date is valid
  if (!date || isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
