import type { CustomFlowbiteTheme } from "flowbite-react";

const flowbiteTheme: CustomFlowbiteTheme = {
  badge: {
    color: {
      primary:
        "bg-primary-100 text-primary-800 hover:bg-primary-200 group-hover:bg-primary-200", // Removed dark mode classes
    },
    icon: {
      off: "rounded-full px-2 py-1",
    },
    size: {
      xl: "px-3 py-2 text-base rounded-md",
    },
  },
  button: {
    color: {
      primary:
        "text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-300", // Removed dark mode classes
    },
    outline: {
      on: "transition-all duration-75 ease-in group-hover:bg-opacity-0 group-hover:text-inherit",
    },
    size: {
      md: "text-sm px-3 py-2",
    },
  },
  dropdown: {
    floating: {
      base: "z-10 w-fit rounded-xl divide-y divide-gray-100 shadow", // Removed dark mode classes
      content: "rounded-xl text-sm text-gray-700", // Ensured no dark mode here
      target: "w-fit text-black",
    },
    content: "",
  },
  modal: {
    content: {
      inner: "relative rounded-lg bg-white shadow", // Removed dark mode classes
    },
    header: {
      base: "flex items-start justify-between rounded-t px-5 pt-5",
    },
  },
  navbar: {
    base: "fixed z-30 w-full bg-white border-b border-gray-200", // Removed dark mode classes
  },
  sidebar: {
    base: "flex fixed top-0 left-0 z-20 flex-col flex-shrink-0 pt-16 h-full duration-75 border-r border-gray-200 lg:flex transition-width", // Removed dark mode classes
  },
  textarea: {
    base: "block w-full text-sm p-4 rounded-lg border disabled:cursor-not-allowed disabled:opacity-50",
  },
  toggleSwitch: {
    toggle: {
      checked: {
        off: "!border-gray-200 !bg-gray-200", // Removed dark mode classes
      },
    },
  },
};

export default flowbiteTheme;
