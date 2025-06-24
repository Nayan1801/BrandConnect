// export default function CustomerProfile({ customer }) {
//   return (
//     <div>
//       <div className="flex flex-col items-center text-center mb-4">
//         <img
//           src={customer.profilePic}
//           alt={customer.name}
//           className="w-20 h-20 rounded-full mb-2 border"
//         />
//         <h3 className="text-lg font-bold">{customer.name}</h3>
//         <p className="text-sm text-gray-600">{customer.email}</p>
//       </div>

//       <div className="text-sm">
//         <p>
//           <strong>First Name:</strong> {customer.firstName}
//         </p>
//         <p>
//           <strong>Last Name:</strong> {customer.lastName}
//         </p>
//         <p>
//           <strong>Status:</strong>{' '}
//           <span className="text-gray-500">{customer.online ? 'Online' : 'Offline'}</span>
//         </p>
//       </div>
//     </div>
//   );
// }

import React from 'react';;

export default function CustomerProfile({ customer }) {
  if (!customer) return <div className="italic text-center mt-20">No customer selected</div>;
  return (
    <div>
      <div className="text-xl font-semibold mb-4">Customer Info</div>
      <div className="mb-2">
        <strong>Name:</strong> {customer?.name || 'N/A'}
      </div>
      <div className="mb-2">
        <strong>ID:</strong> {customer?.id || 'N/A'}
      </div>
      <div className="mb-2">
        <strong>Email:</strong> {customer?.email || 'Not Available'}
      </div>
    </div>
  );
}
