import InputField from "@/components/inputField/InputField";
import blw from "/images/logo.png";
import * as ACTIONS from "@/store/actions/action_types";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./signin.scss";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import LoadingBar from "@/components/LoadingBar/LoadingBar";
import axios from "axios";
import Toast from "@/components/toast/Toast";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/interface/general";
import { smoothScrollTo } from "@/interface/functions";

export default function SignIn() {
  const formRef = useRef<HTMLFormElement>(null);

  const redirect = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toastType, setToastType] = useState("");
  const [loginError, setLoginError] = useState("");
  const [Email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const dispatch = useDispatch();

  const redirectionMessage = useSelector((state: RootState) => {
    return state.auth_reducer.redirectionMessage;
  });

  useEffect(() => {
    if (redirectionMessage) {
      setLoginError(redirectionMessage);
      setTimeout(() => {
        setLoginError("");
        localStorage.clear();
      }, 10000);
    }
  }, [redirectionMessage, dispatch]);

  const handleSignIn = (
    event: KeyboardEvent<HTMLInputElement> | FormEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    setEmailError("");
    setPasswordError("");
    setLoginError("");
        const form = formRef.current;

        if (form === null) return; // Guard to ensure formRef.current is not null

        // TypeScript now knows `form` is not null, so `querySelector` is safe
        const firstInvalidField = form.querySelector(
          ":invalid"
        ) as HTMLElement | null;

        if (firstInvalidField) {
          smoothScrollTo(firstInvalidField, 500); // Slow scroll (1000ms)
          firstInvalidField.focus();
        }


    // Check if email is empty or invalid
    if (!Email || !/\S+@\S+\.\S+/.test(Email)) {
      setEmailError("“Thou shalt not send without a valid email!”");
      return;
    }
    // Check if password is empty or less than 8 characters
    if (!password || password.length < 8) {
      setPasswordError("“Strong passwords are like strong faith—unbreakable!”");
      return;
    }

    if (Email && password) {
      const formData = new FormData();
      formData.append("email", Email);
      formData.append("password", password);

      setLoading(true);
      axios
        .post(
          "https://kingsrecord-backend.onrender.com/api/v1/admin-login",
          formData
        )
        .then((res) => {
          const userToken = res.data.access_token;
          localStorage.setItem("userToken", userToken);
          localStorage.setItem("username", res.data.firstName)
          setLoading(false);
          setSuccessMessage("Welcome back to Believers Love World");
          setToastType("success");
          dispatch({
            type: ACTIONS.LOGIN_SUCCESS,
          });

          setTimeout(() => {
            redirect("/admin-dashboard/overview");
            setToastType(""); // Reset after navigation
          }, 3000);
        })
        .catch((err) => {
          if (err.response.data.error === "Invalid email or password") {
            setPasswordError("This password is not in the book of life");
          } else {
            // User not found error
            setEmailError("This email is not among the sheep of the lord");
          }
          setLoading(false);
          setToastType("error");
          setTimeout(() => {
            setToastType(""); // Reset toast on error
          }, 5000);
        })
        .finally(() => {
          console.log("Signin Complete");
          setTimeout(() => {
            setLoginError("");
          });
        });
    }
  };

  // this block of code displays the loader
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
    }, 2000);
  });
  if (loader) return <LoadingBar height="90vh" />;

  return (
    <>
      {/* First Column */}
      <div className="signinContainer">
        <div className="firstColumn text-white bg-[url('/images/Image.png')]">
          <div className="header flex flex-col items-center justify-center mb-16 space-y-4">
            <img src={blw} className="w-14 h-12" />
            <h2 className="text-[32px] font-bold leading-10">
              Welcome to KingsRecord
            </h2>
            <p className="font-normal text-sm">
              Manage your Ministry Members, Givings and Partnership data
            </p>
          </div>
        </div>
        {/* 2nd Column */}
        <div className="secondColumn bg-white">
          <div className="FormContainer">
            <div className="formHeader text-left text-gray-900 text-2xl leading-9  tracking-tight">
              <h2 className="2xl:font-normal text-[#347AE2] leading-10 text-[32px] capitalize">
                Welcome Back
              </h2>
              <p className="font-normal text-sm text-[#A0AEC0] leading-5">
                Enter your email and password to sign in
              </p>
            </div>

            <div className="signin-form">
              <form ref={formRef} className="space-y-6">
                <div className="row">
                  <InputField
                    type="email"
                    label="Email"
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                    // This traps the user Email input and updates the local state
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError("");
                    }}
                  />
                  <span className="error">{emailError}</span>
                </div>
                <div>
                  <InputField
                    type="password"
                    label="Password"
                    placeholder="Enter your password"
                    required
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSignIn(e);
                      }
                    }}
                  />
                  <span className="error">{passwordError}</span>
                </div>

                <span className="flex text-xs space-x-2 leading-[18px]">
                  <Switch className="h-6" />
                  <p className="capitalize text-[#2D3748]">remember me</p>
                </span>

                <Button
                  className="w-full p-6 uppercase bg-[#347AE2] text-base font-normal leading-6 text-white hover:bg-indigo-500 animate duration-500 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  onClick={handleSignIn}
                >
                  {loading ? <span className="loader"></span> : "sign in"}
                </Button>
              </form>
              {successMessage ? (
                <span className="login-success">{successMessage}</span>
              ) : (
                <span className="login-error">{loginError}</span>
              )}

              <p className="mt-2 text-left font-normal text-sm leading-5 text-[#A0AEC0]">
                Don't have an account?{" "}
                <NavLink to={"/signup"} className="text-[#347AE2]">
                  Sign up
                </NavLink>
              </p>
            </div>
          </div>
        </div>

        {toastType !== "" && (
          <Toast
            type={toastType}
            successMessage="Login Successful"
            successSubmessage="Redirecting..."
          />
        )}
      </div>
    </>
  );
}
