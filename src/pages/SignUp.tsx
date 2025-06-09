import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GlobalNavbar } from "@/components/GlobalNavbar";

const SignUp = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    // In a real application, you would handle user registration here.
    // For now, we'll just simulate a successful signup and redirect to onboarding.
    console.log("Simulating signup and redirecting to client onboarding...");
    navigate("/onboarding-client");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <GlobalNavbar />
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden md:grid md:grid-cols-2">
          {/* Image Section (Hidden on mobile, visible on desktop) */}
          <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-blue-600 to-teal-500 dark:from-blue-800 dark:to-teal-700 p-8">
            <img
              src="https://static.vecteezy.com/system/resources/previews/008/151/374/non_2x/business-teamwork-and-partnership-help-to-achieve-team-success-think-together-to-solve-business-problem-business-connection-concept-businessmen-working-team-building-connect-jigsaw-puzzle-bridge-vector.jpg"
              alt="Collaboration"
              className="w-full h-full object-cover rounded-md shadow-xl"
            />
          </div>

          {/* Form Section */}
          <div className="p-8 lg:p-12 flex items-center justify-center">
            <Card className="w-full max-w-lg border-none shadow-none">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold">Sign Up</CardTitle>
                <CardDescription>Create your account to get started.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" required />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input id="confirm-password" type="password" required />
                  </div>
                  <Button type="button" onClick={handleSignUp} className="w-full">
                    Sign Up
                  </Button>
                </form>
                <div className="mt-4 text-center text-sm">
                  Already have an account?{" "}
                  <Link to="/login" className="underline">
                    Login
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;