import { useState } from "react";
import type { ItineraryInputFormProps } from "../types/itinerary";
import { validateDate } from "../utils/dateValidator";
import { motion } from "framer-motion";

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
    <div className="min-h-screen flex items-center justify-center bg-transparent text-[rgb(var(--white))]">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 w-full max-w-md px-6 py-8"
      >
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-3xl font-semibold text-[rgb(var(--golden))] mb-6 text-center"
        >
          Itinerary Generator
        </motion.h1>

        <motion.input
          type="text"
          placeholder="Enter Destination"
          value={destination}
          onChange={(e) => onDestinationChange(e.target.value)}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="w-full bg-transparent border-b-2 border-[rgb(var(--golden))] text-center text-[rgb(var(--white))] placeholder-[rgb(var(--white))] focus:outline-none focus:border-[rgb(var(--golden))] py-2 focus:placeholder-transparent"
        />

        <motion.input
          type="date"
          value={date}
          onChange={handleDateChange}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          className="w-full bg-transparent border-b-2 border-[rgb(var(--golden))] text-center text-[rgb(var(--white))] placeholder-[rgb(var(--golden))] focus:outline-none focus:border-[rgb(var(--golden))] py-2"
          placeholder="YYYY-MM-DD"
          pattern="\d{4}-\d{2}-\d{2}"
        />

        <motion.button
          type="submit"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
          className="mt-[1rem] w-full bg-[rgb(var(--golden))] text-[rgb(var(--dark))] py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Loading..." : "Generate Itinerary"}
        </motion.button>

        {dateError && <p className="text-red-400 text-center">{dateError}</p>}
        {error && !dateError && (
          <p className="text-red-400 text-center">{error}</p>
        )}
      </form>
    </div>
  );
}
