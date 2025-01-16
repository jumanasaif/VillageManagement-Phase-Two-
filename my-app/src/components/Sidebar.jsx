import React from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import VillageManagement from "./VillageManagement";
import Gallery from "./Gallery";
import Overview from "./Overview";
import ChatWithAdmins from "./ChatWithAdmins";
import ChatWithUsers from "./ChatWithUsers";


const GET_ADMINS = gql`
  query GetAdmins {
    getAdmins {
      id
      fullName
      username
    }
  }
`;


const GET_USER = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      fullName
    }
  }
`;

const SidebarPage = () => {
  const navigate = useNavigate(); 
  const storedUserId = localStorage.getItem("userId"); 

  const { data: adminData, loading: adminLoading, error: adminError } = useQuery(GET_ADMINS);

  const { data: userData, loading: userLoading, error: userError } = useQuery(GET_USER, {
    variables: { id: storedUserId },
    skip: !storedUserId, 
  });

  if (adminLoading || userLoading) return <div>Loading...</div>;
  if (adminError) return <div>Error loading admins: {adminError.message}</div>;
  if (userError) return <div>Error fetching user: {userError.message}</div>;

  const isAdmin = adminData?.getAdmins.some((admin) => admin.id === storedUserId);

  const ChatComponent = isAdmin ? ChatWithUsers : ChatWithAdmins;

  const handleLogout = () => {
    localStorage.removeItem("userId"); 
    navigate("/login"); 
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-1/5 bg-gray-800 text-white p-5 flex flex-col justify-between h-full">
        <div>
          <h2 className="text-2xl font-semibold mb-8">Dashboard</h2>
          <nav className="flex flex-col space-y-4">
            <Link
              to="/sidebar/overview"
              className="text-left py-2 px-4 w-full rounded hover:bg-gray-700"
            >
              Overview
            </Link>
            <Link
              to="/sidebar/village-management"
              className="text-left py-2 px-4 w-full rounded hover:bg-gray-700"
            >
              Village Management
            </Link>
            <Link
              to="/sidebar/chat"
              className="text-left py-2 px-4 w-full rounded hover:bg-gray-700"
            >
              Chat
            </Link>
            <Link
              to="/sidebar/gallery"
              className="text-left py-2 px-4 w-full rounded hover:bg-gray-700"
            >
              Gallery
            </Link>
          </nav>
        </div>
        <div className="mt-auto flex items-center space-x-3">
          <img
            src=""
            alt="Admin Avatar"
            className="w-10 h-10 rounded-full bg-gray-600"
          />
          {/* Dynamically display the user's full name */}
          <span id="name">{userData?.getUser?.fullName || "Name"}</span>
          <button
            onClick={handleLogout}
            className="text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-0 overflow-auto">
        <Routes>
        <Route
  path="overview"
  element={<div className="h-full bg-gray-200"><Overview /></div>}
/>

          <Route
            path="village-management"
            element={
              <div className="h-full w-full bg-gray-200">
                <VillageManagement />
              </div>
            }
          />
          <Route
            path="chat"
            element={
              <div className="h-full bg-gray-200">
                <ChatComponent />
              </div>
            }
          />
          <Route
            path="gallery"
            element={
              <div className="h-full bg-gray-200">
                <Gallery />
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default SidebarPage;
