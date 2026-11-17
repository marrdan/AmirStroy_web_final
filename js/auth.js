// Demo accounts. Everything is stored in this browser only (localStorage), as JSON.
const USERS_KEY = "amirstroy_users";
const SESSION_KEY = "amirstroy_session";

function getUsers() {
  return readList(USERS_KEY);
}

function saveUsers(users) {
  writeJSON(USERS_KEY, users);
}

function findUser(email) {
  const wanted = String(email).trim().toLowerCase();
  const users = getUsers();
  for (let i = 0; i < users.length; i++) {
    if (users[i].email === wanted) {
      return users[i];
    }
  }
  return null;
}

// Password recovery works without a server: the visitor picks a security question at sign-up
const RECOVERY_QUESTIONS = [
  "What was the name of your first pet?",
  "In which city were you born?",
  "What is the name of your favorite book?",
  "What was the name of your first school?"
];

function normalizeAnswer(text) {
  return String(text).trim().toLowerCase().replace(/\s+/g, " ");
}

function normalizePhone(text) {
  return String(text).replace(/[\s\-()+]/g, "").replace(/^8/, "7");
}

// The question to ask and a function that checks the answer.
// Accounts created before the security question existed are checked by the phone number.
function getRecovery(user) {
  if (user.question && user.answer) {
    return {
      question: user.question,
      isCorrect: function (text) { return normalizeAnswer(text) === user.answer; }
    };
  }
  return {
    question: "Enter the phone number you gave when you signed up.",
    isCorrect: function (text) { return normalizePhone(text) === normalizePhone(user.phone); }
  };
}

function setPassword(email, newPassword) {
  const users = getUsers();
  for (let i = 0; i < users.length; i++) {
    if (users[i].email === String(email).trim().toLowerCase()) {
      users[i].password = newPassword;
    }
  }
  saveUsers(users);
}

function startSession(email) {
  writeJSON(SESSION_KEY, { email: String(email).trim().toLowerCase() });
}

function endSession() {
  removeKey(SESSION_KEY);
}

// The logged-in user, or null (also null if the saved session points to a deleted account)
function getCurrentUser() {
  const session = readJSON(SESSION_KEY, null);
  if (session === null || typeof session.email !== "string") {
    return null;
  }
  return findUser(session.email);
}

// The menu shows Log in / Sign up for a guest and Profile / Log out for a logged-in user
function updateNav() {
  const loggedIn = getCurrentUser() !== null;
  const guestItems = document.querySelectorAll(".nav-guest");
  const userItems = document.querySelectorAll(".nav-user");
  for (let i = 0; i < guestItems.length; i++) {
    guestItems[i].hidden = loggedIn;
  }
  for (let i = 0; i < userItems.length; i++) {
    userItems[i].hidden = !loggedIn;
  }
}

const logoutButton = document.getElementById("nav-logout");
if (logoutButton) {
  logoutButton.addEventListener("click", function () {
    endSession();
    location.href = "index.html";
  });
}

updateNav();
