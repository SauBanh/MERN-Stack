import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";

// import Users from "./user/pages/Users";
// import NewPlace from "./places/pages/NewPlace";
// import RootLayout from "./RootLayout";
// import UserPlaces from "./places/pages/UserPlaces";
// import UpdatePlace from "./places/pages/UpdatePlace";
// import Auth from "./user/pages/Auth";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";

// const router = createBrowserRouter([
//     {
//         path: "/",
//         element: <RootLayout />,
//         // errorElement: <Error />,
//         children: [
//             { index: true, path: "", element: <Users /> },
//             { path: ":userId/places", element: <UserPlaces /> },
//             { path: "places/new", element: <NewPlace /> },
//             { path: "places/:placeId", element: <UpdatePlace /> },
//             { path: "auth", element: <Auth /> },
//         ],
//     },
// ]);

const Users = React.lazy(() => import("./user/pages/Users"));
const NewPlace = React.lazy(() => import("./places/pages/NewPlace"));
const RootLayout = React.lazy(() => import("./RootLayout"));
const UserPlaces = React.lazy(() => import("./places/pages/UserPlaces"));
const UpdatePlace = React.lazy(() => import("./places/pages/UpdatePlace"));
const Auth = React.lazy(() => import("./user/pages/Auth"));

function App() {
    const { token, login, logout, userId } = useAuth();

    let routes;

    if (token) {
        routes = [
            {
                path: "/",
                element: <RootLayout />,
                children: [
                    { index: true, path: "", element: <Users /> },
                    { path: ":userId/places", element: <UserPlaces /> },
                    { path: "places/new", element: <NewPlace /> },
                    { path: "places/:placeId", element: <UpdatePlace /> },
                    { path: "auth", element: <Auth /> },
                ],
            },
        ];
    } else {
        routes = [
            {
                path: "/",
                element: <RootLayout />,
                children: [
                    { index: true, path: "", element: <Users /> },
                    { path: ":userId/places", element: <UserPlaces /> },
                    { path: "auth", element: <Auth /> },
                ],
            },
        ];
    }

    const router = createBrowserRouter(routes);

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn: !!token,
                token: token,
                userId: userId,
                login: login,
                logout: logout,
            }}
        >
            <RouterProvider router={router} />;
        </AuthContext.Provider>
    );
}

export default App;
