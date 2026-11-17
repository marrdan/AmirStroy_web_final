// Profile page: shows the saved data of the logged-in user.
const guestBox = document.getElementById("profile-guest");
const profileBox = document.getElementById("profile-box");
const user = getCurrentUser();

if (user !== null) {
  guestBox.hidden = true;
  profileBox.hidden = false;
  document.getElementById("profile-name").textContent = user.name;
  document.getElementById("profile-email").textContent = user.email;
  document.getElementById("profile-phone").textContent = user.phone;
  document.getElementById("profile-since").textContent = user.created;
  document.getElementById("profile-orders").textContent = getOrders().length;
  document.getElementById("profile-cart").textContent = countCartItems();

  document.getElementById("profile-logout").addEventListener("click", function () {
    endSession();
    location.href = "index.html";
  });
}
