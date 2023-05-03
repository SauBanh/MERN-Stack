import React from "react";
import { Outlet } from "react-router-dom";
import MainNavigation from "./shared/components/Navigation/MainNavigation";

function RootLayout() {
    return (
        <div>
            <MainNavigation />
            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default RootLayout;
