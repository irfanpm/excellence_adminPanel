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
        <div className="flex flex-wrap ">
          {services.map((service) => (
            <div key={service._id} className="bg-white w-64 p-4 rounded-lg shadow-lg flex flex-col items-center text-center">
              <img 
                src={service.image || '/defaultImage.png'} 
                alt={service.title} 
                width={200}
                height={200}
                className="w-24 h-24 object-cover mb-3 "
              />
              <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600  text-sm">{service.description}</p>
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
    </NavbarSidebarLayout>
  );
};

export default Service;
