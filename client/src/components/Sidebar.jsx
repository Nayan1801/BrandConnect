export default function Sidebar({ conversations, onSelect }) {
  return (
    <div className="w-1/4 border-r overflow-y-auto">
      {conversations.map((conv, i) => (
        <div
          key={i}
          className="p-4 hover:bg-gray-100 cursor-pointer border-b"
          onClick={() => onSelect(conv)}
        >
          <p className="font-semibold">{conv.name}</p>
          <p className="text-sm text-gray-500">{conv.preview}</p>
        </div>
      ))}
    </div>
  );
}