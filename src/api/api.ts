// src/api/itinerary.ts
import api from "../lib/axios";
import type { ItineraryResponse } from "../types/itinerary";

export const fetchItinerary = async (
  destination: string,
  date: string
): Promise<ItineraryResponse> => {
  const payload = { destination, date };
  //   console.log("Sending to backend:", payload);

  const response = await api.post<ItineraryResponse>("/itinerary/", payload);
  return response.data;
};

export interface AIChatRequest {
  message: string;
}

export interface AIChatResponse {
  reply: string;
}

export const sendAIMessage = async (message: string): Promise<AIChatResponse> => {
  const response = await api.post<AIChatResponse>("/itinerary/aichat/", {
    message,
  });
  return response.data;
};

