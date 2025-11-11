import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';

import { Country } from './pages/Country';
import { Contact } from './pages/Contact';
import { About } from './pages/About';
import { Home } from './pages/Home';
import { CountryDetails } from './pages/CountryDetails';

import { AppLayout } from './Components/Layout/AppLayout';
import { ErrorPage } from './pages/ErrorPage';
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";


const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout/>,
    errorElement:<ErrorPage/>,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/about",
        element: <About />
      },
      {
        path: "/country",
        element: <Country />
      },
      {
        path: "/contact",
        element: <Contact />
      },
      {
      path: "/country/:name",
      element: <CountryDetails />
      }

    ]
  }
]);

const App=()=>{
  return <RouterProvider router={router}></RouterProvider>
};

export default App;
