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
  const [loading, setLoading] = useState(false); // Loading state

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
    setLoading(true); // Start the loading spinner

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
        alert('There was an error updating the homepage details!');
    } finally {
        setLoading(false); // Stop the loading spinner after submission
    }
  };

  return (
    <NavbarSidebarLayout isFooter={false}>
      <div className={`relative ${loading ? 'blur-sm' : ''}`}>
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
                className={`text-white ${loading ? 'bg-gray-500' : 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700'} hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-3`}
                disabled={loading}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 1116 0A8 8 0 014 12z"
                    ></path>
                  </svg>
                ) : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Full-screen loading overlay */}
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

export default Homepage;
