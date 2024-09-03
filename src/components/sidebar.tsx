import { Sidebar } from "flowbite-react";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { HiLogin, HiPencil, HiSearch, HiUsers } from "react-icons/hi";
import { HiMenu } from "react-icons/hi"; // Import the menu icon

const ExampleSidebar: FC = function () {
  const [currentPage, setCurrentPage] = useState("");
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // State to toggle sidebar visibility

  useEffect(() => {
    const newPage = window.location.pathname;
    setCurrentPage(newPage);
  }, [setCurrentPage]);

  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  return (
    <div className="flex">
      {/* Button to toggle sidebar */}
      <button
        onClick={toggleSidebar}
        className="p-2 text-white bg-transparent rounded-md fixed w-36 top-4 left-4 z-50 md:hidden" // Ensure it's visible on mobile screens
      >

        <HiMenu size={24} color="transparent" />
      </button>
      {/* Sidebar */}
      <Sidebar
        aria-label="Sidebar with multi-level dropdown example"
        className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 z-10 transition-transform transform ${
          isSidebarVisible ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`} // Ensure sidebar is hidden on mobile and visible on larger screens
      >
        <div className="flex pt-14 h-full flex-col justify-between py-2">
          <div>
            <Sidebar.Items>
              <Sidebar.ItemGroup>
                <Sidebar.Item
                  href="/admin/homepage"
                  icon={HiUsers}
                  className={
                    "/admin/homepage" === currentPage
                      ? "bg-gray-100 dark:bg-gray-700"
                      : ""
                  }
                >
                  Homepage
                </Sidebar.Item>
                <Sidebar.Item
                  href="/admin/about"
                  icon={HiUsers}
                  className={
                    "/admin/about" === currentPage
                      ? "bg-gray-100 dark:bg-gray-700"
                      : ""
                  }
                >
                  About
                </Sidebar.Item>
                <Sidebar.Item
                  href="/admin/service"
                  icon={HiUsers}
                  className={
                    "/admin/service" === currentPage
                      ? "bg-gray-100 dark:bg-gray-700"
                      : ""
                  }
                >
                  Service
                </Sidebar.Item>
                <Sidebar.Item
                  href="/admin/branding"
                  icon={HiUsers}
                  className={
                    "/admin/branding" === currentPage
                      ? "bg-gray-100 dark:bg-gray-700"
                      : ""
                  }
                >
                  Branding
                </Sidebar.Item>
                <Sidebar.Item
                  href="/admin/extra-about"
                  icon={HiUsers}
                  className={
                    "/admin/extra-about" === currentPage
                      ? "bg-gray-100 dark:bg-gray-700"
                      : ""
                  }
                >
                  MoreAbout
                </Sidebar.Item>
                <Sidebar.Item
                  href="/admin/gallery"
                  icon={HiUsers}
                  className={
                    "/admin/gallery" === currentPage
                      ? "bg-gray-100 dark:bg-gray-700"
                      : ""
                  }
                >
                  Gallery
                </Sidebar.Item>
                <Sidebar.Item
                  href="/admin/contact"
                  icon={HiUsers}
                  className={
                    "/admin/contact" === currentPage
                      ? "bg-gray-100 dark:bg-gray-700"
                      : ""
                  }
                >
                  Contact
                </Sidebar.Item>
                <Sidebar.Item
                  href="/admin/list"
                  icon={HiUsers}
                  className={
                    "/admin/reviews" === currentPage
                      ? "bg-gray-100 dark:bg-gray-700"
                      : ""
                  }
                >
                  Reviews
                </Sidebar.Item>
                <Sidebar.Item href="/authentication/sign-in" icon={HiLogin}>
                  Sign in
                </Sidebar.Item>
                <Sidebar.Item href="/authentication/sign-up" icon={HiPencil}>
                  Sign up
                </Sidebar.Item>
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </div>
        </div>
      </Sidebar>
    </div>
  );
};

export default ExampleSidebar;
