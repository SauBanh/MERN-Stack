import React, { useState, useContext } from "react";
import { useNavigate, Navigate } from "react-router-dom";

import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
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

    console.log(auth.isLoggedIn);
    const [isLoginModal, setIsLoginModal] = useState(true);
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

    const authSubmitHandler = (event) => {
        event.preventDefault();
        console.log(formState.inputs);
        auth.login();
        navigate("/");
    };
    if (auth.isLoggedIn) {
        return <Navigate to="/" />;
    }

    return (
        <Card className="authentication">
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
                Switch to {!isLoginModal ? "Signup" : "Login"}
            </Button>
        </Card>
    );
}

export default Auth;
