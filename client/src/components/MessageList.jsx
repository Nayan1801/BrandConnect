import { useEffect, useState } from 'react';
import axios from 'axios';
import MessageItem from './MessageItem';
export default function MessageList({ onSelect, selectedId }) {
  const [conversations, setConversations] = useState([]);
   const [error, setError] = useState(false);  
  useEffect(() => {
  const fetchConversations = async () => {
    try {
      const res = await axios.get('/api/messages', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      if (Array.isArray(res.data)) {
        setConversations(res.data);
      } else {
        console.error('Unexpected response:', res.data);
        setConversations([]);
        setError(true);
      }
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
      setConversations([]);
      setError('Failed to load conversations.');
    }
  };

  fetchConversations();
}, []);

    if (error) return <div className="p-4 text-red-600">{error}</div>;

  if (conversations.length === 0) return <div className="p-4 text-gray-500">No conversations found.</div>;

  return (
    <div>
      <h2 className="text-lg font-bold p-4 border-b">Conversations</h2>
       {conversations.map((conv) => (
        <div
          key={conv._id}
          onClick={() => onSelect(conv)}
          className={`p-4 cursor-pointer hover:bg-blue-50 ${
            selectedId === conv._id ? 'bg-blue-100' : ''
          }`}
        >
          <div className="font-semibold">{conv.customer?.name || 'Unknown User'}</div>
          <div className="text-sm text-gray-500 truncate">{conv.lastMessage || 'No messages yet'}</div>
        </div>
      ))}
    </div>
  );
}

