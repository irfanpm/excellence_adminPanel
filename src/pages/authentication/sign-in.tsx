import { Button, Card, Checkbox, Label, TextInput } from "flowbite-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthenticationContext"; // Import the useAuth hook
import type { FC } from "react";

const SignInPage: FC = function () {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const navigate = useNavigate();
  const { signIn, isAuthenticated } = useAuth(); 

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signIn(email, password);
    if (isAuthenticated || localStorage.getItem('authToken')) {
      navigate('/admin/homepage');
    }
  
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white py-12 px-6 lg:gap-y-12">
      <div className="my-6 flex items-center gap-x-1">
        <img alt="Logo" src="/logo.jpg" className="mr-3 h-10 sm:h-10" />
        <h1 className="text-gray-800 text-3xl font-bold">Saaf Naturals</h1>
      </div>
      <Card
        horizontal
        imgSrc="/images/authentication/login.jpg"
        imgAlt="Login"
        className="w-full md:max-w-lg shadow-xl rounded-lg bg-white lg:[&>img]:hidden md:[&>img]:w-96 md:[&>img]:p-0 md:[&>*]:w-full md:[&>*]:p-16"
      >
        <h1 className="mb-3 text-2xl font-bold text-center text-gray-800 md:text-3xl">
          Sign In to Your Account
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-y-3">
            <Label htmlFor="email">Your email</Label>
            <TextInput
              id="email"
              name="email"
              placeholder="name@company.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 p-2"
            />
          </div>
          <div className="flex flex-col gap-y-3">
            <Label htmlFor="password">Your password</Label>
            <TextInput
              id="password"
              name="password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 p-2"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-3">
              <Checkbox
                id="rememberMe"
                name="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <Label htmlFor="rememberMe" className="text-gray-700">Remember me</Label>
            </div>
            <a href="#" className="text-blue-500 text-sm">Forgot Password?</a>
          </div>
          <div>
            <Button type="submit" className="w-full lg:w-auto py-3 text-white bg-blue-600 hover:bg-blue-700 transition duration-300 ease-in-out rounded-lg shadow-md">
              Login to your account
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SignInPage;
