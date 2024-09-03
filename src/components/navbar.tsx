import type { FC } from "react";
import { Button, DarkThemeToggle, Navbar } from "flowbite-react";

const ExampleNavbar: FC = function () {
  return (
    <Navbar fluid>
      <div className="w-full p-3  lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Navbar.Brand >
              <img alt="image" src="/logo.jpg" className="mr-3 h-10 sm:h-10" />
            
            </Navbar.Brand>
          </div>
          <div className="flex items-center gap-3">
           
    
            <DarkThemeToggle />
          </div>
        </div>
      </div>
    </Navbar>
  );
};

export default ExampleNavbar;
