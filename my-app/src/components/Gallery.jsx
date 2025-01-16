import React, { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";

const GET_USERS = gql`
  query GetUsers {
    getttuserss {
      id
      fullName
      username
    }
  }
`;



const GET_IMAGES = gql`
  query GetImages {
    getImages {
      id
      url
      description
    }
  }
`;


const ADD_IMAGE_MUTATION = gql`
  mutation AddImage($input: AddImageInput!) {
    addImage(input: $input) {
      id
      description
      url
    }
  }
`;

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const Gallery = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageDescription, setImageDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
const { data: userData, loading: userLoading } = useQuery(GET_USERS);
  
  const { loading, error, data, refetch } = useQuery(GET_IMAGES);

  const [addImage] = useMutation(ADD_IMAGE_MUTATION);

  const loggedInUserId = localStorage.getItem("userId");
  const isUserInList = userData?.getttuserss?.some(
    (user) => user.id === loggedInUserId
  );

  const handleAddImageClick = () => {
    setIsModalOpen(true);
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
    setImageDescription("");
    setImageFile(null);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64String = await convertToBase64(file);
        setImageFile(base64String); 
      } catch (error) {
        console.error("Image conversion error:", error);
        alert("Failed to convert image to Base64.");
      }
    }
  };

  const handleSaveImage = async (e) => {
    e.preventDefault();

    if (imageFile && imageDescription) {
      try {
        const { data } = await addImage({
          variables: {
            input: {
              description: imageDescription,
              url: imageFile, 
            },
          },
        });

        await refetch();  

        setIsModalOpen(false);
        setImageDescription("");
        setImageFile(null);
      } catch (error) {
        console.error("Error saving image:", error);
        alert("Failed to save the image. Please try again.");
      }
    }
  };

  
  if (loading) return <p>Loading images...</p>;
  if (error) return <p>Error loading images: {error.message}</p>;

  return (
    <div className="p-4 bg-[#232c3c] min-h-screen text-white">
      <div className="flex justify-start mb-6">
        {!isUserInList && (
        <button
          className="bg-[#718096] hover:bg-[#4c5c6d] text-white py-2 px-4 rounded"
          onClick={handleAddImageClick}
        >
          Add New Image
        </button>
)}
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Render images fetched from MongoDB */}
        {data.getImages.map((item) => (
          <div
            key={item.id}
            className="bg-gray-700 rounded-lg p-4 flex flex-col items-center text-center"
          >
            <img
              src={item.url}
              alt="Gallery"
              className="w-80 h-40 object-cover rounded-lg mb-3"
            />
            <p className="text-sm text-gray-400 truncate">{item.description}</p>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-4/5 sm:w-3/4 md:w-2/3">
            <h2 className="text-white text-xl mb-4">Add New Image</h2>
            <form onSubmit={handleSaveImage}>
              <label htmlFor="image-description" className="text-gray-300">
                Description:
              </label>
              <textarea
                id="image-description"
                placeholder="Enter description"
                required
                value={imageDescription}
                onChange={(e) => setImageDescription(e.target.value)}
                className="w-full bg-gray-700 text-white p-3 rounded mb-4"
              />
              <label htmlFor="image-file" className="text-gray-300">
                Choose Image:
              </label>
              <input
                type="file"
                id="image-file"
                accept="image/*"
                required
                onChange={handleImageChange}
                className="w-full bg-gray-700 text-white p-3 rounded mb-6"
              />
              <div className="flex justify-end gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                  onClick={handleCancelModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
