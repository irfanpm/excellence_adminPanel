import React from 'react';
import NavbarSidebarLayout from '../../layouts/navbar-sidebar';

const MoreAbout = () => (
  <NavbarSidebarLayout isFooter={false}>
    <div className="bg-white border border-4 rounded-lg shadow relative m-10">
      <div className="flex items-start justify-between p-5 border-b rounded-t">
        <h3 className="text-xl font-semibold">Add About Page Details</h3>
      </div>
      <div className="p-6 space-y-6">
        <form action="#">
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-full">
              <label htmlFor="product-details" className="text-sm font-medium text-gray-900 block mb-2">
                Image Upload
              </label>
              <div className="grid grid-cols-6 gap-6">
                <div className="extraOutline p-4 bg-white w-max m-auto rounded-lg">
                  <div className="file_upload p-5 relative border-4 border-dotted border-gray-300 rounded-lg lg:w-[450px]">
                    <svg
                      className="text-indigo-500 w-24 mx-auto mb-4"
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
                    <div className="input_field flex flex-col w-max mx-auto text-center">
                      <label>
                        <input className="text-sm cursor-pointer w-36 hidden" type="file" multiple />
                        <div className="text bg-indigo-600 text-white border border-gray-300 rounded font-semibold cursor-pointer p-1 px-3 hover:bg-indigo-500">
                          Select
                        </div>
                      </label>
                      <div className="title text-indigo-500 uppercase">or drop files here</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="product-name" className="text-sm font-medium text-gray-900 block mb-2">
                Title
              </label>
              <input
                type="text"
                name="product-name"
                id="product-name"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                placeholder="Add title"
                required
              />
            </div>
            <div className="col-span-full">
              <label htmlFor="product-details" className="text-sm font-medium text-gray-900 block mb-2">
                Description
              </label>
              <textarea
                id="product-details"
                rows="6"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-4"
                placeholder="Details"
              />
            </div>
          </div>
          <div className="p-6 border-t border-gray-200 rounded-b flex justify-end">
          <button type="button" class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Save</button>

          </div>
        </form>
      </div>
    </div>
  </NavbarSidebarLayout>
);

export default MoreAbout;
