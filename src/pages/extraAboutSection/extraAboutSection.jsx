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
  const [loading, setLoading] = useState(false); // Loading state for the spinner

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
    setLoading(true); // Start loading spinner

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
    } finally {
      setLoading(false); // Stop loading spinner
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

export default MoreAbout;
