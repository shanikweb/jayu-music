import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import './index.css';

// Page and layout components
import Layout from './shared/Layout';
import Home from './pages/Home';
import Lessons from './pages/Lessons';
import Exercises from './pages/Exercises';
import Resources from './pages/Resources';
import Showcase from './pages/Showcase';

// Define the application routes.  The root route renders the
// Layout component with nested routes for each page.  Using
// createBrowserRouter enables client‑side routing without hash
// fragments.  See https://reactrouter.com/en/main/router-components
// for details.
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'lessons', element: <Lessons /> },
      { path: 'exercises', element: <Exercises /> },
      { path: 'resources', element: <Resources /> },
      { path: 'showcase', element: <Showcase /> },
    ],
  },
]);

// Render the application into the root element.  StrictMode helps
// highlight potential problems in an application by intentionally
// double‑invoking certain lifecycle methods.  RouterProvider
// makes the router available throughout the component tree.
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);