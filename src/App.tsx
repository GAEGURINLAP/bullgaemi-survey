import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useEffect, useState } from "react";

import { auth } from "./firebase";

import { Global } from "@emotion/react";

import Home from "./routes/home";
import Profile from "./routes/profile";
import Login from "./routes/login";
import CreateAccount from "./routes/create-account";

import Layout from "./component/Layout";
import LoadingScreen from "./component/LoadingScreen";
import ProtectedRoute from "./component/ProtectedRoute";

import { Wrapper } from "./style/layout";
import global from "./style/global";
import ResetPaswrd from "./routes/reset-password";
import Survey from "./routes/survey";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  { path: "/create-account", element: <CreateAccount /> },
  { path: "/reset-password", element: <ResetPaswrd /> },
  { path: "/survey", element: <Survey /> },
]);

function App() {
  const [isLoading, setLoading] = useState(true);
  const init = async () => {
    await auth.authStateReady();
    setLoading(false);
  };
  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <Wrapper>
        <Global styles={global} />
        {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
        {/* <BottomButton /> */}
      </Wrapper>
    </>
  );
}

export default App;
