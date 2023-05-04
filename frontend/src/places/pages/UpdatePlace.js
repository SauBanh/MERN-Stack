import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import {
    VALIDATOR_REQUIRE,
    VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";

import { useForm } from "../../shared/hooks/form-hook";

import "./PlaceForm.css";

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

function UpdatePlace() {
    const [isLoading, setIsLoading] = useState(true);
    const placeId = useParams().placeId;

    const [formState, inputHandler, setFormData] = useForm(
        {
            title: {
                value: "",
                isValid: false,
            },
            description: {
                value: "",
                isValid: false,
            },
        },
        false
    );

    const identtifiedPlace = DUMMY_PLACE.find((p) => p.id === placeId);
    useEffect(() => {
        if (identtifiedPlace) {
            setFormData(
                {
                    title: {
                        value: identtifiedPlace.title,
                        isValid: true,
                    },
                    description: {
                        value: identtifiedPlace.description,
                        isValid: true,
                    },
                },
                true
            );
        }
        setIsLoading(false);
    }, [setFormData, identtifiedPlace]);
    const placeSubmitHandler = (event) => {
        event.preventDefault();
        console.log(formState.inputs); //send this to the backend!
    };

    if (!identtifiedPlace) {
        return (
            <div className="center">
                <Card>
                    <h2>Cound not find place!</h2>
                </Card>
            </div>
        );
    }
    if (isLoading) {
        return (
            <div className="center">
                <h2>Loading</h2>
            </div>
        );
    }
    return (
        <form className="place-form" onSubmit={placeSubmitHandler}>
            <Input
                id="Title"
                element="input"
                type="text"
                label="Title"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a valid title"
                onInput={inputHandler}
                initialValue={formState.inputs.title.value}
                initialValid={formState.inputs.title.isValid}
            />
            <Input
                id="description"
                element="textarea"
                label="Description"
                validators={[VALIDATOR_MINLENGTH(5)]}
                errorText="Please enter a valid description (min. 5 character)."
                onInput={inputHandler}
                initialValue={formState.inputs.description.value}
                initialValid={formState.inputs.description.isValid}
            />
            <Button type="submit" disabled={!formState.isValid}>
                UPDATE PLACE
            </Button>
        </form>
    );
}

export default UpdatePlace;
