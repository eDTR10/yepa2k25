import React from 'react'
import ReactDOM from 'react-dom/client'
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import App from './App.tsx'
import './index.css'
import { Suspense, lazy } from "react";

import NotFound from "./screens/notFound";
import Loader from './components/loader/loader.tsx';


const Page2= lazy(() =>
  wait(1300).then(() => import("./screens/page2.tsx"))
);

const Voting = lazy(() =>
  wait(1300).then(() => import("./screens/voting.tsx"))
);
const router = createBrowserRouter([
  {
    path: "/yepa2k25/",
    element: <App />,
    
    children: [
      {
        path: "/yepa2k25/", 
        element: <Navigate to="/yepa2k25/voting" />, 
      },
      {
        path: "/yepa2k25/voting",
        element: <>
        <Suspense fallback={<Loader />}>
          <Voting/>
        </Suspense>
      </>,
      },
      {
        path: "/yepa2k25/page2",
        element: <>
        <Suspense fallback={<Loader />}>
          <Page2 />
        </Suspense>
      </>,
      },



      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

function wait( time:number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
