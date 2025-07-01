// src/api/api.ts
import api from "../lib/axios";
import type { ItineraryResponse, AIChatRequest, AIChatResponse } from "../types/itinerary";

export const fetchItinerary = async (
  destination: string,
  date: string
): Promise<ItineraryResponse> => {
  const payload = { destination, date };
  //   console.log("Sending to backend:", payload);

  const response = await api.post<ItineraryResponse>("/itinerary/", payload);
  return response.data;
};

export const sendAIMessage = async (
  request: AIChatRequest
): Promise<AIChatResponse> => {
  const response = await api.post<AIChatResponse>(
    "/itinerary/aichat/",
    request
  );
  return response.data;
};
