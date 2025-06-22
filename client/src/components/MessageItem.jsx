// MessageItem.jsx
export default function MessageItem({ data }) {
  return (
    <div className="p-4 border-b hover:bg-gray-100 cursor-pointer">
      <p className="font-medium">{data.senderName || 'Unknown User'}</p>
      <p className="text-sm text-gray-500 truncate">{data.lastMessage || 'No message'}</p>
    </div>
  );
}
