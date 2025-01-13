import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/authentication/sign-in");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 px-6">
      {/* Logo Section */}
      <div className="mb-6">
        <img
          src="/logo.jpg"
          alt="Excellence Polymerence Logo"
          className="h-16 w-auto"
        />
      </div>

      {/* Welcome Text */}
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Welcome to Excellence Polymerence
      </h1>
      <p className="text-lg text-gray-600 text-center mb-8">
        Access and manage your Excellence Polymerence Admin Panel efficiently. 
        Click the button below to sign in and get started.
      </p>

      {/* Sign In Button */}
      <Button
        onClick={handleSignIn}
        className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-6 py-3 rounded-lg shadow-md transition duration-300"
      >
        Sign In
      </Button>
    </div>
  );
};

export default WelcomePage;
