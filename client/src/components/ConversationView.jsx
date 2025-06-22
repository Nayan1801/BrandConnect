import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

// export default function ConversationView({ conversation }) {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const bottomRef = useRef();

//   useEffect(() => {
//     const fetchMessages = async () => {
//       const res = await axios.get(`/api/messages/${conversation.id}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//       });
//       setMessages(res.data);
//     };
//     fetchMessages();
//   }, [conversation]);

//   const handleSend = async () => {
//     if (!input.trim()) return;

//     const res = await axios.post(
//       `/api/messages/${conversation.id}`,
//       { text: input },
//       {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//       }
//     );
//     setMessages((prev) => [...prev, res.data]);
//     setInput('');
//     setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <div className="p-4 border-b font-bold">{conversation.customer.name}</div>
//       <div className="flex-1 overflow-y-auto p-4 space-y-2">
//         {messages.map((msg) => (
//           <div
//             key={msg._id}
//             className={`p-2 rounded max-w-sm ${
//               msg.fromAgent ? 'bg-blue-100 self-end' : 'bg-gray-200 self-start'
//             }`}
//           >
//             {msg.text}
//           </div>
//         ))}
//         <div ref={bottomRef} />
//       </div>
//       <div className="p-4 border-t flex">
//         <input
//           className="flex-1 border rounded px-2 py-1 mr-2"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Type a message"
//         />
//         <button onClick={handleSend} className="bg-blue-600 text-white px-4 py-1 rounded">
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }


export default function ConversationView({ selectedConversation }) {
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const res = await axios.get(`/api/messages/${selectedConversation._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setMessages(res.data);
      } catch (err) {
        setError('Failed to load messages.');
      }
    };

    if (selectedConversation) fetchConversation();
  }, [selectedConversation]);

  const handleSend = async () => {
    try {
      if (!replyText.trim()) return;

      await axios.post(
        `/api/messages/${selectedConversation._id}/reply`,
        { message: replyText },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      setMessages([...messages, { text: replyText, fromAgent: true }]);
      setReplyText('');
    } catch (err) {
      console.error('Failed to send reply:', err);
      alert('Failed to send message.');
    }
  };

  if (!selectedConversation) return <div className="p-4">Select a conversation</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="flex flex-col h-full justify-between border-l p-4">
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((msg, index) => (
          <div key={index} className={`p-3 rounded ${msg.fromAgent ? 'bg-blue-200 self-end' : 'bg-gray-200 self-start'}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex mt-4">
        <input
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-l"
          placeholder="Type your message..."
        />
        <button onClick={handleSend} className="bg-blue-600 text-white px-4 rounded-r">
          Send
        </button>
      </div>
    </div>
  );
}


