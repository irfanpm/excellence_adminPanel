import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { fireDB } from "../../Firebase/fireBaseConfig.jsx";
import NavbarSidebarLayout from '../../layouts/navbar-sidebar';

const Contact = () => {
  const [contactDetails, setContactDetails] = useState({
    googleMapsLink: '',
    location: '',
    email: '',
    whatsappNumber: '',
    phoneNumber: '',
    facebookLink: '',
    instagramLink: '',
    address: ''
  });

  useEffect(() => {
    // Fetch existing contact details from Firebase Firestore
    const fetchContactDetails = async () => {
      try {
        const docRef = doc(fireDB, "contactDetails", "contactInfo");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setContactDetails(docSnap.data());
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Failed to fetch contact details:', error);
      }
    };

    fetchContactDetails();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setContactDetails((prevDetails) => ({
      ...prevDetails,
      [id]: value
    }));
  };

  const handleSave = async () => {
    try {
      const docRef = doc(fireDB, "contactDetails", "contactInfo");
      await updateDoc(docRef, contactDetails);
      alert('Contact details updated successfully');
    } catch (error) {
      console.error('Failed to save contact details:', error);
      alert('Failed to save contact details');
    }
  };

  return (
    <NavbarSidebarLayout isFooter={false}>
      <div className="bg-white border border-4 rounded-lg shadow relative m-10">
        <div className="flex items-start justify-between p-5 border-b rounded-t">
          <h3 className="text-xl font-semibold">Contact Details</h3>
        </div>
        <div className="p-6 space-y-6">
          <form>
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-full">
                <label htmlFor="googleMapsLink" className="text-sm font-medium text-gray-900 block mb-2">
                  Google Maps Location Link
                </label>
                <input
                  type="url"
                  id="googleMapsLink"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  placeholder="Enter Google Maps link"
                  value={contactDetails.googleMapsLink}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-full">
                <label htmlFor="location" className="text-sm font-medium text-gray-900 block mb-2">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  placeholder="Enter location"
                  value={contactDetails.location}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-full">
                <label htmlFor="email" className="text-sm font-medium text-gray-900 block mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  placeholder="Enter email address"
                  value={contactDetails.email}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-full">
                <label htmlFor="whatsappNumber" className="text-sm font-medium text-gray-900 block mb-2">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  id="whatsappNumber"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  placeholder="Enter WhatsApp number"
                  value={contactDetails.whatsappNumber}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-full">
                <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-900 block mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  placeholder="Enter phone number"
                  value={contactDetails.phoneNumber}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-full">
                <label htmlFor="facebookLink" className="text-sm font-medium text-gray-900 block mb-2">
                  Facebook Link
                </label>
                <input
                  type="url"
                  id="facebookLink"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  placeholder="Enter Facebook link"
                  value={contactDetails.facebookLink}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-full">
                <label htmlFor="instagramLink" className="text-sm font-medium text-gray-900 block mb-2">
                  Instagram Link
                </label>
                <input
                  type="url"
                  id="instagramLink"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  placeholder="Enter Instagram link"
                  value={contactDetails.instagramLink}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-full">
                <label htmlFor="address" className="text-sm font-medium text-gray-900 block mb-2">
                  Address
                </label>
                <textarea
                  id="address"
                  rows="4"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-4"
                  placeholder="Enter address"
                  value={contactDetails.address}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 rounded-b flex justify-end">
              <button
                type="button"
                className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </NavbarSidebarLayout>
  );
};

export default Contact;
