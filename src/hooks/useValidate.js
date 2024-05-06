export const validateRegister = (userData) => {
    let errors = {};
    for (let key in userData) {
        if (userData[ key ] === '') {
            errors[ key ] = 'El campo no puede estar vacío.';
        } else if (key === 'email' && !/\S+@\S+\.\S+/.test(userData.email)) {
            errors.email = 'Ingresa un email válido.';
        } else if (key === 'password' && !/^(?=.*\d)(?=.*[A-Z])(?=.*[\W_]).{8,}$/.test(userData.password)) {
            errors.password = 'La contraseña tiene que tener al menos un número, una mayúscula, un carácter especial y una longitud mínima de 8 caracteres.';
        } else if ((key === 'firstName' || key === 'lastName') && !/^[A-Za-z]+$/.test(userData[ key ])) {
            errors[ key ] = 'Solo puede contener letras.';
        } else if (key === 'username' && !/^[A-Za-z0-9]+$/.test(userData[ key ])) {
            errors[ key ] = 'Solo puede contener letras y números, sin espacios.';
        }
        if (key === "confirmPassword" && userData.password !== userData.confirmPassword) {
            errors.confirmPassword = "La contraseña no coincide";
        } else if (key === "confirmEmail" && userData.email !== userData.confirmEmail) {
            errors.confirmEmail = "El email no coincide";
        } else if (key === "confirmUsername" && userData.username !== userData.confirmUsername) {
            errors.confirmUsername = "El nombre de usuario no coincide";
        }

    }
    return errors;
}


export const validateLogin = (userData) => {
    let errors = {};
    for (let key in userData) {
        if (userData[ key ] === '') {
            errors[ key ] = 'El campo no puede estar vacío.';
        } else if (key === 'username' && !/^[A-Za-z0-9]+$/.test(userData.username)) {
            errors.username = 'Solo puede contener letras y números, sin espacios.';
        } else if (key === 'password' && !/^(?=.*\d)(?=.*[A-Z])(?=.*[\W_]).{8,}$/.test(userData.password)) {
            errors.password = 'La contraseña tiene que tener al menos un número, una mayúscula, un carácter especial y una longitud mínima de 8 caracteres.';
        }
    }
    return errors;
}

export const validateProduct = (productData) => {
    let errors = {}
    console.log(productData);
    for (let key in productData) {
        if (productData[ key ] === '') {
            errors[ key ] = 'El campo no puede estar vacío.';
        }
    }
    return errors
}