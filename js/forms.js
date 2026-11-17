// Shared form helpers: field checks, errors under the fields, live validation.
// Every check returns an error text, or an empty string when the value is correct.

function nameError(raw) {
  const value = raw.trim();
  if (value === "") {
    return "Tell us how to address you.";
  }
  if (value.length < 2) {
    return "The name must have at least 2 letters.";
  }
  if (!/^[A-Za-z\u0400-\u04FF\u0492\u0493\u049A\u049B\u04A2\u04A3\u04B0\u04B1\u04E8\u04E9\u04BA\u04BB\u04D8\u04D9\u0406\u0456\u04AE\u04AF\s'-]+$/.test(value)) {
    return "The name can contain only letters.";
  }
  return "";
}

function phoneError(raw) {
  const value = raw.trim();
  if (value === "") {
    return "Enter a phone number so we can call you.";
  }
  const digits = value.replace(/[\s\-()]/g, "");
  if (!/^(\+7|8|7)\d{10}$/.test(digits)) {
    return "Enter a phone number like +7 700 000 00 00.";
  }
  return "";
}

function emailError(raw) {
  const value = raw.trim();
  if (value === "") {
    return "Enter your email.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "Enter an email like name@example.com.";
  }
  return "";
}

function passwordError(value) {
  if (value === "") {
    return "Create a password.";
  }
  if (value.length < 8) {
    return "Use at least 8 characters.";
  }
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) {
    return "Use at least one letter and one digit.";
  }
  return "";
}

function showError(input, message) {
  input.classList.add("is-invalid");
  input.setAttribute("aria-invalid", "true");
  document.getElementById(input.id + "-error").textContent = message;
}

function clearError(input) {
  input.classList.remove("is-invalid");
  input.removeAttribute("aria-invalid");
  document.getElementById(input.id + "-error").textContent = "";
}

// field = { input, check }. Returns true if the field is correct.
function validateField(field) {
  const message = field.check();
  if (message === "") {
    clearError(field.input);
    return true;
  }
  showError(field.input, message);
  return false;
}

// Checks every field (so all errors are shown) and returns the first wrong input, or null
function validateAll(fields) {
  let firstBad = null;
  for (let i = 0; i < fields.length; i++) {
    if (!validateField(fields[i]) && firstBad === null) {
      firstBad = fields[i].input;
    }
  }
  return firstBad;
}

// While there is no error the field is left alone. Once an error is shown the field is checked on
// every key press, so the error disappears as soon as it is fixed. Leaving a filled field also checks it.
function watchFields(fields) {
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    const eventName = (field.input.type === "checkbox" || field.input.tagName === "SELECT") ? "change" : "input";
    field.input.addEventListener(eventName, function () {
      if (field.input.classList.contains("is-invalid")) {
        validateField(field);
      }
    });
    field.input.addEventListener("blur", function () {
      if (field.input.value !== "" && field.input.type !== "checkbox") {
        validateField(field);
      }
    });
  }
}
