import type { Message } from "../types/itinerary";

export default function ChatBubble({ message }: { message: Message }) {
  const isUser = message.sender === "user";

  return (
    <div
      className={`max-w-md px-4 py-3 rounded-2xl text-sm break-words ${
        isUser
          ? "bg-[rgb(var(--golden))] text-[rgb(var(--dark))] self-end"
          : "bg-transparent border border-[rgb(var(--golden))] text-[rgb(var(--white))] self-start"
      }`}
    >
      <p className="whitespace-pre-line">{message.text}</p>
      <p
        className={`text-xs text-right mt-2 ${
          isUser ? "text-[rgb(var(--dark))]" : "text-[rgb(var(--golden))]"
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
