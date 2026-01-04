interface LinkDisplayProps {
  link: string;
  copied: boolean;
  onCopy: () => void;
}

export function LinkDisplay({ link, copied, onCopy }: LinkDisplayProps) {
  return (
    <div className="fade-in space-y-4 p-6 bg-[#2f2f2f] rounded-2xl border border-[#424242]">
      <div className="flex items-center justify-between gap-4">
        <p className="text-gray-400 text-sm">
          Share this link with someone who should have just asked ChatGPT:
        </p>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={link}
          readOnly
          className="flex-1 bg-[#212121] text-white px-4 py-3 rounded-xl border border-[#424242] text-sm font-mono"
        />
        <button
          onClick={onCopy}
          className="px-4 py-3 bg-[#10a37f] hover:bg-[#1a7f64] text-white font-medium rounded-xl transition-colors duration-200 whitespace-nowrap"
        >
          {copied ? "Copied!" : "Copy Link"}
        </button>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#10a37f] hover:underline text-sm"
        >
          Preview the animation
        </a>
      </div>
    </div>
  );
}
