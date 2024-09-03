import React, { useState, useEffect } from 'react';
import { Timestamp, addDoc, collection, doc, updateDoc, getDoc } from "firebase/firestore";
import { fireDB, fireStorage } from "../../Firebase/fireBaseConfig.jsx";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import NavbarSidebarLayout from '../../layouts/navbar-sidebar';

const Homepage = () => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    mainImage: ''
  });
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        const docRef = doc(fireDB, "homepage", "homepageDetails");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const { title, subtitle, mainImage } = docSnap.data();
          setFormData({ title, subtitle, mainImage });
          if (mainImage) {
            setImagePreview(mainImage);
          }
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error('There was an error fetching the homepage data!', error);
      }
    };

    fetchHomepageData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prevState => ({
      ...prevState,
      mainImage: file
    }));
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = formData.mainImage;

    try {
        if (formData.mainImage && typeof formData.mainImage !== 'string') {
            const imageRef = ref(fireStorage, `homepageImages/${formData.mainImage.name}`);
            await uploadBytes(imageRef, formData.mainImage);
            imageUrl = await getDownloadURL(imageRef);
            console.log('Image uploaded successfully:', imageUrl);
        }

        const formDataToSubmit = {
            title: formData.title,
            subtitle: formData.subtitle,
            mainImage: imageUrl,
        };

        console.log('Form Data to Submit:', formDataToSubmit);

        const docRef = doc(fireDB, "homepage", "homepageDetails");
        await updateDoc(docRef, formDataToSubmit);
        console.log('Homepage details updated successfully!');
        alert('Homepage details updated successfully!');
    } catch (error) {
        console.error('There was an error updating the homepage details!', error);
    }
  };

  return (
    <NavbarSidebarLayout isFooter={false}>
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
        <h3 className="text-2xl font-bold mb-8 text-center">Edit Homepage Details</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="title" className="block text-lg font-semibold text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={formData?.title}
                onChange={handleChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                placeholder="Add title"
                required
              />
            </div>

            <div>
              <label htmlFor="subtitle" className="block text-lg font-semibold text-gray-700 mb-2">
                Subtitle
              </label>
              <input
                type="text"
                name="subtitle"
                id="subtitle"
                value={formData?.subtitle}
                onChange={handleChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                placeholder="Add subtitle"
                required
              />
            </div>

            <div className="col-span-1 sm:col-span-2 mb-4">
              <label htmlFor="mainImage" className="block text-lg font-semibold text-gray-700 mb-2">
                Image Upload
              </label>
              <div className="flex items-center">
                <label className="w-full cursor-pointer flex justify-center items-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <input
                    className="hidden"
                    type="file"
                    onChange={handleFileChange}
                  />
                  <span className="text-gray-500">Select an image or drag it here</span>
                </label>
              </div>
              {imagePreview && (
                <div className="mt-4 flex justify-center">
                  <img src={imagePreview} alt="Selected" className="rounded-lg w-1/2 h-24 object-cover" />
                </div>
              )}
            </div>
          </div>
          <div className=" flex justify-center">
            <button
              type="submit"
              className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-3"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </NavbarSidebarLayout>
  );
};

export default Homepage;
