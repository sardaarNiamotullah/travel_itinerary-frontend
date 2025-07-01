import { useState } from "react";
import type { ItineraryInputFormProps } from "../types/itinerary";
import { validateDate } from "../utils/dateValidator";

export default function ItineraryInputForm({
  destination,
  date,
  loading,
  error,
  onDestinationChange,
  onDateChange,
  onSubmit,
}: ItineraryInputFormProps) {
  const [dateError, setDateError] = useState<string | null>(null);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    onDateChange(newDate);
    if (dateError) setDateError(null);

    // Real-time validation
    if (newDate) {
      const { error } = validateDate(newDate);
      if (error) setDateError(error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateDate(date || "");
    if (!validation.isValid) {
      setDateError(validation.error || "Please select a date");
      return;
    }

    onSubmit();
  };

  return (
    <div className="space-y-4 p-6 max-w-md mx-auto">
      <input
        type="text"
        placeholder="Enter Destination"
        value={destination}
        onChange={(e) => onDestinationChange(e.target.value)}
        className="w-full border border-gray-300 px-5 py-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--blue))]"
      />

      <input
        type="date"
        value={date}
        onChange={handleDateChange}
        className="w-full border border-gray-300 px-5 py-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--blue))]"
        placeholder="YYYY-MM-DD"
        pattern="\d{4}-\d{2}-\d{2}"
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-[rgb(var(--blue))] text-white py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-all"
        disabled={loading}
      >
        {loading ? "Loading..." : "Submit"}
      </button>

      {/* Show date errors below submit button */}
      {dateError && <p className="text-red-600">{dateError}</p>}
      
      {/* Show API errors below date errors */}
      {error && !dateError && <p className="text-red-600">{error}</p>}
    </div>
  );
}