import React from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList";

function UserPlaces(props) {
    const DUMMY_PLACE = [
        {
            id: "p1",
            title: "Tất niên cuối năm",
            description: "Tất niên cuối năm tại nhà Tuấn Anh đẹp trai",
            imageUrl:
                "https://scontent.fsgn5-2.fna.fbcdn.net/v/t39.30808-6/259741744_416359749981716_3280018264072678351_n.jpg?stp=dst-jpg_s851x315&_nc_cat=105&ccb=1-7&_nc_sid=da31f3&_nc_ohc=89MbXITYQ2gAX8x-FHJ&_nc_ht=scontent.fsgn5-2.fna&oh=00_AfApDp48EMk5AmiX385PRe-orUVxgaJUxaKxo5wh_Biy2g&oe=645172A4",
            address: "Le Van Khuong Quan 12 HCM",
            location: {
                lat: 10.888005,
                lng: 106.645651,
            },
            creator: "u1",
        },
        {
            id: "p2",
            title: "Empire State Building 12313214564654",
            description: "On of the most famous sky scrapers in the world!",
            imageUrl:
                "https://scontent.fsgn5-2.fna.fbcdn.net/v/t39.30808-6/259741744_416359749981716_3280018264072678351_n.jpg?stp=dst-jpg_s851x315&_nc_cat=105&ccb=1-7&_nc_sid=da31f3&_nc_ohc=89MbXITYQ2gAX8x-FHJ&_nc_ht=scontent.fsgn5-2.fna&oh=00_AfApDp48EMk5AmiX385PRe-orUVxgaJUxaKxo5wh_Biy2g&oe=645172A4",
            address: "Le Van Khuong Quan 12 HCM",
            location: {
                lat: "1561891651",
                lng: "-1581981984",
            },
            creator: "u2",
        },
    ];
    useParams();
    const userId = useParams().userId;
    const loadedPlaces = DUMMY_PLACE.filter(
        (place) => place.creator === userId
    );
    return <PlaceList items={loadedPlaces} />;
}

export default UserPlaces;
