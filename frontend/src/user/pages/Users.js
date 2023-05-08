import React from "react";

import UserList from "../components/UserLists";

const Users = () => {
    const USERS = [
        {
            id: "u1",
            name: "Nguyễn Tuấn Anh",
            image: "https://scontent.fsgn5-10.fna.fbcdn.net/v/t39.30808-6/274217740_469277344689956_4712296035433322684_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=174925&_nc_ohc=rwUOlKlzrKcAX-PS3LM&_nc_ht=scontent.fsgn5-10.fna&oh=00_AfAcHfFlkk_7egKxp2OrP8zuOG24w-vFNtSs8Ths75MSLA&oe=645B9F25",
            places: 3,
        },
    ];
    return <UserList items={USERS} />;
};

export default Users;
