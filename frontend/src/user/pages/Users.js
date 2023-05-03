import React from "react";

import UserList from "../components/UserLists";

const Users = () => {
    const USERS = [
        {
            id: "u1",
            name: "Nguyễn Tuấn Anh",
            image: "https://scontent.fsgn5-2.fna.fbcdn.net/v/t39.30808-6/259741744_416359749981716_3280018264072678351_n.jpg?stp=dst-jpg_s851x315&_nc_cat=105&ccb=1-7&_nc_sid=da31f3&_nc_ohc=89MbXITYQ2gAX8x-FHJ&_nc_ht=scontent.fsgn5-2.fna&oh=00_AfApDp48EMk5AmiX385PRe-orUVxgaJUxaKxo5wh_Biy2g&oe=645172A4",
            places: 3,
        },
    ];
    return <UserList items={USERS} />;
};

export default Users;
