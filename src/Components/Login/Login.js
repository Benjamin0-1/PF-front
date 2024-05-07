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
    const [ userData, setUserData ] = useState({
        username: '',
        password: '',
    });
    const [ errors, setErrors ] = useState({});
    const [ message, setMessage ] = useState({
        success: "",
        error: ""
    });
    const accessToken = useSelector(state => state.user.tokens.accessToken);
    const success = useSelector(state => state.user.success);

    useEffect(() => {
        if (accessToken.length) {
            window.location.href = '/viewprofile'
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
            await dispatch(userLogin(userData))
                .then(r => {
                    if (r.success) {
                        return toast.success(`${r.success}, redirecting to the store`);
                    } else if (r.error) {

                        return toast.error(r.error);
                    }
                })
            setErrors("");
            setUserData({
                username: '',
                password: '',
            })
            setTimeout(() => {
                window.location.href = '/'
            }, 2000);
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
