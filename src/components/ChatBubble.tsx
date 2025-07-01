import type { Message } from "../types/itinerary";

export default function ChatBubble({ message }: { message: Message }) {
  const isUser = message.sender === "user";

  return (
    <div
      className={`max-w-md px-4 py-3 rounded-2xl shadow text-sm break-words ${
        isUser
          ? "bg-[rgb(var(--blue))] text-white self-end"
          : "bg-white text-black border border-gray-200 self-start"
      }`}
    >
      <p className="whitespace-pre-line">{message.text}</p>
      <p
        className={`text-xs text-right mt-2 ${
          isUser ? "text-blue-100" : "text-gray-500"
        }`}
      >
        {message.timestamp.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
}