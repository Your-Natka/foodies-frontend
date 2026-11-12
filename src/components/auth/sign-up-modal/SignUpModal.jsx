import { useState } from "react";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import Modal from "../../shared/modal/Modal";
import { registerThunk } from "../../../redux/slices/auth/authOperations";
import { selectAuthStatus } from "../../../redux/slices/auth/authSlice";

import "../AuthModal.scss";

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must contain at least 2 characters")
    .max(255, "Name is too long")
    .required("Name is required"),

  email: Yup.string()
    .email("Enter a valid email")
    .max(255, "Email is too long")
    .required("Email is required"),

  password: Yup.string()
    .min(8, "Password must contain at least 8 characters")
    .max(72, "Password is too long")
    .required("Password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

function PasswordField({ name, placeholder, visible, onToggle }) {
  const { values } = useFormikContext();
  const hasValue = Boolean(values[name]);

  return (
    <div className="auth-form__password">
      <Field
        type={visible ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        aria-label={placeholder}
        className="auth-form__input"
      />

      {hasValue && (
        <button
          type="button"
          className="auth-form__password-toggle"
          onClick={onToggle}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          <svg width="24" height="24" aria-hidden="true">
            <use
              href={`/images/sprite.svg#${
                visible ? "icon-eye-food" : "icon-eye-off-food"
              }`}
            />
          </svg>
        </button>
      )}
    </div>
  );
}

function SignUpModal({ isOpen, onClose, onSwitchToSignIn }) {
  const dispatch = useDispatch();
  const status = useSelector(selectAuthStatus);
  const isLoading = status === "loading";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (values) => {
    const userData = {
      name: values.name,
      email: values.email,
      password: values.password,
    };

    try {
      await dispatch(registerThunk(userData)).unwrap();

      toast.success("Registration successful!");
      onClose();
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Registration failed");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sign up"
      className="modal--auth"
    >
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isValid, dirty }) => (
          <Form className="auth-form">
            <div className="auth-form__field">
              <Field
                type="text"
                name="name"
                placeholder="Name*"
                aria-label="Name"
                className="auth-form__input"
              />
              <ErrorMessage
                name="name"
                component="span"
                className="auth-form__error"
              />
            </div>

            <div className="auth-form__field">
              <Field
                type="email"
                name="email"
                placeholder="Email*"
                aria-label="Email"
                className="auth-form__input"
              />
              <ErrorMessage
                name="email"
                component="span"
                className="auth-form__error"
              />
            </div>

            <div className="auth-form__field">
              <PasswordField
                name="password"
                placeholder="Password*"
                visible={showPassword}
                onToggle={() => setShowPassword((current) => !current)}
              />
              <ErrorMessage
                name="password"
                component="span"
                className="auth-form__error"
              />
            </div>

            <div className="auth-form__field">
              <PasswordField
                name="confirmPassword"
                placeholder="Confirm password*"
                visible={showConfirmPassword}
                onToggle={() => setShowConfirmPassword((current) => !current)}
              />
              <ErrorMessage
                name="confirmPassword"
                component="span"
                className="auth-form__error"
              />
            </div>

            <button
              type="submit"
              className="auth-form__submit"
              disabled={isLoading || !isValid || !dirty}
            >
              {isLoading ? "Please wait..." : "CREATE"}
            </button>

            <p className="auth-form__switch">
              I already have an account?{" "}
              <button type="button" onClick={onSwitchToSignIn}>
                Sign in
              </button>
            </p>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

export default SignUpModal;
