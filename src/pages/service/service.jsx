import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, deleteDoc, collection, getDocs, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { fireDB, fireStorage } from "../../Firebase/fireBaseConfig.jsx";
import Modal from 'react-modal';
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";

const Service = () => {
  const [services, setServices] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const servicesCollection = collection(fireDB, 'services');
      const servicesSnapshot = await getDocs(servicesCollection);
      const servicesList = servicesSnapshot.docs.map(doc => ({ ...doc.data(), _id: doc.id }));
      setServices(servicesList);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleEditService = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading spinner
    const serviceRef = doc(fireDB, 'services', editingService._id);
    const updatedData = { title, description };

    if (image) {
      // Upload image and get URL
      const imageRef = ref(fireStorage, `serviceImage/${image.name}`);
      await uploadBytes(imageRef, image);
      const imageURL = await getDownloadURL(imageRef);
      updatedData.image = imageURL;
    }

    try {
      await updateDoc(serviceRef, updatedData);
      fetchServices();
      closeModal();
    } catch (error) {
      console.error('Error editing service:', error);
    } finally {
      setLoading(false); // Stop loading spinner after completion
    }
  };

  const handleDeleteService = async (id) => {
    try {
      const serviceRef = doc(fireDB, 'services', id);
      await deleteDoc(serviceRef);
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const openModal = (service) => {
    setEditingService(service);
    setTitle(service.title);
    setDescription(service.description);
    setImage(null);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <NavbarSidebarLayout isFooter={false}>
      <div className="m-10">
        <div className="mb-5 flex justify-between items-center">
          <h3 className="text-xl font-semibold">Service List</h3>
        </div>
        <div className="flex flex-wrap">
          {services.map((service) => (
            <div key={service._id} className="bg-white w-64 p-4 rounded-lg shadow-lg flex flex-col items-center text-center">
              <img 
                src={service.image || '/defaultImage.png'} 
                alt={service.title} 
                width={200}
                height={200}
                className="w-24 h-24 object-cover mb-3"
              />
              <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600 text-sm">{service.description}</p>
              <div className="mt-4 flex justify-center gap-3">
                <button onClick={() => openModal(service)} className="text-blue-500">Edit</button>
                <button onClick={() => handleDeleteService(service._id)} className="text-red-500">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Service Modal"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '600px',
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
          },
        }}
      >
        <h3 className="text-xl font-semibold">Edit Service</h3>
        <form onSubmit={handleEditService} className="mt-4 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              rows="3"
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
            <input
              id="image"
              name="image"
              type="file"
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              onChange={handleFileChange}
            />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={closeModal} className="mr-4 bg-gray-500 text-white p-2 rounded">
              Cancel
            </button>
            <button
              type="submit"
              className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              Save
            </button>
          </div>
        </form>
      </Modal>

      {/* Loading spinner */}
      {loading && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-center">
            <svg
              aria-hidden="true"
              className="w-16 h-16 text-white animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 100 101"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
        </div>
      )}
    </NavbarSidebarLayout>
  );
};

export default Service;
