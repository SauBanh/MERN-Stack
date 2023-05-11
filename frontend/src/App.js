import React, { useState, useCallback } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";

import Users from "./user/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import RootLayout from "./RootLayout";
import UserPlaces from "./places/pages/UserPlaces";
import UpdatePlace from "./places/pages/UpdatePlace";
import Auth from "./user/pages/Auth";
import { AuthContext } from "./shared/context/auth-context";

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

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(false);
    const login = useCallback((uid) => {
        setIsLoggedIn(true);
        setUserId(uid);
    }, []);
    const logout = useCallback(() => {
        setIsLoggedIn(false);
        setUserId(null);
    }, []);

    let routes;

    if (isLoggedIn) {
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
                isLoggedIn: isLoggedIn,
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
