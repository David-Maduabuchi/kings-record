import { ChangeEvent, useEffect, useState, FormEvent, useRef } from "react";
import "./UpdateGivings.scss";
import LoadingBar from "@/components/LoadingBar/LoadingBar";
import InputField from "@/components/inputField/InputField";
import OptionsField from "@/components/optionsField/OptionField";
import axios from "axios";
import { useLocation } from "react-router-dom";
import * as ACTIONS from "../../../store/actions/action_types";
import Toast from "@/components/toast/Toast";
import { smoothScrollTo } from "@/interface/functions";
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
  partnershipAmount: 0,
  givingsType: "",
  givingsAmount: 0,
};
const UpdateGiving = () => {
  const [toastType, setToastType] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const formRef = useRef<HTMLFormElement>(null);
  const today = new Date().toISOString().split("T")[0];

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

  const raphsodyOfRealitiesOptions = [
    "Rhapsody of Realities",
    "Healings Streams",
    "Campus Ministry",
    "InnerCity Missions",
    "Ministry Programs",
  ];

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
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName)
      newErrors.firstName = "Just as God called people by name, what is yours?";
    if (!formData.lastName)
      newErrors.lastName = "The lineage matters - what is your surname?";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email =
        "As God sent messages to prophets, we need your email to reach you.";
    if (!formData.phoneNumber)
      newErrors.phoneNumber =
        "How will we call if the trumpet sounds? Please provide your number.";
    if (!formData.Date)
      newErrors.Date =
        "In the beginning, God set a date – please provide yours.";
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

    const validationErrors = validateField();
    setErrors(validationErrors);
    console.log(errors);
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);

      const formDataToSend = {
        title: formData.title,
        firstName: formData.firstName,
        lastName: formData.lastName,
        Date: format(formData.Date, "yyyy-MM-dd"),
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        partnerships: [
          {
            type: formData.partnershipsType,
            amount: formData.partnershipAmount,
          },
        ],
        givings: [
          {
            type: formData.givingsType,
            amount: formData.givingsAmount,
          },
        ],
      };
      axios
        .put(
          "https://kingsrecord-backend.onrender.com/api/v1/form-data",
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

  // Loading logic
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
    }, 1000);
  }, []);

  if (loader) return <LoadingBar height="90vh" />;

  return (
    <div className="AddNewContainer">
      <form ref={formRef} className="inputFieldContainer">
        <div>
          <InputField
            type="email"
            name="email"
            label="Email"
            placeholder="e.g example@gmail.com"
            required
            onChange={handleChange}
            value={formData.email}
          />
          <span className="error-message">{errors.email}</span>
        </div>
        <div>
          <InputField
            type="text"
            name="firstName"
            label="First Name"
            placeholder="e.g David"
            required
            onChange={handleChange}
            value={formData.firstName}
          />
          <span className="error-message ">{errors.firstName}</span>
        </div>

        <div>
          <InputField
            type="text"
            name="lastName"
            label="Last Name"
            placeholder="e.g Maduabuchi"
            required
            onChange={handleChange}
            value={formData.lastName}
          />
          <span className="error-message ">{errors.lastName}</span>
        </div>

        <div>
          <InputField
            type="tel"
            name="phoneNumber"
            label="Phone Number"
            placeholder="08164413182"
            required
            onChange={handleChange}
            value={formData.phoneNumber}
          />
          <span className="error-message">{errors.phoneNumber}</span>
        </div>

        <div>
          <InputField
            type="date"
            name="Date"
            max={today}
            label="Date"
            required
            onChange={handleChange}
            value={formData.Date}
          />
          <span className="error-message">{errors.Date}</span>
        </div>
      </form>

      {/* Partnership Arms Section */}
      <div className="optionsFieldContainer">
        <h5 className="font-bold">Partnership Arms</h5>

        <div>
          <OptionsField
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
            onChange={handleChange}
            value={formData.partnershipAmount}
          />
          <span className="error-message">{errors.partnershipAmount}</span>
        </div>
      </div>

      {/* Givings Type Section */}
      <div className="optionsFieldContainer">
        <h5 className="font-bold">Givings Type</h5>
        <div>
          <OptionsField
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
            value={formData.givingsAmount}
          />
          <span className="error-message">{errors.givingsAmount}</span>
        </div>
      </div>
      {loading ? (
        <div className="buttonContainer">
          <span className="loader"></span>
        </div>
      ) : (
        <div className="buttonContainer">
          <button
            onClick={() => {
              setErrors({});
              setFormData(initialState);
            }}
            className="cancel"
          >
            Clear
          </button>
          <button onClick={handleSubmit} className="save">
            Save
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
