import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from "react";
import Form from "../Form/Form";
import { useDispatch, useSelector } from "react-redux"
import { validateLogin } from "../../hooks/useValidate";
import { useNavigate } from "react-router-dom";
import { userLogin } from "../../redux/actionUser";


const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [ userData, setUserData ] = useState({
        username: '',
        password: '',
    });
    const [ errors, setErrors ] = useState({});
    const accessToken = useSelector(state => state.user.tokens.accessToken);


    useEffect(() => {
        if (accessToken) {
            navigate("/viewprofile");
        }
    }, [ accessToken ]);

    const handleChange = (event, key) => {
        event.preventDefault();
        const newValue = event.target.value;
        let newUserData = { ...userData, [ key ]: newValue };
        setUserData(newUserData);
        const newError = validateLogin(newUserData);
        setErrors(prevErrors => ({ ...prevErrors, [ key ]: newError[ key ] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.values(userData).some(value => !value)) {
            toast.warn('Please, complete all fields.');
            return;
        }

        const validationErrors = validateLogin(userData);
        if (Object.keys(validationErrors).length === 0) {
            const success = await dispatch(userLogin(userData));
            if (!success) {
                toast.error('Login failed! Please check your credentials.');
            } else {
                toast.success('Login successful!',);
                navigate("/viewprofile");
            }
            setErrors("");
        }
    };

    return (
        <div>
            <Form
                formName="Sign In"
                userData={ userData }
                errors={ errors }
                handleChange={ handleChange }
                handleSubmit={ handleSubmit }
            />
        </div>
    );
}

export default Login;
