import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import InputField from "@/components/inputField/InputField";
import blw from "/images/logo.png";
import "./signUp.scss";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { NavLink, useNavigate } from "react-router-dom";
import Toast from "@/components/toast/Toast";
import axios from "axios";
import LoadingBar from "@/components/LoadingBar/LoadingBar";
import { smoothScrollTo } from "@/interface/functions";

export default function SignUp() {
  const [successMessage, setSuccessMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    chapter: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };
  const newErrors: { [key: string]: string } = {};
  const validateField = () => {
    // Explicitly type the error object
    if (!formData.title) {
      newErrors.title =
        "“The Lord’s title is 'I AM', what title do you stand with?”";
    }
    if (!formData.firstName) {
      newErrors.firstName = "“God knows your name—let us know too!”";
    }
    if (!formData.lastName) {
      newErrors.lastName =
        "“Declare your last name, as you walk in His grace!”";
    }
    if (!formData.chapter) {
      newErrors.chapter = "“What chapter of BLW are you in today?”";
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email =
        "“Stay connected! A valid email keeps us in fellowship.”";
    }
    if (!formData.phoneNumber) {
      newErrors.phoneNumber =
        "“We’d love to reach out—please provide your number!”";
    }
    if (formData.password.length < 8) {
      newErrors.password =
        "“Even the armor of God is strong—your password needs strength too!”";
    }
    if (confirmPassword !== formData.password) {
      newErrors.confirmPassword =
        "“Unity is strength—make sure both passwords match!”";
    }

    return newErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
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
    setFormData((prevData) => ({
      ...prevData,
      chapter: prevData.chapter.toUpperCase(),
    }));

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("firstName", formData.firstName);
    formDataToSend.append("lastName", formData.lastName);
    formDataToSend.append("chapter", formData.chapter.toUpperCase());
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("phoneNumber", formData.phoneNumber);

    const validationErrors = validateField();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      axios
        .post(
          "https://kingsrecordbackend-production.up.railway.app/api/v1/admin-register",
          formDataToSend
        )
        .then(() => {
          setLoading(false);
          setToastType("success");
          setSuccessMessage("Info has been entered into the book of life");
          setTimeout(() => {
            navigate("/signin");
            setToastType(""); // Reset after navigation
          }, 3000);
        })
        .catch((err) => {
          console.log(err);
          if (err.response.data.error === "Email already exists") {
            newErrors.email =
              "Do not be covetious, this email belongs to another!";
            // MARK EMAIL FIELD AS INVALID TO ENABLE SCROLLING TO EMAIL FIELD
            const emailField = document.querySelector(
              '[name="email"]'
            ) as HTMLInputElement;
            if (emailField) {
              emailField.setAttribute("aria-invalid", "true");
              smoothScrollTo(emailField, 500); // Slow scroll (1000ms)
              emailField.focus();
            }
          }

          console.log("ooo");
          setLoading(false);
          setToastType("error");
          setTimeout(() => {
            setToastType(""); // Reset toast on error
          }, 5000);
        })
        .finally(() => {
          console.log("Signin Complete");
        });
    }
  };

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  function capitals(string: string) {
    return string.toUpperCase();
  }

  //this section displays stylish loader
  const [loadingBar, setloadingBar] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setloadingBar(false);
    }, 2000);
  });
  if (loadingBar) return <LoadingBar height="90vh" />;

  return (
    <div className="signupContainer">
      <div className="backgroundImage">
        <div className="content">
          <div className="header flex flex-col items-center text-center text-white justify-center mb-6 space-y-3">
            <img src={blw} className="w-14 h-12" />
            <h2 className="text-[32px] font-bold leading-10">
              Welcome to KingsRecord
            </h2>
            <p className="font-normal text-sm px-7">
              Manage your Ministry Members, Givings and Partnership data
            </p>
          </div>
        </div>
      </div>
      {/* right hand side of signup */}
      <div className="formContainer">
        <form ref={formRef} method="post">
          <div>
            <InputField
              type="text"
              label="Title"
              placeholder="eg. Brother, Sister, Pastor"
              required
              autoComplete="title"
              name="title"
              value={capitalizeFirstLetter(formData.title)}
              onChange={handleChange}
            />
            <span>{errors.title}</span>
          </div>

          <div>
            <InputField
              type="text"
              label="First Name"
              placeholder="David"
              required
              name="firstName"
              value={capitalizeFirstLetter(formData.firstName)}
              onChange={handleChange}
            />
            <span>{errors.firstName}</span>
          </div>

          <div>
            <InputField
              type="text"
              label="Last Name"
              placeholder="Maduabuchi"
              required
              name="lastName"
              value={capitalizeFirstLetter(formData.lastName)}
              onChange={handleChange}
            />
            <span>{errors.lastName}</span>
          </div>

          <div>
            <InputField
              type="text"
              label="Chapter"
              placeholder="eg. BLW UNN"
              required
              name="chapter"
              value={capitals(formData.chapter)}
              onChange={handleChange}
            />
            <span>{errors.chapter}</span>
          </div>
          <div>
            <InputField
              type="email"
              label="Email"
              placeholder="davidmaduabuchi62@gmail.com"
              required
              autoComplete="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <span>{errors.email}</span>
          </div>

          <div>
            <InputField
              type="text"
              label="Phone Number"
              placeholder="08164413182"
              required
              autoComplete="phone-number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
            <span>{errors.phoneNumber}</span>
          </div>
          <div>
            <InputField
              type="password"
              placeholder="**********"
              label="Password"
              required
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <span>{errors.password}</span>
          </div>

          <span className="flex text-xs space-x-2 leading-[18px]">
            <Switch className="h-6" />
            <p className="capitalize text-[#2D3748]">remember me</p>
          </span>

          <div>
            <InputField
              type="password"
              placeholder="**********"
              label="Confirm Password"
              required
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors) {
                  setErrors({
                    ...errors,
                    confirmPassword: "",
                  });
                }
              }}
            />
            <span>{errors.confirmPassword}</span>
          </div>

          <Button
            type="submit"
            onClick={handleSubmit}
            className="w-full uppercase p-6 bg-[#347AE2] text-base font-normal leading-6 text-white hover:bg-indigo-500 animate duration-500 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {loading ? <span className="loader"></span> : "sign up"}
          </Button>
          <span className="login-success">{successMessage}</span>
          <p className="mt-3.5 text-left font-normal text-sm leading-5 text-[#A0AEC0]">
            Already have an account?
            <NavLink to={"/signin"} className="text-[#347AE2] ml-2">
              Sign in
            </NavLink>
          </p>
        </form>

        {toastType !== "" && (
          <Toast
            type={toastType}
            successMessage="Admin Account Created"
            successSubmessage="Redirecting to signin..."
          />
        )}
      </div>
    </div>
  );
}
