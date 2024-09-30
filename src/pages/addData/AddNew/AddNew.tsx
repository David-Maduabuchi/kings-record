import {
  ChangeEvent,
  useEffect,
  useState,
  FormEvent,
  useRef,
  KeyboardEvent,
} from "react";
import "./AddNew.scss";
import LoadingBar from "@/components/LoadingBar/LoadingBar";
import InputField from "@/components/inputField/InputField";
import OptionsField from "@/components/optionsField/OptionField";
import axios from "axios";
import { useLocation } from "react-router-dom";
import * as ACTIONS from "../../../store/actions/action_types";
import Toast from "@/components/toast/Toast";
import { formatPhoneNumber, smoothScrollTo } from "@/interface/functions";
import { useDispatch } from "react-redux";
import { format } from "date-fns";

interface Partnership {
  type: string;
  amount: string;
}

interface Givings {
  type: string;
  amount: string;
}

interface FormDataToSend {
  title: string;
  firstName: string;
  lastName: string;
  Date: string;
  birthDate: string;
  email: string;
  phoneNumber: string;
  partnerships?: Partnership[]; // Optional, as it may be omitted
  givings?: Givings[]; // Optional, as it may be omitted
}

const initialState = {
  title: "",
  firstName: "",
  lastName: "",
  Date: "",
  birthDate: "",
  email: "",
  phoneNumber: "",
  partnershipsType: "",
  partnershipAmount: "",
  givingsType: "",
  givingsAmount: "",
};
const AddNew = () => {
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
  const newErrors: { [key: string]: string } = {};
  const validateField = () => {
    if (!formData.firstName)
      newErrors.firstName = "Adam named all things, yet this field has none";
    if (!formData.title) newErrors.title = "No title provided";
    if (!formData.lastName)
      newErrors.lastName = "The lineage matters - provide a surname";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "We need a valid email to fellowship.";
    if (!formData.phoneNumber)
      newErrors.phoneNumber = "Please provide a number.";
    if (!formData.birthDate)
      newErrors.birthDate = "When was this new soul born?";
    if (formData.phoneNumber.length < 11) {
      newErrors.phoneNumber = "Please provide a valid phone number";
    }
    if (parseInt(formData.partnershipAmount) < 0) {
      newErrors.partnershipAmount = "Amount cannot be less than Zero";
    }
    if (parseInt(formData.givingsAmount) < 0)
      newErrors.givingsAmount = "Amount cannot be less than Zero";

    // Check if Date is required based on partnerships or givings
    const isPartnershipValid =
      formData.partnershipsType && formData.partnershipAmount;
    const isGivingsValid = formData.givingsType && formData.givingsAmount;

    // If either partnership or givings is valid, enforce the Date field
    if ((isPartnershipValid || isGivingsValid) && !formData.Date) {
      newErrors.Date = "Date is required for partnership or givings.";
    }

    return newErrors;
  };

  const handleSubmit = async (
    event: KeyboardEvent<HTMLInputElement> | FormEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    const form = formRef.current;

    if (form === null) return; // Guard to ensure formRef.current is not null

    const firstInvalidField = form.querySelector(
      ":invalid"
    ) as HTMLElement | null;

    if (firstInvalidField) {
      smoothScrollTo(firstInvalidField, 500); // Slow scroll
      firstInvalidField.focus();
    }

    const validationErrors = validateField();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);

      const formDataToSend: FormDataToSend = {
        title: formData.title,
        firstName: formData.firstName,
        lastName: formData.lastName,
        Date: formData.Date ? format(formData.Date, "yyyy-MM-dd") : "",
        email: formData.email.toLowerCase(),
        phoneNumber: formatPhoneNumber(formData.phoneNumber),
        birthDate: formData.birthDate
          ? format(formData.birthDate, "yyyy-MM-dd")
          : "",
      };

      // Conditionally add partnerships and givings
      if (formData.partnershipsType && formData.partnershipAmount) {
        formDataToSend.partnerships = [
          {
            type: formData.partnershipsType,
            amount: formData.partnershipAmount,
          },
        ];
      }

      if (formData.givingsType && formData.givingsAmount) {
        formDataToSend.givings = [
          {
            type: formData.givingsType,
            amount: formData.givingsAmount,
          },
        ];
      }

      // Proceed with API call
      axios
        .post(
          "https://kingsrecordbackend-production.up.railway.app/api/v1/add-member",
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${localStorage
                .getItem("userToken")
                ?.toString()}`,
              "Content-Type": "application/json",
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
        .catch((err) => {
          setLoading(false);
          if (
            err.response.data.error ===
            "Member is already stored in the database"
          ) {
            newErrors.email = err.response.data.error;
            validateField();
            console.log(errors);
          }
          setToastType("error");
          console.log(err);
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
      <header>Add New Member</header>
      <form ref={formRef} className="inputFieldContainer">
        <section className="row">
          <div>
            <InputField
              type="text"
              name="title"
              required
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
              onChange={handleChange}
              value={formData.lastName}
            />
            <span className="error-message ">{errors.lastName}</span>
          </div>

          <div>
            <InputField
              type="email"
              name="email"
              label="Email"
              placeholder="e.g example@gmail.com"
              required
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit(e);
              }}
              onChange={handleChange}
              value={formData.email}
            />
            <span className="error-message">{errors.email}</span>
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
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit(e);
              }}
              maxLength={11}
              onChange={handleChange}
              value={formatPhoneNumber(formData.phoneNumber)}
            />
            <span className="error-message">{errors.phoneNumber}</span>
          </div>

          <div>
            <InputField
              type="date"
              name="birthDate"
              max={today}
              label="Birth Date"
              required
              onChange={handleChange}
              value={formData.birthDate}
            />
            <span className="error-message">{errors.birthDate}</span>
          </div>
        </section>
      </form>

      <section className="optionsFieldSection">
        <div className="optionsFieldContainer">
          <h5 className="font-bold">Partnership Arms</h5>

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

        {/* Givings Type Section */}
        <div className="optionsFieldContainer">
          <h5 className="font-bold">Givings Type</h5>
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
          name="Date"
          max={today}
          label="Date of Giving/Partnership"
          onChange={handleChange}
          value={formData.Date}
        />
        <span className="error-message red-color">{errors.Date}</span>
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

export default AddNew;
