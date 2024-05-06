import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import Form from "../Form/Form";
import { validateRegister } from "../../hooks/useValidate"
import { userSignup } from "../../redux/actionUser";


const Register = () => {
    const [ userData, setUserData ] = useState({
        firstName: '',
        lastName: '',
        username: '',
        confirmUsername: "",
        email: '',
        confirmEmail: "",
        password: '',
        confirmPassword: '',
    });
    const [ errors, setErrors ] = useState({});
    const [ message, setMessage ] = useState({});
    const dispatch = useDispatch()
    const success = useSelector(state => state.user.success)
    const error = useSelector(state => state.user.error)
    const handleChange = (event, key) => {
        event.preventDefault();
        const newValue = event.target.value;
        let newUserData = { ...userData, [ key ]: newValue };
        setUserData(newUserData);
        const newError = validateRegister(newUserData);
        setErrors(prevErrors => ({ ...prevErrors, [ key ]: newError[ key ] }));
    };
    useEffect(() => {
        if (success) {
            setMessage(success)
        }
        if (error) {
            setMessage(error)
        }
    }, [ success, error ]);
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (Object.values(userData).some(value => !value)) {
            toast.warn('Please, complete all fields.');
            return;
        }

        const validationErrors = validateRegister(userData);
        console.log(validationErrors);

        if (Object.keys(validationErrors).length === 0) {

            await dispatch(userSignup(userData));
            if (error || errors) {
               return toast.error(message);
            }
            toast.success(message);
            // setUserData({
            //     firstName: '',
            //     lastName: '',
            //     username: '',
            //     confirmUsername: "",
            //     email: '',
            //     confirmEmail: "",
            //     password: '',
            //     confirmPassword: '',
            // });



        }
    };

    // useEffect(() => {
    //     if (serverError) {
    //         setErrors({...errors, username: errorMessage});
    //         setMessage({ ...message, error: errorMessage });
    //     } else {
    //         setMessage({ ...message, success: successMessage});
    //     }
    // }, [serverError, errorMessage]);

    return (
        <div>
            <Form
                formName="Sign Up"
                userData={ userData }
                errors={ errors }
                handleChange={ handleChange }
                handleSubmit={ handleSubmit }
            />
        </div>
    )
}

export default Register;