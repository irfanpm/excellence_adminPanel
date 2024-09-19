import React, { useState, useEffect } from "react";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { doc, getDoc, updateDoc, deleteDoc, collection, getDocs, addDoc } from "firebase/firestore";
import { fireDB, fireStorage } from "../../Firebase/fireBaseConfig.jsx";
import Modal from "react-modal";

// Set the app element for accessibility reasons
Modal.setAppElement("#root");

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [uploadImage, setUploadimage] = useState(null);
  const [caption, setCaption] = useState("");
  const [group, setGroup] = useState("");
  const [editingImage, setEditingImage] = useState(null);
  const [newCaption, setNewCaption] = useState("");
  const [newGroup, setNewGroup] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    fetchDatabaseImages();
  }, []);

  const fetchDatabaseImages = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(fireDB, "gallery"));
      const imagesArray = [];
      querySnapshot.forEach((doc) => {
        imagesArray.push({ id: doc.id, ...doc.data() });
      });
      setImages(imagesArray);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async () => {
    if (!uploadImage) return;
    setLoading(true);
  
    const imageRef = ref(fireStorage, `images/${uploadImage.name}`);
    try {
      await uploadBytes(imageRef, uploadImage);
      const imageUrl = await getDownloadURL(imageRef);
      await addDoc(collection(fireDB, "gallery"), {
        imageUrl,
        storagePath: imageRef.fullPath,
        caption,
        group,
      });
  
      setCaption("");
      setGroup("");
      setUploadimage(null);
      fetchDatabaseImages();
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageDelete = async (imagePath, imageDocId) => {
    if (!imagePath || imagePath === "/") {
      console.error("Invalid image path");
      return;
    }
    setLoading(true);

    const imageRef = ref(fireStorage, imagePath);
    try {
      await deleteObject(imageRef);
      if (imageDocId) {
        const docRef = doc(fireDB, "gallery", imageDocId);
        await deleteDoc(docRef);
        fetchDatabaseImages();
      }
      console.log("Image and document deleted successfully");
    } catch (error) {
      console.error("Error deleting image or document:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = (imagePath, imageDocId) => {
    handleImageDelete(imagePath, imageDocId);
  };

  const handleImageEdit = async () => {
    if (!editId) return;
    setLoading(true);

    const imageData = { caption: newCaption, group: newGroup };
    if (newImage) {
      const imageRef = ref(fireStorage, `images/${newImage.name}`);
      await uploadBytes(imageRef, newImage);
      const newImageUrl = await getDownloadURL(imageRef);
      imageData.imageUrl = newImageUrl;
    }

    try {
      await updateDoc(doc(fireDB, "gallery", editId), imageData);
      setEditingImage(null);
      setNewCaption("");
      setNewGroup("");
      setNewImage(null);
      setModalVisible(false);
      fetchDatabaseImages();
    } catch (error) {
      console.error("Error editing image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <NavbarSidebarLayout isFooter={false}>
        <div className="bg-white border border-4 rounded-lg shadow relative m-10 p-6">
          <div className="flex flex-col items-center">
            <h3 className="text-2xl font-semibold mb-4">Gallery</h3>
            {loading && <div className="loader">Loading...</div>}
            <form>
              <div className="mb-6">
                <label htmlFor="caption" className="block text-sm font-medium text-gray-900 mb-2">
                  Caption
                </label>
                <input
                  type="text"
                  id="caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                  placeholder="Add caption"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="group" className="block text-sm font-medium text-gray-900 mb-2">
                  Group
                </label>
                <select
                  id="group"
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                  required
                >
                  <option value="">Select a group</option>
                  <option value="all">all</option>
                  <option value="buildings">buildings</option>
                  <option value="products">products</option>
                  <option value="production">production</option>
                </select>
              </div>
              <div className="mb-6">
                <label htmlFor="image-upload" className="block text-sm font-medium text-gray-900 mb-2">
                  Image Upload
                </label>
                <input
                  id="image-upload"
                  type="file"
                  onChange={(e) => setUploadimage(e.target.files[0])}
                  className="block w-full text-sm text-gray-500 file:py-2 file:px-4 file:mr-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-900 hover:file:bg-gray-100"
                />
              </div>
              <button
                onClick={handleImageUpload}
                type="button"
                className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Save
              </button>
            </form>
          </div>

          <div className="mt-10">
            <h4 className="text-xl font-semibold mb-4">Uploaded Images</h4>
            {loading && <div className="loader">Loading...</div>}
            <div className="flex flex-wrap">
              {images.map((image) => (
                <a href="#" key={image.id} className="group relative flex h-96 w-1/2 items-end overflow-hidden rounded-lg bg-gray-100 p-4 shadow-lg">
                  <img src={image.imageUrl} loading="lazy" width={300} height={300} alt={image.caption} className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />
                  <div className="relative flex w-full flex-col rounded-lg bg-white p-4 text-center">
                    <span className="text-gray-500">{image.caption}</span>
                    <span className="text-lg font-bold text-gray-800 lg:text-xl">{image.group}</span>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          setEditId(image.id);
                          setEditingImage(image.imageUrl);
                          setNewCaption(image.caption);
                          setNewGroup(image.group);
                          setModalVisible(true);
                        }}
                        className="text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-3 py-1.5"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteImage(image.storagePath, image.id)}
                        className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-1.5"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Modal */}
        <Modal
          isOpen={modalVisible}
          onRequestClose={() => setModalVisible(false)}
          contentLabel="Edit Image Modal"
          style={{
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
              width: "90%",
              maxWidth: "600px",
              maxHeight: "80vh", // Limit the height of the modal
              overflowY: "auto", // Enable vertical scrolling
            },
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.75)",
            },
          }}
        >
          <div className="bg-white p-6 rounded-lg overflow-auto">
            <h2 className="text-xl font-semibold mb-4">Edit Image</h2>
            <div className="mb-4">
              <label htmlFor="new-caption" className="block text-sm font-medium text-gray-900 mb-2">
                New Caption
              </label>
              <img src={editingImage} loading="lazy" alt="Preview" className="w-1/2" />
              <input
                type="text"
                id="new-caption"
                value={newCaption}
                onChange={(e) => setNewCaption(e.target.value)}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                placeholder="Edit caption"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="new-group" className="block text-sm font-medium text-gray-900 mb-2">
                New Group
              </label>
              <select
                id="new-group"
                value={newGroup}
                onChange={(e) => setNewGroup(e.target.value)}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                required
              >
                <option value="">Select a group</option>
                <option value="all">all</option>
                <option value="buildings">buildings</option>
                <option value="products">products</option>
                <option value="production">production</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="new-image" className="block text-sm font-medium text-gray-900 mb-2">
                New Image (optional)
              </label>
              <input
                id="new-image"
                type="file"
                onChange={(e) => setNewImage(e.target.files[0])}
                className="block w-full text-sm text-gray-500 file:py-2 file:px-4 file:mr-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-900 hover:file:bg-gray-100"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleImageEdit}
                className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Save
              </button>
              <button
                onClick={() => setModalVisible(false)}
                className="text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      </NavbarSidebarLayout>
    </div>
  );
};

export default Gallery;
