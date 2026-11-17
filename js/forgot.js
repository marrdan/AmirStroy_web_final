// Forgot password page: find the account, answer the security question, set a new password.
const findForm = document.getElementById("find-form");
const resetForm = document.getElementById("reset-form");
const findEmail = document.getElementById("find-email");
const resetEmail = document.getElementById("reset-email");
const resetQuestion = document.getElementById("reset-question");
const answerInput = document.getElementById("reset-answer");
const newPassword = document.getElementById("reset-password");
const confirmPassword = document.getElementById("reset-confirm");
const resetButton = document.getElementById("reset-submit");
const backButton = document.getElementById("reset-back");
const successBox = document.getElementById("reset-success");

let accountUser = null;
let recovery = null;

const findFields = [{ input: findEmail, check: function () { return emailError(findEmail.value); } }];

const resetFields = [
  {
    input: answerInput,
    check: function () {
      if (answerInput.value.trim() === "") {
        return "Write your answer.";
      }
      return recovery.isCorrect(answerInput.value) ? "" : "The answer is wrong. Try again.";
    }
  },
  { input: newPassword, check: function () { return passwordError(newPassword.value); } },
  {
    input: confirmPassword,
    check: function () {
      if (confirmPassword.value === "") {
        return "Repeat the new password.";
      }
      return confirmPassword.value === newPassword.value ? "" : "The passwords do not match.";
    }
  }
];

watchFields(findFields);
watchFields(resetFields);

newPassword.addEventListener("input", function () {
  if (confirmPassword.value !== "") {
    validateField(resetFields[2]);
  }
});

// step 1: find the account
findForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const firstBad = validateAll(findFields);
  if (firstBad !== null) {
    firstBad.focus();
    return;
  }
  const user = findUser(findEmail.value);
  if (user === null) {
    showError(findEmail, "There is no account with this email. Check it or sign up.");
    findEmail.focus();
    return;
  }

  accountUser = user;
  recovery = getRecovery(user);
  resetEmail.textContent = user.email;
  resetQuestion.textContent = recovery.question;
  findForm.hidden = true;
  $(resetForm).stop(true, true).hide().prop("hidden", false).fadeIn(250);
  answerInput.focus();
});

// go back to step 1
backButton.addEventListener("click", function () {
  resetForm.reset();
  for (let i = 0; i < resetFields.length; i++) {
    clearError(resetFields[i].input);
  }
  accountUser = null;
  resetForm.hidden = true;
  findForm.hidden = false;
  findEmail.focus();
});

// step 2: check the answer and save the new password
resetForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const firstBad = validateAll(resetFields);
  if (firstBad !== null) {
    firstBad.focus();
    return;
  }

  setPassword(accountUser.email, newPassword.value);
  resetButton.disabled = true;
  resetForm.hidden = true;
  $(successBox).stop(true, true).hide().fadeIn(300);
  setTimeout(function () {
    location.href = "login.html";
  }, 1800);
});
