import React, { useEffect, useState } from 'react';
import NavbarSidebarLayout from '../../layouts/navbar-sidebar';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { fireDB, fireStorage } from "../../Firebase/fireBaseConfig.jsx";

const MoreAbout = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(''); // State for the video preview

  // New state variables for additional fields
  const [happyCustomers, setHappyCustomers] = useState('');
  const [projectsDone, setProjectsDone] = useState('');
  const [averageRating, setAverageRating] = useState('');

  // Fetch existing data from Firebase Firestore when the component mounts
  useEffect(() => {
    const fetchMoreAboutData = async () => {
      try {
        const docRef = doc(fireDB, "MoreAbout", "MoreAboutPage");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || '');
          setDescription(data.content || '');
          if (data.videoUrl) {
            setVideoPreview(data.videoUrl);
          }
          // Set new state variables
          setHappyCustomers(data.happyCustomers || '');
          setProjectsDone(data.projectsDone || '');
          setAverageRating(data.averageRating || '');
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchMoreAboutData();
  }, []);

  // Handle file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideo(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      let videoUrl = videoPreview;

      if (video) {
        const videoRef = ref(fireStorage, `MoreAboutVideos/${video.name}`);
        await uploadBytes(videoRef, video);
        videoUrl = await getDownloadURL(videoRef);
      }

      const MoreAboutRef = doc(fireDB, "MoreAbout", "MoreAboutPage");
      await updateDoc(MoreAboutRef, {
        title: title,
        content: description,
        videoUrl: videoUrl,
        happyCustomers: happyCustomers,
        projectsDone: projectsDone,
        averageRating: averageRating
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
          <h3 className="text-2xl font-semibold text-gray-700">Update MoreAbout Page</h3>
        </div>
        <div className="pt-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
              {/* Video Upload Section */}
              <div className="col-span-full">
                <label
                  htmlFor="video-upload"
                  className="text-sm font-medium text-gray-900 block mb-2"
                >
                  Upload Video
                </label>
                <div className="flex items-center justify-center">
                  <div className="relative flex flex-col items-center bg-gray-100 border-dashed border-4 border-gray-200 rounded-lg p-6 w-full max-w-md text-center">
                    {videoPreview && (
                      <video
                        src={videoPreview}
                        controls
                        className="object-cover w-full h-64 mb-4 rounded-lg"
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
                      id="video-upload"
                      type="file"
                      accept="video/*"
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
              {/* New fields */}
              <div className="col-span-full">
                <label
                  htmlFor="happy-customers"
                  className="text-sm font-medium text-gray-900 block mb-2"
                >
                  Happy Customers
                </label>
                <input
                  type="text"
                  id="happy-customers"
                  className="block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter number of happy customers"
                  value={happyCustomers}
                  onChange={(e) => setHappyCustomers(e.target.value)}
                />
              </div>
              <div className="col-span-full">
                <label
                  htmlFor="projects-done"
                  className="text-sm font-medium text-gray-900 block mb-2"
                >
                  Projects Done
                </label>
                <input
                  type="text"
                  id="projects-done"
                  className="block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter number of projects done"
                  value={projectsDone}
                  onChange={(e) => setProjectsDone(e.target.value)}
                />
              </div>
              <div className="col-span-full">
                <label
                  htmlFor="average-rating"
                  className="text-sm font-medium text-gray-900 block mb-2"
                >
                  Average Rating   rating/10
                </label>
                <input
                  type="text"
                  id="average-rating"
                  className="block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter average rating"
                  value={averageRating}
                  onChange={(e) => setAverageRating(e.target.value)}
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

export default MoreAbout;
