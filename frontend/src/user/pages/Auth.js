import React, { useState, useContext } from "react";
import { useNavigate, Navigate } from "react-router-dom";

import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import {
    VALIDATOR_EMAIL,
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";

import "./Auth.css";

function Auth() {
    const navigate = useNavigate();
    const auth = useContext(AuthContext);

    // console.log(auth.isLoggedIn);
    const [isLoginModal, setIsLoginModal] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
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
                },
                false
            );
        }
        setIsLoginModal((prevMode) => !prevMode);
    };

    const authSubmitHandler = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        if (isLoginModal) {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/users/login",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: formState.inputs.email.value,
                            password: formState.inputs.passWord.value,
                        }),
                    }
                );
                const responseData = await response.json();
                if (!response.ok) {
                    throw new Error(responseData.message);
                }
                setIsLoading(false);
                auth.login();
            } catch (err) {
                setIsLoading(false);
                setError(
                    err.message || "Something went wrong, please try again"
                );
            }
        } else {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/users/signup",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            name: formState.inputs.name.value,
                            email: formState.inputs.email.value,
                            password: formState.inputs.passWord.value,
                        }),
                    }
                );
                const responseData = await response.json();
                if (!response.ok) {
                    throw new Error(responseData.message);
                }
                console.log(responseData);
                setIsLoading(false);
                auth.login();
            } catch (err) {
                setIsLoading(false);
                setError(
                    err.message || "Something went wrong, please try again"
                );
            }
        }
        // console.log(formState.inputs);
        // navigate("/");
    };
    if (auth.isLoggedIn) {
        return <Navigate to="/" />;
    }

    const errorHandler = () => {
        setError(null);
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={errorHandler} />
            <Card className="authentication">
                {isLoading && <LoadingSpinner asOverlay />}
                <h2>{isLoginModal ? "Login Required" : "Signup Required"}</h2>
                <hr />
                <form onSubmit={authSubmitHandler}>
                    {!isLoginModal ? (
                        <Input
                            element="input"
                            id="name"
                            type="text"
                            label="Your Name"
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Please enter your name"
                            onInput={inputHandler}
                        />
                    ) : (
                        ""
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
                        validators={[VALIDATOR_MINLENGTH(5)]}
                        errorText="Please enter a valid password address, at least 5 characters"
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
