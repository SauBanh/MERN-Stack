import React, { useEffect, useState } from "react";

import UserList from "../components/UserLists";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Users = () => {
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedUser, setLoadedUser] = useState();
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const responseData = await sendRequest(
                    "http://localhost:5000/api/users"
                );
                setLoadedUser(responseData.users);
            } catch (err) {}
        };
        fetchUsers();
    }, [sendRequest]);
    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && loadedUser && <UserList items={loadedUser} />}
        </React.Fragment>
    );
};

export default Users;
