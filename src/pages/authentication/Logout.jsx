import { Button } from "flowbite-react";
import { useAuth } from "./AuthenticationContext";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate('/');
  };

  return <Button onClick={handleLogout}>Log Out</Button>;
};

export default LogoutButton;
