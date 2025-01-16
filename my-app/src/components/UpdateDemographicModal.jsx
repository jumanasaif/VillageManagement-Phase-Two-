import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";

const UPDATE_DEMOGRAPHIC = gql`
  mutation UpdateDemographic($id: ID!, $input: DemographicInput!) {
    updateDemographic(id: $id, input: $input) {
      id
      populationSize
      genderRatio {
        male
        female
      }
      populationDistribution {
        ageRange
        percentage
      }
      populationGrowthRate
    }
  }
`;

const UpdateDemographicModal = ({ isOpen, onClose, village, onSave }) => {
  const [populationSize, setPopulationSize] = useState(village?.populationSize || "");
  const [ageDistribution, setAgeDistribution] = useState(
    village?.populationDistribution
      ?.map(({ ageRange, percentage }) => `${ageRange}: ${percentage}`)
      .join(", ") || ""
  );
  const [genderRatio, setGenderRatio] = useState(
    `Male: ${village?.genderRatio?.male || 0}%, Female: ${village?.genderRatio?.female || 0}%`
  );
  const [growthRate, setGrowthRate] = useState(village?.populationGrowthRate || "");

  const [updateDemographic] = useMutation(UPDATE_DEMOGRAPHIC);

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      const formattedAgeDistribution = ageDistribution
        .split(",")
        .map((entry) => {
          const parts = entry.split(":");
          if (parts.length !== 2) throw new Error("Invalid age distribution format.");
          const ageRange = parts[0].trim();
          const percentage = parts[1].replace("%", "").trim(); 
          return { ageRange, percentage };
        });
  
      const formattedGenderRatio = genderRatio
        .split(",")
        .reduce((acc, entry) => {
          const parts = entry.split(":");
          if (parts.length !== 2) throw new Error("Invalid gender ratio format.");
          const key = parts[0].trim().toLowerCase();
          const value = parseFloat(parts[1].replace("%", "").trim()); 
          acc[key] = value;
          return acc;
        }, {});
  
      const input = {
        populationSize: parseFloat(populationSize),
        populationDistribution: formattedAgeDistribution,
        genderRatio: formattedGenderRatio,
        growthRate: parseFloat(growthRate),
      };
  
      const { data } = await updateDemographic({
        variables: { id: village.id, input },
      });
  
      alert("Demographic data updated successfully!");
      onSave(data.updateDemographic);
      onClose();
    } catch (error) {
      console.error("Error updating demographic data:", error.message);
      alert(`Failed to update demographic data. Error: ${error.message}`);
    }
  };
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Update Demographic Data</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1">Population Size</label>
            <input
              type="number"
              value={populationSize}
              onChange={(e) => setPopulationSize(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-700 text-gray-100"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Age Distribution</label>
            <input
              type="text"
              value={ageDistribution}
              onChange={(e) => setAgeDistribution(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-700 text-gray-100"
              placeholder="e.g., children: 30%, adults: 60%, seniors: 10%"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Gender Ratio</label>
            <input
              type="text"
              value={genderRatio}
              onChange={(e) => setGenderRatio(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-700 text-gray-100"
              placeholder="e.g., Male: 49%, Female: 51%"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Population Growth Rate (%)</label>
            <input
              type="number"
              value={growthRate}
              onChange={(e) => setGrowthRate(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-700 text-gray-100"
              required
            />
          </div>
        </div>
        <button
          onClick={handleSave}
          className="w-full mt-4 bg-[#718096] text-white py-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default UpdateDemographicModal;
