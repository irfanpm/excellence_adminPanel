import React, { useEffect, useState } from 'react';
import NavbarSidebarLayout from '../../layouts/navbar-sidebar';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { fireDB, fireStorage } from "../../Firebase/fireBaseConfig.jsx";

const About = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(''); // State for the image preview

  // Fetch existing data from Firebase Firestore when the component mounts
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const docRef = doc(fireDB, "about", "aboutPage");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || '');
          setDescription(data.content || '');
          if (data.imageUrl) {
            setImagePreview(data.imageUrl);
          }
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchAboutData();
  }, []);

  // Handle file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      let imageUrl = imagePreview;

      if (image) {
        const imageRef = ref(fireStorage, `aboutImages/${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      const aboutRef = doc(fireDB, "about", "aboutPage");
      await updateDoc(aboutRef, {
        title: title,
        content: description,
        imageUrl: imageUrl,
      });

      alert("Successfully updated data");
    } catch (error) {
      console.error('Error:', error);
      alert("Failed to update data");
    }
  };

  return (
    <NavbarSidebarLayout isFooter={false}>
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg m-10 p-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-700">Update About Page</h3>
        </div>
        <div className="pt-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
              <div className="col-span-full">
                <label
                  htmlFor="image-upload"
                  className="text-sm font-medium text-gray-900 block mb-2"
                >
                  Upload Image
                </label>
                <div className="flex items-center justify-center">
                  <div className="relative flex flex-col items-center bg-gray-100 border-dashed border-4 border-gray-200 rounded-lg p-6 w-full max-w-md text-center">
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="object-cover w-1/2 h-64 mb-4 rounded-lg"
                      />
                    )}
                    <svg
                      className="text-blue-500 w-10 h-10 mx-auto mb-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </div>
              <div className="col-span-full">
                <label
                  htmlFor="title"
                  className="text-sm font-medium text-gray-900 block mb-2"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  className="block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="col-span-full">
                <label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-900 block mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  rows="6"
                  className="block w-full p-4 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </NavbarSidebarLayout>
  );
};

export default About;
