import { useState } from "react";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import Modal from "../../shared/modal/Modal";
import { loginThunk } from "../../../redux/slices/auth/authOperations";
import { selectAuthStatus } from "../../../redux/slices/auth/authSlice";

import "../AuthModal.scss";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

function PasswordField({ visible, onToggle }) {
  const { values } = useFormikContext();
  const hasValue = Boolean(values.password);

  return (
    <div className="auth-form__password">
      <Field
        type={visible ? "text" : "password"}
        name="password"
        placeholder="Password*"
        aria-label="Password"
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

function SignInModal({ isOpen, onClose, onSwitchToSignUp }) {
  const dispatch = useDispatch();
  const status = useSelector(selectAuthStatus);
  const isLoading = status === "loading";

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (values) => {
    try {
      await dispatch(loginThunk(values)).unwrap();

      toast.success("Welcome back!");
      onClose();
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Login failed");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sign in"
      className="modal--auth"
    >
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isValid, dirty }) => (
          <Form className="auth-form">
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
                visible={showPassword}
                onToggle={() => setShowPassword((current) => !current)}
              />
              <ErrorMessage
                name="password"
                component="span"
                className="auth-form__error"
              />
            </div>

            <button
              type="submit"
              className="auth-form__submit"
              disabled={isLoading || !isValid || !dirty}
            >
              {isLoading ? "Please wait..." : "SIGN IN"}
            </button>

            <p className="auth-form__switch">
              Don't have an account?{" "}
              <button type="button" onClick={onSwitchToSignUp}>
                Sign up
              </button>
            </p>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

export default SignInModal;
