import React, { useState } from "react";
import { postLoginData } from "../api/service";
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from "react-router-dom";

const LoginComponent = () => {

    const [userCredentials, setUserCredentials] = useState({
        emailAddress: "",
        password: ""
    });

    const [userCredentialsValidationMessage, setUserCredentialsValidationMessage] = useState({
        emailAddress: "",
        password: ""
    });

    const navigate = useNavigate();

    const handleLoginOnChange = (event) => {
        let cloneUserValidationState = { ...userCredentialsValidationMessage };

        if (userCredentials.emailAddress !== "") {
            cloneUserValidationState.emailAddress = "";
        }
        if (userCredentials.password !== "") {
            cloneUserValidationState.password = "";
        }
        setUserCredentialsValidationMessage(cloneUserValidationState);
        setUserCredentials({ ...userCredentials, [event.target.name]: event.target.value });
    }

    const validateForm = () => {
        let cloneUserValidationState = { ...userCredentialsValidationMessage };
        let validationBooleanValue = true;
        if (userCredentials.emailAddress === "") {
            cloneUserValidationState.emailAddress = "Please enter the email";
            validationBooleanValue = false;
        }
        if (userCredentials.password === "") {
            cloneUserValidationState.password = "Please enter the password";
            validationBooleanValue = false;
        }

        setUserCredentialsValidationMessage(cloneUserValidationState);

        return validationBooleanValue;
    }

    const sumbitLoginCredentials = async () => {
        try {
            if (validateForm()) {
                const submitDataApiResponse = await postLoginData(userCredentials);
                const decodedToken = jwtDecode(submitDataApiResponse.data.token);
                if (decodedToken.admin) {
                    navigate("/admin", { state: decodedToken });
                } else {
                    navigate("/home", { state: decodedToken });

                }
                sessionStorage.setItem('token', submitDataApiResponse.data.token);
            }
        } catch (error) {
            setUserCredentialsValidationMessage({
                emailAddress: "",
                password: "Username or Password is Incorrect"
            })
        }
    }

    return (
        <>
            <div className="container">
                <div className="center">
                    <h1>Login</h1>
                    <form>
                        <div className="txt_field">
                            <input type="text" name="emailAddress" required value={userCredentials.emailAddress} onChange={handleLoginOnChange} />
                            {userCredentials.emailAddress ? null : <label>Email</label>}
                        </div>
                        <span style={{ color: "red" }}>{userCredentialsValidationMessage.emailAddress}</span>
                        <div className="txt_field">
                            <input type="password" name="password" required value={userCredentials.password} onChange={handleLoginOnChange} />
                            {userCredentials.password ? null : <label>Password</label>}
                        </div>
                        <span style={{ color: "red" }}>{userCredentialsValidationMessage.password}</span>
                    </form>
                    <div style={{ textAlign: "center" }}>
                        <button className="login_button" onClick={() => { sumbitLoginCredentials() }}>Login</button>
                    </div>
                </div>
            </div>

        </>
    )
}

export default LoginComponent;