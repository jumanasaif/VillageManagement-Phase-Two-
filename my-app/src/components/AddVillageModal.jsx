import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_VILLAGE } from "../graphql/queries"; 
import { GET_VILLAGES } from "../graphql/queries"; 

const AddVillageModal = ({ closeModal }) => {
  const [formData, setFormData] = useState({
    name: "",
    region: "",
    landArea: "",
    latitude: "",
    longitude: "",
    img: "", 
    categories: "",
    populationSize: "0", 
    populationDistribution: [
      { ageRange: "children", percentage: "30%" },
      { ageRange: "adults", percentage: "60%" },
      { ageRange: "seniors", percentage: "10%" },
    ],
    genderRatio: { male: "49", female: "51" },
    populationGrowthRate: "1.8",
  });
  const [uploading, setUploading] = useState(false);

  
  const [addVillageMutation, { loading, error }] = useMutation(ADD_VILLAGE, {
    refetchQueries: [{ query: GET_VILLAGES }],
    onCompleted: () => {
      alert("Village added successfully!");
      closeModal(); 
    },
    onError: (err) => {
      console.error("Mutation Error:", err);
      alert(`Error: ${err.message || "An unexpected error occurred."}`);
    },
  });

  
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      try {
        const base64String = await convertToBase64(file);
        setFormData((prevData) => ({
          ...prevData,
          img: base64String,
        }));
      } catch (error) {
        console.error("Image conversion error:", error);
        alert("Failed to convert image to Base64.");
      } finally {
        setUploading(false);
      }
    }
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      name,
      region,
      landArea,
      latitude,
      longitude,
      img,
      categories,
      populationDistribution,
      populationSize,
      genderRatio,
      populationGrowthRate,
    } = formData;

    
    if (!landArea || isNaN(landArea)) {
      alert("Error: Land area must be a valid number.");
      return;
    }
    if (!latitude || isNaN(latitude)) {
      alert("Error: Latitude must be a valid number.");
      return;
    }
    if (!longitude || isNaN(longitude)) {
      alert("Error: Longitude must be a valid number.");
      return;
    }
    if (!populationGrowthRate || isNaN(populationGrowthRate)) {
      alert("Error: Population growth rate must be a valid number.");
      return;
    }

   
    addVillageMutation({
      variables: {
        input: {
          name,
          region,
          landArea: parseFloat(landArea),
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          img, 
          categories: categories
            ? categories.split(",").map((cat) => cat.trim())
            : [],
          populationDistribution,
          populationSize: parseFloat(populationSize), 
          genderRatio: {
            male: parseFloat(genderRatio.male),
            female: parseFloat(genderRatio.female),
          },
          populationGrowthRate: parseFloat(populationGrowthRate),
        },
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-800 w-96 rounded-lg shadow-lg p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-xl"
          onClick={closeModal}
        >
          &times;
        </button>
        <div className="text-xl font-bold text-gray-300 mb-4">Add New Village</div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm text-gray-400 mb-1">
              Village Name:
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-500 text-white"
              placeholder="Enter village name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="region" className="block text-sm text-gray-400 mb-1">
              Region/District:
            </label>
            <input
              type="text"
              id="region"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-500 text-white"
              placeholder="Enter region/district"
              value={formData.region}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="landArea" className="block text-sm text-gray-400 mb-1">
              Land Area (sq km):
            </label>
            <input
              type="number"
              id="landArea"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-500 text-white"
              placeholder="Enter land area"
              value={formData.landArea}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="latitude" className="block text-sm text-gray-400 mb-1">
              Latitude:
            </label>
            <input
              type="number"
              id="latitude"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-500 text-white"
              placeholder="Enter latitude"
              value={formData.latitude}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="longitude" className="block text-sm text-gray-400 mb-1">
              Longitude:
            </label>
            <input
              type="number"
              id="longitude"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-500 text-white"
              placeholder="Enter longitude"
              value={formData.longitude}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="image" className="block text-sm text-gray-400 mb-1">
              Upload Image:
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-500 text-white"
              onChange={handleImageChange}
            />
          </div>
          <div>
            <label htmlFor="categories" className="block text-sm text-gray-400 mb-1">
              Categories/Tags:
            </label>
            <input
              type="text"
              id="categories"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-500 text-white"
              placeholder="e.g., rural, urban"
              value={formData.categories}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-[#718096] text-white rounded-md hover:bg-blue-700"
            disabled={uploading || loading}
          >
            {uploading
              ? "Processing Image..."
              : loading
              ? "Submitting..."
              : "Add Village"}
          </button>
        </form>
        {error && <p className="text-red-500 mt-2">{error.message}</p>}
      </div>
    </div>
  );
};

export default AddVillageModal;
