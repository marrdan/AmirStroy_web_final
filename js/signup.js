// Sign up page: validates the form, stores the new account and logs the visitor in.
if (getCurrentUser() !== null) {
  location.replace("profile.html");
}

const form = document.getElementById("signup-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const passwordInput = document.getElementById("password");
const confirmInput = document.getElementById("confirm");
const questionSelect = document.getElementById("question");
const answerInput = document.getElementById("answer");
const agreeInput = document.getElementById("agree");
const submitButton = document.getElementById("signup-submit");
const successBox = document.getElementById("signup-success");

function checkName() {
  return nameError(nameInput.value);
}

function checkEmail() {
  const message = emailError(emailInput.value);
  if (message !== "") {
    return message;
  }
  if (findUser(emailInput.value) !== null) {
    return "An account with this email already exists. Log in instead.";
  }
  return "";
}

function checkPhone() {
  return phoneError(phoneInput.value);
}

function checkPassword() {
  return passwordError(passwordInput.value);
}

function checkConfirm() {
  if (confirmInput.value === "") {
    return "Repeat the password.";
  }
  if (confirmInput.value !== passwordInput.value) {
    return "The passwords do not match.";
  }
  return "";
}

function checkQuestion() {
  return questionSelect.value === "" ? "Choose a security question." : "";
}

function checkAnswer() {
  const value = normalizeAnswer(answerInput.value);
  if (value === "") {
    return "Write the answer to your question.";
  }
  if (value.length < 2) {
    return "The answer is too short.";
  }
  return "";
}

function checkAgree() {
  if (!agreeInput.checked) {
    return "Please confirm that you understand this is a demo.";
  }
  return "";
}

const fields = [
  { input: nameInput, check: checkName },
  { input: emailInput, check: checkEmail },
  { input: phoneInput, check: checkPhone },
  { input: passwordInput, check: checkPassword },
  { input: confirmInput, check: checkConfirm },
  { input: questionSelect, check: checkQuestion },
  { input: answerInput, check: checkAnswer },
  { input: agreeInput, check: checkAgree }
];

// the questions come from auth.js, so the sign-up and recovery pages use the same list
const firstOption = document.createElement("option");
firstOption.value = "";
firstOption.textContent = "Choose a question";
questionSelect.appendChild(firstOption);
for (let i = 0; i < RECOVERY_QUESTIONS.length; i++) {
  const option = document.createElement("option");
  option.value = RECOVERY_QUESTIONS[i];
  option.textContent = RECOVERY_QUESTIONS[i];
  questionSelect.appendChild(option);
}

watchFields(fields);

// If the password changes, the "repeat" field may become wrong or correct
passwordInput.addEventListener("input", function () {
  if (confirmInput.value !== "") {
    validateField(fields[4]);
  }
});

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const firstBad = validateAll(fields);
  if (firstBad !== null) {
    firstBad.focus();
    return;
  }

  const users = getUsers();
  users.push({
    name: nameInput.value.trim(),
    email: emailInput.value.trim().toLowerCase(),
    phone: phoneInput.value.trim(),
    password: passwordInput.value,
    question: questionSelect.value,
    answer: normalizeAnswer(answerInput.value),
    created: new Date().toLocaleDateString("en-GB")
  });
  saveUsers(users);
  startSession(emailInput.value);

  // the button is disabled so a second click cannot create a second account
  submitButton.disabled = true;
  $(successBox).stop(true, true).hide().fadeIn(300);
  setTimeout(function () {
    location.href = "profile.html";
  }, 1200);
});
