// Log in page: checks the saved accounts and redirects to the profile.
if (getCurrentUser() !== null) {
  location.replace("profile.html");
}

const form = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const submitButton = document.getElementById("login-submit");
const successBox = document.getElementById("login-success");

function checkEmail() {
  return emailError(emailInput.value);
}

function checkPassword() {
  return passwordInput.value === "" ? "Enter your password." : "";
}

const fields = [
  { input: emailInput, check: checkEmail },
  { input: passwordInput, check: checkPassword }
];

watchFields(fields);

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const firstBad = validateAll(fields);
  if (firstBad !== null) {
    firstBad.focus();
    return;
  }

  // one message for both cases, so it does not reveal which emails exist
  const user = findUser(emailInput.value);
  if (user === null || user.password !== passwordInput.value) {
    showError(passwordInput, "Wrong email or password. Check them or create an account.");
    passwordInput.focus();
    return;
  }

  startSession(user.email);
  submitButton.disabled = true;
  $(successBox).stop(true, true).hide().fadeIn(300);
  setTimeout(function () {
    location.href = "profile.html";
  }, 800);
});
