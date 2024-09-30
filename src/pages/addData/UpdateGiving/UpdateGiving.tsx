import {
  ChangeEvent,
  useEffect,
  useState,
  FormEvent,
  useRef,
  KeyboardEvent,
} from "react";
import "./UpdateGivings.scss";
import LoadingBar from "@/components/LoadingBar/LoadingBar";
import InputField from "@/components/inputField/InputField";
import OptionsField from "@/components/optionsField/OptionField";
import axios from "axios";
import { useLocation } from "react-router-dom";
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
  givingsType: "",
  givingsAmount: "",
};
const UpdateGiving = () => {
  const [toastType, setToastType] = useState("");
  const [isInfoBoxOpen, setIsInfoBoxOpen] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const formRef = useRef<HTMLFormElement>(null);
  const today = new Date().toISOString().split("T")[0];
  const newErrors: { [key: string]: string } = {};

  // DEFINE FORM DATA
  // DELETE OPTIONS FIELD
  // UPDATE FORM DATA CORRECTLY
  // UPDATE THE VALIDATE ERRORRS
  // ENABLE PUT REQUEST
  // STYING
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch({
      type: ACTIONS.CLOSE_SIDEBAR,
    }); // Scroll to the top of the page
  }, [pathname, dispatch]);

  // Sample data based on your backend requirements
  const [formData, setFormData] = useState(initialState);

  const givingsTypeOptions = [
    "Offering",
    "Tithes",
    "Special Seeds",
    "Donation",
  ];

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
    if (!formData.givingsAmount)
      newErrors.givingsAmount = "Please provide a value";
    if (!formData.givingsType)
      newErrors.givingsType = "Please select a givings type";
    if (parseInt(formData.givingsAmount) < 0)
      newErrors.givingsAmount = "Amount cannot be less than Zero";
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
        givings: [
          {
            type: formData.givingsType,
            amount: parseInt(formData.givingsAmount, 10), // Ensure the amount is an integer
          },
        ],
      };
      console.log(formDataToSend);
      axios
        .post(
          "https://kingsrecordbackend-production.up.railway.app/api/v1/givings-register",
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
        .finally(() => {
          setLoading(false);
        });
    }
  };
  const [emailLoader, setEmailLoader] = useState(false);

  const handleFormFiller = (formEmail: string) => {
    // Check if email is empty
    if (!formEmail || !/\S+@\S+\.\S+/.test(formEmail)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "A valid email is required.",
      }));
      return; // Exit the function early
    }
    setErrors({});

    setEmailLoader(true);
    // Send the email as a query parameter using axios
    axios
      .get(
        `https://kingsrecordbackend-production.up.railway.app/api/v1/verify-member/${formEmail.toLowerCase()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
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
        console.log(error.response);
        if (error.response.data.error === "Member not found in database") {
          setErrors((prevErrors) => ({
            ...prevErrors,
            email:
              "This user was not found, proceed to the add new member section and try again",
          }));
        }

        // Optionally, handle the error by setting an error message
      })
      .finally(() => {
        setEmailLoader(false);
      });
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
      <header>Update Givings Data</header>
      {isInfoBoxOpen && (
        <div className="records-info">
          <p>
            After typing an email, hit the enter key in the email field to
            automatically fill the form.
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
                onChange={handleChange}
                value={formData.email}
              />
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
            Givings Type <span className="red-color">*</span>
          </h5>
          <div>
            <OptionsField
              value={formData.givingsType}
              dataLabel="givingsType"
              onInputChange={handleOptionsChange}
              options={givingsTypeOptions}
              label={"Select Givings Type"}
            />
            <span className="error-message">{errors.givingsType}</span>
          </div>

          <div>
            <InputField
              type="number"
              name="givingsAmount"
              label=""
              placeholder="Amount(N)"
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit(e);
              }}
              value={formData.givingsAmount}
            />
            <span className="error-message">{errors.givingsAmount}</span>
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

export default UpdateGiving;
