import { useState } from "react";

function ResponseItem({ resp }: { resp:  string }) {
  const [expanded, setExpanded] = useState(false);

  const MAX_LENGTH = 200; // qancha belgidan keyin qisqartirish
  const isLong = resp.length > MAX_LENGTH;
  const displayText = expanded
    ? resp
    : resp.slice(0, MAX_LENGTH);

  return (
    <div className="mb-4">
      <p className="whitespace-pre-line text-gray-600">
        {displayText}
        {!expanded && isLong && "..."}
      </p>

      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-1 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          {expanded ? "Less" : "More"}
        </button>
      )}
    </div>
  );
}

export default ResponseItem;