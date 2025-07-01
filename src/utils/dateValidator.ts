// src/utils/dateValidator.ts
export const validateDate = (dateString: string): { isValid: boolean; error?: string } => {
  const selectedDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day
  
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 15); // 15 days from today

  if (isNaN(selectedDate.getTime())) {
    return { isValid: false, error: "Invalid date format" };
  }
  if (selectedDate < today) {
    return { isValid: false, error: "Date cannot be in the past" };
  }
  if (selectedDate > maxDate) {
    return { isValid: false, error: "Date cannot be more than 15 days from today" };
  }
  return { isValid: true };
};