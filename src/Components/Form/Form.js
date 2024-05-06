import { ToastContainer } from "react-toastify";
import styles from './Form.module.css';
import { SignIn, SignUp } from "@clerk/clerk-react";

function Form({ userData, errors, handleChange, handleSubmit, formName, disabled }) {
  return (
    <div className={ styles.container }>
      <ToastContainer
        position="bottom-right"
      />
      <div className={ styles.containergeneralForm }>
        <form onSubmit={ handleSubmit } className={ styles.formContainer }>
          <h2>{ formName }</h2>
          { Object.keys(userData).map((key) => (
            <div className={ styles.formGroup } key={ key }>
              <input
                placeholder={ key }
                type={ key === "password" || key === "confirmPassword" ? "password" : "text" }
                name={ key }
                value={ userData[ key ] }
                onChange={ (event) => handleChange(event, key) }
              />
              { errors[ key ] && <p className={ styles.errorMessage }>{ errors[ key ] }</p> }
            </div>
          )) }
          <button className={ styles.submitButton } type="submit">
            { formName }
          </button>
          { formName === "Sign In" ? (
            <p className={ styles.styleParagraph }>
              Not a member? <a href="/signup">Sign Up now</a>
            </p>
          ) : (
            <p className={ styles.styleParagraph }>
              Already have an account? <a href="/login">Sign In</a>
            </p>
          ) }
        </form>
        <div className={ styles.clerk } >
         {formName === "Sign In" ? <SignIn /> : <SignUp/>} 
        </div>
      </div>
    </div>
  );
}

export default Form;
