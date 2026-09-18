export function FormattedInline({ text }: { text: string }) {
  // ++...++  |  __...__  |  **...**
  const RE = /(\+\+([\s\S]+?)\+\+)|(__([\s\S]+?)__)|(\*\*([\s\S]+?)\*\*)/g;

  const nodes: React.ReactNode[] = [];
  let last = 0;
  let i = 0;
  let m: RegExpExecArray | null;

  while ((m = RE.exec(text)) !== null) {
    if (m.index > last) {
      nodes.push(text.slice(last, m.index));
    }

    if (m[2] !== undefined) {
      nodes.push(
        <span
          key={`u-${i++}`}
          className="underline underline-offset-2 whitespace-pre-line"
        >
          {m[2]}
        </span>
      );
    } else if (m[4] !== undefined) {
      nodes.push(
        <em key={`i-${i++}`} className="italic whitespace-pre-line">
          {m[4]}
        </em>
      );
    } else if (m[6] !== undefined) {
      nodes.push(
        <strong key={`b-${i++}`} className="font-semibold whitespace-pre-line">
          {m[6]}
        </strong>
      );
    }

    last = RE.lastIndex;
  }

  if (last < text.length) nodes.push(text.slice(last));

  return <>{nodes}</>;
}
