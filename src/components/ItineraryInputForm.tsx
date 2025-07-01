import type { ItineraryInputFormProps } from "../types/itinerary";

export default function ItineraryInputForm({
  destination,
  date,
  loading,
  error,
  onDestinationChange,
  onDateChange,
  onSubmit,
}: ItineraryInputFormProps) {
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
        onChange={(e) => onDateChange(e.target.value)}
        className="w-full border border-gray-300 px-5 py-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--blue))]"
        placeholder="YYYY-MM-DD"
      />
      <button
        onClick={onSubmit}
        className="w-full bg-[rgb(var(--blue))] text-white py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-all"
        disabled={loading}
      >
        {loading ? "Loading..." : "Submit"}
      </button>
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
