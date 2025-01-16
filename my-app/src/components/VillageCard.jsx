import React from "react";

const VillageCard = ({ village, onUpdate, onDemographics, onView }) => {
  return (
    <div className="bg-white rounded shadow p-4 flex flex-col justify-between">
      <h3 className="text-lg font-bold mb-2">{village.name}</h3>
      <p>
        <strong>Location:</strong> {village.location}
      </p>
      <div className="mt-4 flex justify-between">
        <button
          className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
          onClick={onView}
        >
          View
        </button>
        <button
          className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
          onClick={onUpdate}
        >
          Edit
        </button>
        <button
          className="bg-green-500 text-white px-2 py-1 rounded text-sm"
          onClick={onDemographics}
        >
          Demographics
        </button>
      </div>
    </div>
  );
};

export default VillageCard;
