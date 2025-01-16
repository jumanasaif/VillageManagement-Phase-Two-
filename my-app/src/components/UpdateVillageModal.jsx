import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useMutation } from "@apollo/client";
import { UPDATE_VILLAGE } from "../graphql/queries";

const UpdateVillageModal = ({ isOpen = false, onClose, village = {}, onUpdated = () => {} }) => {
  const [name, setName] = useState(village.name || "");
  const [region, setRegion] = useState(village.region || "");
  const [landArea, setLandArea] = useState(village.landArea || "");
  const [latitude, setLatitude] = useState(village.latitude || "");
  const [longitude, setLongitude] = useState(village.longitude || "");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [updateVillage] = useMutation(UPDATE_VILLAGE);

  useEffect(() => {
    if (village) {
      setName(village.name || "");
      setRegion(village.region || "");
      setLandArea(village.landArea || "");
      setLatitude(village.latitude || "");
      setLongitude(village.longitude || "");
      setImage(null);
    }
  }, [village]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please upload a valid image file.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setError("");
      };
      reader.onerror = () => {
        setError("Failed to read file. Please try again.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    if (!name || !region || !landArea || !latitude || !longitude) {
      setError("All fields are required.");
      return;
    }

    if (isNaN(latitude) || isNaN(longitude)) {
      setError("Latitude and Longitude must be valid numbers.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      let imgUrl = village.img;
      if (image) {
        imgUrl = image;
      }

      const input = {
        name,
        region,
        landArea: parseFloat(landArea),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        img: imgUrl,
        categories: village.categories || [],
        populationGrowthRate: village.populationGrowthRate || 0,
        populationSize: village.populationSize || 0,
      };

      const { data: updateData } = await updateVillage({
        variables: {
          id: village.id,
          input,
        },
      });

      console.log("Mutation response:", updateData);
      onUpdated(updateData.updateVillage);
      onClose();
    } catch (err) {
      console.error("Error updating village:", err);
      setError(err?.message || "Failed to update village. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-gray-800 w-full max-w-md rounded-lg shadow-lg p-6 relative animate-slide-down">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-600 text-xl"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="text-lg font-bold text-gray-300 mb-4">Update Village</div>
        {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="update-village-name"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              Village Name:
            </label>
            <input
              type="text"
              id="update-village-name"
              placeholder="Enter village name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="update-region-district"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              Region/District:
            </label>
            <input
              type="text"
              id="update-region-district"
              placeholder="Enter region/district"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="update-land-area"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              Land Area (sq km):
            </label>
            <input
              type="number"
              id="update-land-area"
              placeholder="Enter land area"
              value={landArea}
              onChange={(e) => setLandArea(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="update-latitude"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              Latitude:
            </label>
            <input
              type="text"
              id="update-latitude"
              placeholder="Enter latitude"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="update-longitude"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              Longitude:
            </label>
            <input
              type="text"
              id="update-longitude"
              placeholder="Enter longitude"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="update-image-upload"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              Upload New Image:
            </label>
            <input
              type="file"
              id="update-image-upload"
              className="w-full text-gray-400 bg-gray-800 border border-gray-600 rounded-md px-3 py-2 focus:outline-none"
              onChange={handleImageChange}
            />
          </div>
          <div>
            <button
              className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-medium"
              onClick={handleUpdate}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Village"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

UpdateVillageModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  village: PropTypes.object,
  onUpdated: PropTypes.func,
};

export default UpdateVillageModal;
