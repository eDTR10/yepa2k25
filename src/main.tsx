import React from 'react'
import ReactDOM from 'react-dom/client'
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import App from './App.tsx'
import './index.css'
import { Suspense, lazy } from "react";

import NotFound from "./screens/notFound";
import Loader from './components/loader/loader.tsx';


// const Page2= lazy(() =>
//   wait(1300).then(() => import("./screens/page2.tsx"))
// );

const Voting = lazy(() =>
  wait(2300).then(() => import("./screens/voting.tsx"))
);

const Photobooth = lazy(() =>
  wait(2300).then(() => import("./screens/photo.tsx"))
);

const Admin = lazy(() =>
  wait(2300).then(() => import("./screens/admin.tsx"))
);
const Ranking = lazy(() =>
  wait(2300).then(() => import("./screens/ranking.tsx"))
);

const Rate = lazy(() =>
  wait(2300).then(() => import("./Rate.tsx"))
);
const Rating= lazy(() =>
  wait(2300).then(() => import("./screens/rating.tsx"))
);

const router = createBrowserRouter([
  {
    path: "/yepa2k25/performance",
    element: <Rate />,
    
    children: [
      {
        path: "/yepa2k25/performance", 
        element: <Navigate to="/yepa2k25/performance/rating" />, 
      },
      {
        path: "/yepa2k25/performance/rating",
        element: <>
        <Suspense fallback={<Loader />}>
          <Rating/>
        </Suspense>
      </>,
      }
      ,
      {
        path: "/yepa2k25/performance/snap",
        element: <>
        <Suspense fallback={<Loader />}>
          <Photobooth />
        </Suspense>
      </>,
      },
      
      
      ]
    },
  {
    path: "/yepa2k25/rank",
    element: <>
    <Suspense fallback={<Loader />}>
      <Ranking />
    </Suspense>
  </>,
  },
  {
    path: "/yepa2k25/admin",
    element: <>
    <Suspense fallback={<Loader />}>
      <Admin />
    </Suspense>
  </>,
  },
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
        path: "/yepa2k25/snap",
        element: <>
        <Suspense fallback={<Loader />}>
          <Photobooth />
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
