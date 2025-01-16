import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useSubscription, useApolloClient } from "@apollo/client";
import { gql } from "@apollo/client";

const staticAvatar = "/path/to/static/avatar.jpg";


const GET_ADMINS = gql`
  query GetAdmins {
    getAdmins {
      id
      fullName
      username
    }
  }
`;

const GET_MESSAGES = gql`
  query GetMessages($userId: ID!, $adminId: ID!) {
    getMessages(userId: $userId, adminId: $adminId) {
      id
      senderId
      recivedId
      content
      timestamp
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation SendMessage($senderId: ID!, $recivedId: ID!, $content: String!) {
    sendMessage(senderId: $senderId, recivedId: $recivedId, content: $content) {
      id
      senderId
      recivedId
      content
      timestamp
    }
  }
`;

const MESSAGE_SUBSCRIPTION = gql`
  subscription MessageSent($receiverId: ID!, $senderId: ID!) {
    messageSent(receiverId: $receiverId, senderId: $senderId) {
      id
      senderId
      recivedId
      content
      timestamp
    }
  }
`;

const ChatWithAdmins = () => {
  const [userId, setUserId] = useState(null);
  const { loading, error, data } = useQuery(GET_ADMINS);
  const [sendMessage] = useMutation(SEND_MESSAGE);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const client = useApolloClient();
  const messagesEndRef = useRef(null); 

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);

  useSubscription(MESSAGE_SUBSCRIPTION, {
    variables: { receiverId: userId, senderId: selectedAdmin?.id || "" },
    skip: !userId || !selectedAdmin,
    onSubscriptionData: ({ subscriptionData }) => {
      if (subscriptionData.data?.messageSent) {
        setMessages((prev) => [...prev, subscriptionData.data.messageSent]);
      }
    },
  });

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const handleAdminClick = async (admin) => {
    setSelectedAdmin(admin);

    if (userId) {
      try {
        const { data } = await client.query({
          query: GET_MESSAGES,
          variables: { userId, adminId: admin.id },
          fetchPolicy: "network-only",
        });
        setMessages(data.getMessages || []);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return alert("Cannot send an empty message.");
    if (!selectedAdmin) return alert("Please select an admin to chat with.");
    if (!userId) return alert("User ID is not available.");

    const newMessageData = {
      id: `temp-${Date.now()}`, 
      senderId: userId,
      recivedId: selectedAdmin.id,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    
    setMessages((prev) => [...prev, newMessageData]);
    setNewMessage("");

    try {
      const { data } = await sendMessage({
        variables: {
          senderId: userId,
          recivedId: selectedAdmin.id,
          content: newMessageData.content,
        },
      });

      
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessageData.id ? data.sendMessage : msg
        )
      );
    } catch (error) {
      console.error("Error sending message:", error);
     
    }
  };

  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading admins: {error.message}</p>;

  const admins = data?.getAdmins || [];

  return (
    <div className="p-6 bg-[#1A202C] text-white min-h-screen flex flex-col">
      <h2 className="text-xl font-bold mb-4">Chat with Admins</h2>
      <input
        type="text"
        className="w-full p-2 mb-4 rounded border border-gray-300 bg-white text-black placeholder-gray-500"
        placeholder="Search for an admin..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <div className="mb-6 bg-[#1f2937] p-8 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold mb-2">Available Admins</h3>
        <ul className="flex gap-4">
          {admins
            .filter((admin) =>
              admin.fullName.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((admin) => (
              <li
  key={admin.id}
  className="flex flex-col items-center cursor-pointer"
  onClick={() => handleAdminClick(admin)}
>

                <img
                  src={staticAvatar}
                  alt={admin.fullName}
                  className="w-12 h-12 rounded-full bg-white"
                />
                <span className="text-sm font-bold text-gray-300 mt-2">
                  {admin.fullName}
                </span>
              </li>
            ))}
        </ul>
      </div>

      {selectedAdmin && (
        <div className="border-t border-gray-700 pt-4 flex flex-col flex-grow bg-[#1f2937] p-8 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4">
            Chat with: {selectedAdmin.fullName}
          </h3>
          <div className="flex-grow overflow-y-auto max-h-80 mb-4 p-4 rounded space-y-2 bg-[#1f2937]">
          {messages.map((message, index) => (
              <div key={index} className="mb-2">
                <span
                  className={`font-bold ${
                    message.senderId === userId ? "text-gray-400" : "text-gray-400"
                  }`}
                >
                  {message.senderId === userId ? "You:" : `${selectedAdmin.fullName}:`}
                </span>
                <span
                  className={`ml-1 ${
                    message.senderId === userId ? "text-green-500" : "text-blue-500"
                  }`}
                >
                  {message.content}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} /> {/* Scroll target */}
          </div>

          <div className="flex flex-col gap-2">
            <textarea
              className="w-full p-2 rounded border border-gray-300 bg-white text-black"
              rows="3"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              className="self-start px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWithAdmins;
