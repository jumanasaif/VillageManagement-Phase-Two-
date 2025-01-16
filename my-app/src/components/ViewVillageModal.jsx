import React from "react";

const ViewVillageModal = ({ isOpen, onClose, village }) => {
  if (!isOpen) return null;

  const {
    name,
    region,
    landArea,
    latitude,
    longitude,
    categories,
    img,
  } = village || {};

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-gray-800 text-white rounded-lg w-11/12 max-w-md p-6 relative">
        <button
          className="absolute top-4 right-4 text-2xl font-bold text-gray-400 hover:text-gray-200"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="text-xl font-bold text-white mb-4">Village Details</div>
        <div className="space-y-3">
          <p>
            <strong>Village Name:</strong> <span>{name || "N/A"}</span>
          </p>
          <p>
            <strong>Region/District:</strong> <span>{region || "N/A"}</span>
          </p>
          <p>
            <strong>Land Area (sq km):</strong> <span>{landArea || "N/A"}</span>
          </p>
          <p>
            <strong>Latitude:</strong> <span>{latitude || "N/A"}</span>
          </p>
          <p>
            <strong>Longitude:</strong> <span>{longitude || "N/A"}</span>
          </p>
          <p>
            <strong>Tags:</strong>{" "}
            <span>
              {categories && categories.length > 0
                ? categories.join(", ")
                : "N/A"}
            </span>
          </p>
          {img && (
            <div>
              <img
                src={img}
                alt="Village"
                className="rounded-lg w-full max-h-48 object-cover mt-2"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewVillageModal;
