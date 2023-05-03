import {
    createBrowserRouter,
    // createRoutesFromElements,
    RouterProvider,
    // Route
} from "react-router-dom";
import "./App.css";

import Users from "./user/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import RootLayout from "./RootLayout";
import UserPlaces from "./places/pages/UserPlaces";

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        // errorElement: <Error />,
        children: [
            { index: true, path: "", element: <Users /> },
            { path: "/places/new", element: <NewPlace /> },
            { path: "/:userId/places", element: <UserPlaces /> },
            // { path: '/products/:productId', element: <ProductDetail /> },
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
