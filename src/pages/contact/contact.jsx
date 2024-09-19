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
    phoneNumber: [''], // phoneNumber as an array
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

  // Handle change for other fields and phone number array
  const handleChange = (e, index = null) => {
    const { id, value } = e.target;

    if (id === "phoneNumber" && index !== null) {
      // Update specific phone number in the array
      const updatedPhoneNumbers = [...contactDetails.phoneNumber];
      updatedPhoneNumbers[index] = value;
      setContactDetails((prevDetails) => ({
        ...prevDetails,
        phoneNumber: updatedPhoneNumbers
      }));
    } else {
      // Update other fields
      setContactDetails((prevDetails) => ({
        ...prevDetails,
        [id]: value
      }));
    }
  };

  // Function to add a new phone number input
  const handleAddPhoneNumber = () => {
    setContactDetails((prevDetails) => ({
      ...prevDetails,
      phoneNumber: [...prevDetails.phoneNumber, ''] // Add new empty phone number
    }));
  };

  // Function to remove a phone number input
  const handleRemovePhoneNumber = (index) => {
    const updatedPhoneNumbers = contactDetails.phoneNumber.filter((_, i) => i !== index);
    setContactDetails((prevDetails) => ({
      ...prevDetails,
      phoneNumber: updatedPhoneNumbers
    }));
  };

  // Save the updated contact details to Firestore
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
              {/* Google Maps Link */}
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

              {/* Location */}
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

              {/* Email */}
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

              {/* WhatsApp Number */}
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

              {/* Phone Numbers */}
              <div className="col-span-full">
                <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-900 block mb-2">
                  Phone Numbers
                </label>
                {contactDetails?.phoneNumber?.map((number, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="tel"
                      id="phoneNumber"
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      placeholder="Enter phone number"
                      value={number}
                      onChange={(e) => handleChange(e, index)}
                    />
                    {contactDetails.phoneNumber.length > 1 && (
                      <button
                        type="button"
                        className="ml-2 bg-red-500 text-white px-3 py-1 rounded"
                        onClick={() => handleRemovePhoneNumber(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="bg-green-500 text-white px-3 py-1 rounded"
                  onClick={handleAddPhoneNumber}
                >
                  Add Phone Number
                </button>
              </div>

              {/* Facebook Link */}
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

              {/* Instagram Link */}
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

              {/* Address */}
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
            
            {/* Save Button */}
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
