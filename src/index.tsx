import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import theme from "./flowbite-theme";
import { Flowbite } from "flowbite-react";
import { Routes, Route } from "react-router";
import { BrowserRouter } from "react-router-dom";
import SignInPage from "./pages/authentication/sign-in";
import SignUpPage from "./pages/authentication/sign-up";
import UserListPage from "./pages/users/list";
import Homepage from "./pages/homepage/page";
import About from "./pages/aboutSection/about";
import Service from "./pages/service/service";
import UserReviewPage from "./pages/users/list";
import Gallery from "./pages/gallery/gallery";
import Branding from "./pages/branding/branding";
import Contact from "./pages/contact/contact";
import MoreAbout from "./pages/extraAboutSection/extraAboutSection";
const container = document.getElementById("root");

if (!container) {
  throw new Error("React root element doesn't exist!");
}

const root = createRoot(container);

root.render(
  <StrictMode>
    <Flowbite theme={{ theme }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} index />
          <Route path="/admin/homepage" element={<Homepage/>}/>
          <Route path="/admin/about" element={<About/>}/>
          <Route path="/admin/service" element={<Service/>}/>
          <Route path="/admin/gallery" element={<Gallery/>}/>
          <Route path="/admin/contact" element={<Contact/>}/>
          <Route path="/admin/branding" element={<Branding />} />
          <Route path="/admin/extra-about" element={<MoreAbout />} />
          <Route path="/authentication/sign-in" element={<SignInPage />} />
          <Route path="/authentication/sign-up" element={<SignUpPage />} />
          <Route path="/users/list" element={<UserReviewPage />} />
        </Routes>
      </BrowserRouter>
    </Flowbite>
  </StrictMode>
);
