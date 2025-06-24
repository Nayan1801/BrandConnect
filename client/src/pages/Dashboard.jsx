// import MessageList from '../components/MessageList';
// import ConversationView from '../components/ConversationView';
// import CustomerProfile from '../components/CustomerProfile';
// import { useState } from 'react';

// export default function Dashboard() {
//   const [selectedConversation, setSelectedConversation] = useState(null);

//   return (
//     <div className="h-screen flex overflow-hidden">
//       {/* Left: Message List */}
//       <div className="w-1/4 bg-gray-100 border-r overflow-y-auto">
//         <MessageList onSelect={setSelectedConversation} selectedId={selectedConversation?.id} />
//       </div>

//       {/* Middle: Chat Area */}
//       <div className="w-2/4 flex flex-col">
//         {selectedConversation ? (
//           <ConversationView conversation={selectedConversation} />
//         ) : (
//           <div className="flex items-center justify-center h-full text-gray-400">Select a conversation</div>
//         )}
//       </div>

//       {/* Right: Customer Profile */}
//       <div className="w-1/4 bg-gray-50 border-l p-4">
//         {selectedConversation && <CustomerProfile conversation={selectedConversation} />}
//       </div>
//     </div>
//   );
// }

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import MessageList from '../components/MessageList';
// import ConversationView from '../components/ConversationView';
// import CustomerProfile from '../components/CustomerProfile';

// export default function Dashboard() {
//   const [conversations, setConversations] = useState([]);
//   const [selectedConversation, setSelectedConversation] = useState(null);
//   const [error, setError] = useState('');

//   const fetchConversations = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/messages`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//       });

//       if (Array.isArray(res.data)) {
//         setConversations(res.data);
//       } else {
//         setError('Unexpected response format from server.');
//       }
//     } catch (err) {
//       setError('Failed to load conversations. Please try again later.');
//       console.error('Conversation fetch error:', err);
//     }
//   };

//   useEffect(() => {
//     fetchConversations();
//   }, []);

//   return (
//     <div className="flex h-screen bg-gray-100 text-gray-800">
//       {/* Sidebar */}
//       <div className="w-1/4 border-r border-gray-300 bg-white overflow-y-auto">
//         <div className="p-4 text-lg font-semibold border-b">Conversations</div>
//         {error ? (
//           <div className="p-4 text-red-600">{error}</div>
//         ) : conversations.length === 0 ? (
//           <div className="p-4 text-gray-500 italic">No conversations yet.</div>
//         ) : (
//           <MessageList
//             conversations={conversations}
//             onSelect={setSelectedConversation}
//             selectedId={selectedConversation?._id}
//           />
//         )}
//       </div>

//       {/* Chat Window */}
//       <div className="w-2/4 flex flex-col">
//         <div className="p-4 border-b bg-white font-medium text-lg">
//           {selectedConversation ? `Chat with ${selectedConversation.customer?.name || 'User'}` : 'No Chat Selected'}
//         </div>
//         <div className="flex-1 overflow-y-auto bg-gray-50">
//           {selectedConversation ? (
//             <ConversationView conversation={selectedConversation} />
//           ) : (
//             <div className="flex h-full items-center justify-center text-gray-500 italic">
//               Select a conversation to begin.
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Customer Info */}
//       <div className="w-1/4 border-l border-gray-300 bg-white p-4">
//         {selectedConversation ? (
//           <CustomerProfile customer={selectedConversation.customer} />
//         ) : (
//           <div className="text-gray-500 italic text-center mt-20">No customer selected</div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MessageList from './MessageList';
import ConversationView from './ConversationView';
import CustomerProfile from './CustomerProfile';

export default function Dashboard() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [conversations, setConversations] = useState([]);
  const [sel, setSel] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${API_URL}/messages`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    .then(res => setConversations(res.data))
    .catch(err => setError('Failed to load.'));
  }, []);

  return (
    <div className="flex h-screen">
      <div className="w-1/4 border-r bg-white overflow-y-auto">
        {error && <div className="p-4 text-red-600">{error}</div>}
        <MessageList
          conversations={conversations}
          onSelect={(c) => setSel(c)}
          selectedId={sel?._id}
        />
      </div>
      <div className="w-1/2 flex flex-col">
        <ConversationView selectedConversation={sel} />
      </div>
      <div className="w-1/4 border-l p-4 bg-white">
        <CustomerProfile customer={{
          name: sel?.senderName || 'Unknown',
          id: sel?.senderId,
        }} />
      </div>
    </div>
  );
}
