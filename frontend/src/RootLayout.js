import React from "react";
import { Outlet } from "react-router-dom";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";

function RootLayout() {
    return (
        <div>
            <MainNavigation />
            <main>
                <React.Suspense
                    fallback={
                        <div className="center">
                            <LoadingSpinner />
                        </div>
                    }
                >
                    <Outlet />
                </React.Suspense>
            </main>
        </div>
    );
}

export default RootLayout;
