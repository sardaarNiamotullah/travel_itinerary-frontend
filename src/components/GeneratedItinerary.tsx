import type { ItineraryResponse } from "../types/itinerary";

export default function GeneratedItinerary({
  result,
}: {
  result: ItineraryResponse;
}) {
  let parsedItinerary: { [key: string]: string }[] | null = null;

  try {
    const parsed = JSON.parse(result.ai_itinerary);
    if (
      Array.isArray(parsed) &&
      parsed.every(
        (entry) =>
          typeof entry === "object" &&
          Object.keys(entry).length === 1 &&
          typeof Object.values(entry)[0] === "string"
      )
    ) {
      parsedItinerary = parsed;
    }
  } catch (e) {
    console.log(e);
  }

  return (
    <>
      <h2 className="text-xl font-bold text-[rgb(var(--golden))] text-center mt-[1.5rem] mb-[2rem]">
        Itinerary Suggestion
      </h2>
      <div className="bg-transparent p-6 rounded-xl border border-[rgb(var(--golden))] space-y-4 h-[85%] overflow-y-auto text-[rgb(var(--white))]">
        {/* Parsed itinerary */}
        {parsedItinerary ? (
          <div className="space-y-4">
            {parsedItinerary.map((entry, index) => {
              const title = Object.keys(entry)[0];
              const content = entry[title];
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg whitespace-pre-line ${
                    index % 2 === 0
                      ? "bg-[rgb(var(--blue-light))]/10"
                      : "bg-[rgb(var(--golden))]/10"
                  }`}
                >
                  <h4 className="font-semibold text-lg mb-2 text-center">
                    {title}
                  </h4>
                  <p className="text-justify">{content}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="whitespace-pre-line text-justify">
            {result.ai_itinerary.replace(/^\[|\]$/g, "")}
          </p>
        )}

        {/* Forecast */}
        <h3 className="font-semibold text-[rgb(var(--golden))] text-center mt-6">
          3-Day Forecast:
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {result.forecast.map((day, index) => (
            <li
              key={index}
              className={`border p-3 rounded-md ${
                index % 2 === 0
                  ? "border-[rgb(var(--blue-light))] bg-[rgb(var(--blue-light))]/10"
                  : "border-[rgb(var(--golden))] bg-[rgb(var(--golden))]/10"
              }`}
            >
              <p>
                {day.day}
                <br />
                {day.summary}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

