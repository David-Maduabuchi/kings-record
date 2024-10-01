import {
  ChangeEvent,
  useEffect,
  useState,
  FormEvent,
  useRef,
  KeyboardEvent,
} from "react";
import LoadingBar from "@/components/LoadingBar/LoadingBar";
import InputField from "@/components/inputField/InputField";
import OptionsField from "@/components/optionsField/OptionField";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import * as ACTIONS from "../../../store/actions/action_types";
import Toast from "@/components/toast/Toast";
import { formatPhoneNumber, smoothScrollTo } from "@/interface/functions";
import { format } from "date-fns";
import { useDispatch } from "react-redux";
const initialState = {
  title: "",
  firstName: "",
  lastName: "",
  Date: "",
  email: "",
  phoneNumber: "",
  partnershipsType: "",
  partnershipAmount: "",
};
const UpdatePartnership = () => {
  const [toastType, setToastType] = useState("");
  const [isInfoBoxOpen, setIsInfoBoxOpen] = useState(true);
  const [redirectButton, setRedirectButton] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const formRef = useRef<HTMLFormElement>(null);
  const today = new Date().toISOString().split("T")[0];
  const newErrors: { [key: string]: string } = {};
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // DEFINE FORM DATA
  // DELETE OPTIONS FIELD
  // UPDATE FORM DATA CORRECTLY
  // UPDATE THE VALIDATE ERRORRS
  // ENABLE PUT REQUEST
  // STYING

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch({
      type: ACTIONS.CLOSE_SIDEBAR,
    }); // Scroll to the top of the page
  }, [pathname, dispatch]);

  const handleRedirectToAdd = (redirectEMail: string) => {
    dispatch({
      type: ACTIONS.ADD_EMAIL_TO_DB,
      payload: redirectEMail,
    });
    navigate("/admin-dashboard/add-data/new-member");
  };
  // Sample data based on your backend requirements

  const raphsodyOfRealitiesOptions = [
    "Rhapsody of Realities",
    "Healings Streams",
    "Campus Ministry",
    "InnerCity Missions",
    "Ministry Programs",
  ];

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRedirectButton(false);

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

  const handleOptionsChange = (name: string, value: string) => {
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
  const validateField = () => {
    if (!formData.firstName)
      newErrors.firstName = "Adam named all things, yet this field has none";
    if (!formData.title) newErrors.title = "No title provided  ";
    if (!formData.lastName)
      newErrors.lastName = "The lineage matters - provide a surname";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "We need a valid email to fellowship  .";
    if (!formData.phoneNumber)
      newErrors.phoneNumber = "Please provide a number.";

    if (!formData.Date) newErrors.Date = "Please provide a date";
    if (formData.phoneNumber.length < 11) {
      newErrors.phoneNumber = "Please provide a valid phone number";
    }
    if (!formData.partnershipAmount)
      newErrors.partnershipAmount = "Please provide a value";
    if (!formData.partnershipsType)
      newErrors.partnershipsType = "Please select a givings type";
    if (parseInt(formData.partnershipAmount) < 0)
      newErrors.partnershipAmount = "Amount cannot be less than Zero";
    return newErrors;
  };

  const handleSubmit = async (
    event: KeyboardEvent<HTMLInputElement> | FormEvent<HTMLButtonElement>
  ) => {
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

    const validationErrors = validateField();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);

      const formDataToSend = {
        title: formData.title,
        firstName: formData.firstName,
        lastName: formData.lastName,
        Date: format(new Date(formData.Date), "yyyy-MM-dd"), // Format the date correctly
        email: formData.email.toLowerCase(),
        phoneNumber: formatPhoneNumber(formData.phoneNumber), // Format phone number properly
        partnerships: [
          {
            type: formData.partnershipsType,
            amount: parseInt(formData.partnershipAmount, 10), // Ensure the amount is an integer
          },
        ],
      };
      console.log(formDataToSend);
      axios
        .post(
          "https://kingsrecordbackend-production.up.railway.app/api/v1/partnership-register",
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${localStorage
                .getItem("userToken")
                ?.toString()}`, // Add your token
              "Content-Type": "application/json", // Set content type for FormData
            },
          }
        )
        .then((res) => {
          setLoading(false);
          setToastType("success");
          setToastMessage(res.data.message);
          setFormData(initialState);
          setTimeout(() => {
            setToastType("");
          }, 3000);
        })
        .catch(() => {
          setLoading(false);
          setToastType("error");
          setTimeout(() => {
            setToastType("");
          }, 5000);
        })
        .catch((error) => {
          console.log(error);

          // Handle different types of errors
          if (error.response) {
            // 4xx or 5xx status code
            if (error.response.data.error === "Member not found in database") {
              setErrors((prevErrors) => ({
                ...prevErrors,
                email:
                  "This user was not found, proceed to the add new member section and try again.",
              }));
              setRedirectButton(true);
            } else {
              setErrors((prevErrors) => ({
                ...prevErrors,
                email:
                  "There was an issue verifying the email. Please try again.",
              }));
            }
          } else if (error.request) {
            // No response received after request was sent
            setErrors((prevErrors) => ({
              ...prevErrors,
              email: "No response from the server. Please check your network.",
            }));
          } else if (error.message.includes("ERR_NAME_NOT_RESOLVED")) {
            // Domain resolution error
            setErrors((prevErrors) => ({
              ...prevErrors,
              email:
                "The server address could not be found. Please check the URL.",
            }));
          } else {
            // Other unexpected errors
            setErrors((prevErrors) => ({
              ...prevErrors,
              email: "An unexpected error occurred. Please try again later.",
            }));
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  const [emailLoader, setEmailLoader] = useState(false);

  const handleFormFiller = (formEmail: string) => {
    if (!formEmail || !/\S+@\S+\.\S+/.test(formEmail)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "A valid email is required.",
      }));
      return;
    }
    setErrors({}); // Reset errors before the request

    setEmailLoader(true);

    // Create an axios request with a 10-second timeout
    axios
      .get(
        `https://kingsrecordbackend-production.up.railway.app/api/v1/verify-member/${formEmail.toLowerCase()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
          timeout: 10000, // Timeout set to 10 seconds (10,000 milliseconds)
        }
      )
      .then((response) => {
        const memberData = response.data.data;
        console.log(response.data.data);
        // Fill the form fields based on the response data
        setFormData((prevFormData) => ({
          ...prevFormData,
          firstName: memberData.firstName || "",
          lastName: memberData.lastName || "",
          phoneNumber: formatPhoneNumber(memberData.phoneNumber) || "",
          birthDate: memberData.birthDate || "",
          title: memberData.title || "",
        }));
      })
      .catch((error) => {
        console.log(error);

        // Handle different types of errors
        if (error.response) {
          // 4xx or 5xx status code
          if (error.response.data.error === "Member not found in database") {
            setErrors((prevErrors) => ({
              ...prevErrors,
              email:
                "This user was not found, proceed to the add new member section and try again.",
            }));
            setRedirectButton(true);
          } else {
            setErrors((prevErrors) => ({
              ...prevErrors,
              email:
                "There was an issue verifying the email. Please try again.",
            }));
          }
        } else if (error.code === "ECONNABORTED") {
          // Handle timeout error
          setErrors((prevErrors) => ({
            ...prevErrors,
            email:
              "The request took too long to complete. Please check your network connection and try again.",
          }));
        } else if (error.request) {
          // No response received after request was sent
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: "No response from the server. Please check your network.",
          }));
        } else if (error.message.includes("ERR_NAME_NOT_RESOLVED")) {
          // Domain resolution error
          setErrors((prevErrors) => ({
            ...prevErrors,
            email:
              "The server address could not be found. Please check the URL.",
          }));
        } else {
          // Other unexpected errors
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: "An unexpected error occurred. Please try again later.",
          }));
        }
      })
      .finally(() => {
        setEmailLoader(false); // Stop the loader after request finishes
      });
  };

  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const handleFormRelations = (event: ChangeEvent<HTMLInputElement>) => {
    const searchMail = event.target.value;

    // Clear any existing timeout
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    // Set a new timeout to handle the delayed API call
    timeoutId.current = setTimeout(() => {
      handleFormFiller(searchMail);
    }, 1000); // Delay of 1 second

  };

  // Loading logic
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
    }, 1000);
  }, []);

  if (loader) return <LoadingBar height="90vh" />;

  return (
    <div className="AddNewContainer updateGivingsContainer">
      <header>Update Partnership Data</header>
      {isInfoBoxOpen && (
        <div className="records-info">
          <p>
            Auto Form Fill, just type in the email and the form auto fills.
          </p>
          <button onClick={() => setIsInfoBoxOpen(false)}>Okay, got it!</button>
        </div>
      )}
      <form ref={formRef} className="inputFieldContainer">
        <section className="row">
          <div className="email-container">
            <div className="email-filler">
              <InputField
                type="email"
                name="email"
                label="Email"
                placeholder="e.g example@gmail.com"
                required
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleFormFiller(formData.email);
                }}
                onChange={(e) => {
                  handleChange(e);
                  handleFormRelations(e);
                }}
                value={formData.email}
              />
              {redirectButton && (
                <div className="redirectButton">
                  <button onClick={() => handleRedirectToAdd(formData.email)}>
                    Add User
                  </button>
                </div>
              )}
              {emailLoader && (
                <div className="loaderContainer">
                  <div className="email-loader"></div>
                </div>
              )}
            </div>
            <div className="error-message">{errors.email}</div>
          </div>
          <div>
            <InputField
              type="text"
              name="firstName"
              label="First Name"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit(e);
              }}
              placeholder="e.g David"
              required
              readOnly
              onChange={handleChange}
              value={formData.firstName}
            />
            <span className="error-message ">{errors.firstName}</span>
          </div>
        </section>

        <section className="row">
          <div>
            <InputField
              type="text"
              name="lastName"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit(e);
              }}
              label="Last Name"
              placeholder="e.g Maduabuchi"
              required
              readOnly
              onChange={handleChange}
              value={formData.lastName}
            />
            <span className="error-message ">{errors.lastName}</span>
          </div>

          <div>
            <InputField
              type="text"
              name="title"
              required
              readOnly
              label="Title"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit(e);
              }}
              placeholder="e.g Brother, Sister"
              onChange={handleChange}
              value={formData.title}
            />
            <span className="error-message ">{errors.title}</span>
          </div>
        </section>

        <section className="row">
          <div>
            <InputField
              type="tel"
              name="phoneNumber"
              label="Phone Number"
              placeholder="08164413182"
              required
              readOnly
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit(e);
              }}
              minLength={11}
              onChange={handleChange}
              value={formatPhoneNumber(formData.phoneNumber)}
            />
            <span className="error-message">{errors.phoneNumber}</span>
          </div>
        </section>
      </form>

      <section className="optionsFieldSection">
        {/* Givings Type Section */}
        <div className="optionsFieldContainer">
          <h5 className="font-bold">
            Partnership Arms <span className="red-color">*</span>
          </h5>

          <div>
            <OptionsField
              value={formData.partnershipsType}
              dataLabel="partnershipsType"
              options={raphsodyOfRealitiesOptions}
              onInputChange={handleOptionsChange} // Pass handleOptionsChange function from parent
              label="Select Partnership Arm"
            />
            <span className="error-message">{errors.partnershipsType}</span>
          </div>

          <div>
            <InputField
              type="number"
              name="partnershipAmount"
              label=""
              placeholder="Amount(N)"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit(e);
              }}
              onChange={handleChange}
              value={formData.partnershipAmount}
            />
            <span className="error-message">{errors.partnershipAmount}</span>
          </div>
        </div>
      </section>

      <div className="date">
        <InputField
          type="date"
          required
          name="Date"
          max={today}
          label="Date of Giving"
          onChange={handleChange}
          value={formData.Date}
        />
        <span className="error-message">{errors.Date}</span>
      </div>
      {loading ? (
        <div className="buttonContainer">
          <span className="loader"></span>
        </div>
      ) : (
        <div className="buttonContainer">
          <button onClick={handleSubmit} className="save p-4">
            Update Now
          </button>
        </div>
      )}
      {toastType !== "" && (
        <Toast
          type={toastType}
          successMessage={toastMessage}
          successSubmessage="Thank you for your time"
        />
      )}
    </div>
  );
};

export default UpdatePartnership;
