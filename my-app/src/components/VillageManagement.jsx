import React, { useState, useEffect } from "react";
import { useQuery, useSubscription, useMutation, gql } from "@apollo/client";
import { GET_VILLAGES } from "../graphql/queries";
import { VILLAGE_ADDED_SUBSCRIPTION } from "../graphql/subscriptions";
import AddVillageModal from "./AddVillageModal";
import ViewVillageModal from "./ViewVillageModal";
import UpdateVillageModal from "./UpdateVillageModal";
import { DELETE_VILLAGE } from "../graphql/queries";
import UpdateDemographicModal from "./UpdateDemographicModal";

const GET_USERS = gql`
  query GetUsers {
    getttuserss {
      id
      fullName
      username
    }
  }
`;

UpdateVillageModal.defaultProps = {
  onUpdated: () => {},
};

const VillageList = () => {
  const { data, loading, error, client } = useQuery(GET_VILLAGES);
  const { data: userData, loading: userLoading } = useQuery(GET_USERS);

  const [villages, setVillages] = useState([]);
  const [sortedVillages, setSortedVillages] = useState([]);
  const [filteredVillages, setFilteredVillages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDemographicModalOpen, setIsDemographicModalOpen] = useState(false);
  const [selectedVillage, setSelectedVillage] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [sortOption, setSortOption] = useState("default");

  const loggedInUserId = localStorage.getItem("userId");
  const isUserInList = userData?.getttuserss?.some(
    (user) => user.id === loggedInUserId
  );

  useEffect(() => {
    if (data && data.getVillages) {
      setVillages(data.getVillages);
    }
  }, [data]);

  useEffect(() => {
    let sortedData = [...villages];
    if (sortOption === "alphabetical") {
      sortedData.sort((a, b) => a.name.localeCompare(b.name));
    }
    setSortedVillages(sortedData);
  }, [villages, sortOption]);

  useEffect(() => {
    const filtered = sortedVillages.filter((village) =>
      village.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVillages(filtered);
    setCurrentPage(1);
  }, [searchTerm, sortedVillages]);

  useSubscription(VILLAGE_ADDED_SUBSCRIPTION, {
    onSubscriptionData: ({ subscriptionData }) => {
      if (subscriptionData.data) {
        const newVillage = subscriptionData.data.villageAdded;
        client.cache.modify({
          fields: {
            getVillages(existingVillages = []) {
              const newVillageRef = client.cache.writeFragment({
                data: newVillage,
                fragment: gql`
                  fragment NewVillage on Village {
                    id
                    name
                    region
                    landArea
                    latitude
                    longitude
                    img
                    categories
                    populationGrowthRate
                  }
                `,
              });
              return [...existingVillages, newVillageRef];
            },
          },
        });
        setVillages((prevVillages) => [...prevVillages, newVillage]);
      }
    },
  });

  const [deleteVillage] = useMutation(DELETE_VILLAGE, {
    update(cache, { data: { deleteVillage } }) {
      cache.modify({
        fields: {
          getVillages(existingVillages = [], { readField }) {
            return existingVillages.filter(
              (villageRef) => deleteVillage.id !== readField("id", villageRef)
            );
          },
        },
      });
    },
    onError: (error) => {
      console.error("Error deleting village:", error.message);
    },
  });

  const handleUpdateVillage = (updatedVillage) => {
    setVillages((prevVillages) =>
      prevVillages.map((village) =>
        village.id === updatedVillage.id ? updatedVillage : village
      )
    );
    setIsUpdateModalOpen(false);
  };

  const handleUpdateDemographic = (updatedDemographic) => {
    setVillages((prevVillages) =>
      prevVillages.map((village) =>
        village.id === updatedDemographic.id
          ? { ...village, ...updatedDemographic }
          : village
      )
    );
    setIsDemographicModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this village?")) {
      try {
        await deleteVillage({ variables: { id } });
        setVillages((prevVillages) =>
          prevVillages.filter((village) => village.id !== id)
        );
        alert("Village deleted successfully!");
      } catch (error) {
        console.error("Error deleting village:", error.message);
      }
    }
  };

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const openViewModal = (village) => {
    setSelectedVillage(village);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setSelectedVillage(null);
    setIsViewModalOpen(false);
  };

  const openUpdateModal = (village) => {
    setSelectedVillage(village);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setSelectedVillage(null);
    setIsUpdateModalOpen(false);
  };

  const openDemographicModal = (village) => {
    setSelectedVillage(village);
    setIsDemographicModalOpen(true);
  };

  if (loading || userLoading) return <div>Loading villages...</div>;
  if (error) return <div>Error fetching villages: {error.message}</div>;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVillages = filteredVillages.slice(startIndex, endIndex);

  const handleNext = () => {
    if (endIndex < filteredVillages.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <div className="bg-[#1A202C] min-h-screen p-6 text-white">
      {!isUserInList && (
        <button
          className="bg-[#718096] px-4 py-2 rounded mb-4 "
          onClick={openAddModal}
        >
          Add New Village
        </button>
      )}
      {isAddModalOpen && <AddVillageModal closeModal={closeAddModal} />}
      {isViewModalOpen && (
        <ViewVillageModal
          isOpen={isViewModalOpen}
          onClose={closeViewModal}
          village={selectedVillage}
        />
      )}
      {isUpdateModalOpen && (
        <UpdateVillageModal
          isOpen={isUpdateModalOpen}
          onClose={closeUpdateModal}
          village={selectedVillage}
          onUpdated={handleUpdateVillage}
        />
      )}
      {isDemographicModalOpen && (
        <UpdateDemographicModal
          isOpen={isDemographicModalOpen}
          onClose={() => setIsDemographicModalOpen(false)}
          village={selectedVillage}
          onSave={handleUpdateDemographic}
        />
      )}

      <div className="bg-[#2d3748] p-4 rounded">
        <h2 className="text-xl font-bold mb-4">View Village List</h2>
        <input
          type="text"
          placeholder="Search villages..."
          className="w-full mb-4 px-3 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <label className="mr-2">Sort by:</label>
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="bg-gray-700 px-3 py-2 rounded border border-gray-600"
            >
              <option value="default">Default</option>
              <option value="alphabetical">Alphabetical (A-Z)</option>
            </select>
          </div>
          <div className="flex gap-2"><label className="mr-2 mt-2">Page :</label>
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${
                currentPage === 1
                  ? "bg-[#718096] cursor-not-allowed"
                  : "bg-[#718096] hover:bg-[#4c5c6d]"
              }`}
            >
              Prev
            </button>
            <button
              onClick={handleNext}
              disabled={endIndex >= filteredVillages.length}
              className={`px-4 py-2 rounded ${
                endIndex >= filteredVillages.length
                  ? "bg-[#718096] cursor-not-allowed"
                  : "bg-[#718096] hover:bg-[#4c5c6d]"
              }`}
            >
              Next
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {currentVillages.map((village) => (
            <div
              key={village.id}
              className="bg-gray-700 px-4 py-3 rounded flex items-center justify-between"
            >
              <span>{`${village.name} - ${village.region}`}</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => openViewModal(village)}
                  className="bg-[#718096] px-3 py-1 rounded hover:bg-[#4c5c6d]"
                >
                  View
                </button>
                {!isUserInList && (
                  <button
                    onClick={() => openUpdateModal(village)}
                    className="bg-[#718096] px-3 py-1 rounded hover:bg-[#4c5c6d]"
                  >
                    Update
                  </button>
                )}
                {!isUserInList && (
                  <button
                    onClick={() => openDemographicModal(village)}
                    className="bg-[#718096] px-3 py-1 rounded hover:bg-[#4c5c6d]"
                  >
                    Update Demographic
                  </button>
                )}
                {!isUserInList && (
                  <button
                    onClick={() => handleDelete(village.id)}
                    className="bg-[#718096] px-3 py-1 rounded hover:bg-[#4c5c6d]"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
};

export default VillageList;
