import React, { useState } from "react";
import "./NationalIDForm.css"; // Import the CSS file

function NationalIDForm() {
  const [formData, setFormData] = useState({
    surname: "",
    name: "",
    middleName: "",
    sex: "",
    dateOfBirth: "",
    height: "",
    personalIDNumber: "",
    dateOfExpiry: "",
  });

  const [errors, setErrors] = useState({
    surname: "",
    name: "",
    middleName: "",
    height: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let error = "";

    // Validation rules
    const lettersOnly = /^[A-Za-z]+$/; 
    const floatOnly = /^\d*(\.\d+)?$/; 

    switch (name) {
      case "surname":
      case "name":
      case "middleName":
        if (value && !lettersOnly.test(value)) {
          error = `${name.replace(/([A-Z])/g, " $1")} should contain only letters.`;
        }
        break;
      case "height":
        if (value && !floatOnly.test(value)) {
          error = "Height should be a valid floating-point number (e.g., 1.75).";
        }
        break;
      default:
        break;
    }

    // Set error and update form data
    setErrors({ ...errors, [name]: error });
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check for any validation errors
    const hasErrors = Object.values(errors).some((error) => error);
    if (!hasErrors) {
      console.log("Form data submitted:", formData);
    } else {
      alert("Please fix the errors in the form before submitting.");
    }
  };

  return (
    <form onSubmit={handleSubmit} class="qcel">
      <h2 class="cell">National ID Form</h2>

      <div className="form-row">
        <label>Surname:</label>
        <input
          type="text"
          name="surname"
          value={formData.surname}
          onChange={handleChange}
          required
        />
        {errors.surname && <p className="error">{errors.surname}</p>}
      </div>

      <div className="form-row">
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        {errors.name && <p className="error">{errors.name}</p>}
      </div>

      <div className="form-row">
        <label>Middle Name:</label>
        <input
          type="text"
          name="middleName"
          value={formData.middleName}
          onChange={handleChange}
        />
        {errors.middleName && <p className="error">{errors.middleName}</p>}
      </div>

      <div className="form-row">
        <label>Sex:</label>
        <select
          name="sex"
          value={formData.sex}
          onChange={handleChange}
          required
        >
          <option value="">Select</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
        </select>
      </div>

      <div className="form-row">
        <label>Date of Birth:</label>
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-row">
        <label>Height (m):</label>
        <input
          type="number"
          name="height"
          step="0.01"
          value={formData.height}
          onChange={handleChange}
          required
        />
        {errors.height && <p className="error">{errors.height}</p>}
      </div>

      <div className="form-row">
        <label>Personal ID Number:</label>
        <input
          type="text"
          name="personalIDNumber"
          value={formData.personalIDNumber}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-row">
        <label>Date of Expiry:</label>
        <input
          type="date"
          name="dateOfExpiry"
          value={formData.dateOfExpiry}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}

export default NationalIDForm;
