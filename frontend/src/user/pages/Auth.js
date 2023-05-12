import React, { useState, useContext } from "react";
import { Navigate } from "react-router-dom";

import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import {
    VALIDATOR_EMAIL,
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

import "./Auth.css";

function Auth() {
    const auth = useContext(AuthContext);

    // console.log(auth.isLoggedIn);
    const [isLoginModal, setIsLoginModal] = useState(true);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [formState, inputHandler, setFormData] = useForm(
        {
            email: {
                value: "",
                inValid: false,
            },
            passWord: {
                value: "",
                isValid: false,
            },
        },
        false
    );

    const switchModeHandler = () => {
        if (!isLoginModal) {
            setFormData(
                {
                    ...formState.inputs,
                    name: undefined,
                    image: undefined,
                },
                formState.inputs.email.inValid &&
                    formState.inputs.passWord.inValid
            );
        } else {
            setFormData(
                {
                    ...formState.inputs,
                    name: {
                        value: "",
                        isValid: false,
                    },
                    image: {
                        value: null,
                        isValid: false,
                    },
                },
                false
            );
        }
        setIsLoginModal((prevMode) => !prevMode);
    };

    const authSubmitHandler = async (event) => {
        event.preventDefault();

        // console.log(formState.inputs);

        if (isLoginModal) {
            try {
                const responseData = await sendRequest(
                    "http://localhost:5000/api/users/login",
                    "POST",
                    JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.passWord.value,
                    }),
                    { "Content-Type": "application/json" }
                );
                auth.login(responseData.userId, responseData.token);
            } catch (error) {}
        } else {
            try {
                const formData = new FormData();
                formData.append("email", formState.inputs.email.value);
                formData.append("name", formState.inputs.name.value);
                formData.append("password", formState.inputs.passWord.value);
                formData.append("image", formState.inputs.image.value); // khóa image giống với backend file users-route với fileUoload.single('image')
                // console.log("Clicked");
                const responseData = await sendRequest(
                    "http://localhost:5000/api/users/signup",
                    "POST",
                    formData
                );
                auth.login(responseData.userId, responseData.token);
                setIsLoginModal(true);
            } catch (err) {}
        }
        // console.log(formState.inputs);
        // navigate("/");
    };
    if (auth.isLoggedIn) {
        return <Navigate to="/" />;
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <Card className="authentication">
                {isLoading && <LoadingSpinner asOverlay />}
                <h2>{isLoginModal ? "Login Required" : "Signup Required"}</h2>
                <hr />
                <form onSubmit={authSubmitHandler}>
                    {!isLoginModal && (
                        <Input
                            element="input"
                            id="name"
                            type="text"
                            label="Your Name"
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Please enter your name"
                            onInput={inputHandler}
                        />
                    )}
                    {!isLoginModal && (
                        <ImageUpload
                            center
                            id="image"
                            onInput={inputHandler}
                            errorText="Please provide an image."
                        />
                    )}
                    <Input
                        element="input"
                        id="email"
                        type="email"
                        label="E-Mail"
                        validators={[VALIDATOR_EMAIL()]}
                        errorText="Please enter a valid email address."
                        onInput={inputHandler}
                    />
                    <Input
                        element="input"
                        id="passWord"
                        type="password"
                        label="Password"
                        validators={[VALIDATOR_MINLENGTH(6)]}
                        errorText="Please enter a valid password address, at least 6 characters"
                        onInput={inputHandler}
                    />
                    <Button type="submit" disabled={!formState.isValid}>
                        {isLoginModal ? "Login" : "Signup"}
                    </Button>
                </form>
                <Button inverse onClick={switchModeHandler}>
                    Switch to {isLoginModal ? "Signup" : "Login"}
                </Button>
            </Card>
        </React.Fragment>
    );
}

export default Auth;
