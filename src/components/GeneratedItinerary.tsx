import type { ItineraryResponse } from "../types/itinerary";

export default function GeneratedItinerary({ result }: { result: ItineraryResponse }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-4">
      <h2 className="text-xl font-bold text-[rgb(var(--blue))]">
        Itinerary Suggestion
      </h2>
      <p>{result.ai_itinerary}</p>
      <h3 className="font-semibold">3-Day Forecast:</h3>
      <ul className="space-y-2">
        {result.forecast.map((day, index) => (
          <li key={index} className="border p-2 rounded-md">
            <p>
              <strong>{day.day}</strong>: {day.summary}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
