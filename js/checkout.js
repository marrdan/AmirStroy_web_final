
const cartList = document.getElementById("cart-list");
const cartBox = document.getElementById("cart-box");
const cartEmpty = document.getElementById("cart-empty");
const cartTotal = document.getElementById("cart-total");
const cartNote = document.getElementById("cart-note");
const cartError = document.getElementById("cart-error");
const clearCartButton = document.getElementById("clear-cart");

function changeQty(id, step) {
  const cart = getCart();
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === id) {
      if (cart[i].qty + step > cart[i].max) {
        showToast("Maximum reached: only " + cart[i].max + " available.", true);
        return;
      }
      if (cart[i].qty + step < 1) {
        return;
      }
      cart[i].qty += step;
    }
  }
  saveCart(cart);
  showCart();
}


function removeItem(id) {
  const cart = getCart();
  const newCart = [];
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id !== id) {
      newCart.push(cart[i]);
    }
  }
  saveCart(newCart);
  showCart();
}

function createCartRow(item) {
  const row = makeEl("li", "cart-row");
  row.setAttribute("data-id", item.id);

  const info = makeEl("div", "cart-info");
  info.appendChild(makeEl("strong", "", item.name));
  let priceText = "Price after inspection";
  if (item.price > 0) {
    priceText = formatPrice(item.price);
    if (item.isService) {
      priceText = "from " + priceText;
    }
  }
  info.appendChild(makeEl("span", "cart-price", priceText));
  const atMax = !item.isService && item.qty >= item.max;
  if (atMax) {
    info.appendChild(makeEl("span", "max-note", "Maximum reached: only " + item.max + " available"));
  }
  row.appendChild(info);

  const controls = makeEl("div", "cart-qty");
  if (!item.isService) {
    const minus = makeEl("button", "qty-btn", "\u2212");
    minus.type = "button";
    minus.setAttribute("aria-label", "One less: " + item.name);
    minus.disabled = item.qty <= 1;
    minus.addEventListener("click", function () { changeQty(item.id, -1); });

    const plus = makeEl("button", "qty-btn", "+");
    plus.type = "button";
    plus.setAttribute("aria-label", "One more: " + item.name);
    plus.disabled = atMax;
    if (atMax) {
      plus.classList.add("is-max");
    }
    plus.addEventListener("click", function () { changeQty(item.id, 1); });

    controls.appendChild(minus);
    controls.appendChild(makeEl("span", atMax ? "qty-number is-max" : "qty-number", String(item.qty)));
    controls.appendChild(plus);
  } else {
    controls.appendChild(makeEl("span", "qty-number", "1 visit"));
  }
  row.appendChild(controls);

  const lineTotal = item.price > 0 ? formatPrice(item.price * item.qty) : "\u2014";
  row.appendChild(makeEl("span", "cart-line", lineTotal));

  const remove = makeEl("button", "remove-btn");
  remove.type = "button";
  remove.innerHTML = TRASH_ICON;
  remove.setAttribute("aria-label", "Remove from cart: " + item.name);
  remove.title = "Remove";
  remove.addEventListener("click", function () {
    // stop(true, true): fast repeated clicks do not break the animation
    $(row).stop(true, true).slideUp(200, function () {
      removeItem(item.id);
      showToast("Removed: " + item.name, false);
    });
  });
  row.appendChild(remove);

  return row;
}

function showCart() {
  const cart = getCart();
  cartList.innerHTML = "";
  cartBox.hidden = cart.length === 0;
  cartEmpty.hidden = cart.length > 0;

  let hasService = false;
  for (let i = 0; i < cart.length; i++) {
    cartList.appendChild(createCartRow(cart[i]));
    if (cart[i].isService) {
      hasService = true;
    }
  }
  cartTotal.textContent = formatPrice(getCartTotal(cart));
  cartNote.hidden = !hasService;

  if (cart.length > 0) {
    cartError.hidden = true;
  }
}

clearCartButton.addEventListener("click", function () {
  $(cartList).stop(true, true).fadeOut(250, function () {
    saveCart([]);
    showCart();
    $(cartList).show();
    showToast("Cart cleared.", false);
  });
});

// ---------- Order form ----------
const form = document.getElementById("order-form");
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const emailInput = document.getElementById("email");
const methodSelect = document.getElementById("method");
const addressInput = document.getElementById("address");
const addressWrap = document.getElementById("address-wrap");
const dateInput = document.getElementById("date");
const noteInput = document.getElementById("note");
const agreeInput = document.getElementById("agree");
const sentBox = document.getElementById("sent");
const sentText = document.getElementById("sent-text");
const prefillNote = document.getElementById("prefill-note");
const loginHint = document.getElementById("login-hint");

// A logged-in visitor does not have to type the details again
function prefillFromAccount() {
  const user = getCurrentUser();
  prefillNote.hidden = user === null;
  loginHint.hidden = user !== null;
  if (user === null) {
    return;
  }
  nameInput.value = user.name;
  phoneInput.value = user.phone;
  emailInput.value = user.email;
}

function twoDigits(number) {
  return number < 10 ? "0" + number : String(number);
}

function dateToText(date) {
  return date.getFullYear() + "-" + twoDigits(date.getMonth() + 1) + "-" + twoDigits(date.getDate());
}

// Order date: from today up to 60 days ahead
const today = new Date();
const lastDay = new Date();
lastDay.setDate(today.getDate() + 60);
dateInput.min = dateToText(today);
dateInput.max = dateToText(lastDay);

// Each check returns an error text or an empty string
function checkName() {
  return nameError(nameInput.value);
}

function checkPhone() {
  return phoneError(phoneInput.value);
}

function checkEmail() {
  return emailError(emailInput.value);
}

function checkMethod() {
  if (methodSelect.value === "") {
    return "Choose how you want to receive the order.";
  }
  return "";
}

function needsAddress() {
  return methodSelect.value === "delivery" || methodSelect.value === "visit";
}

function checkAddress() {
  if (!needsAddress()) {
    return "";
  }
  const value = addressInput.value.trim();
  if (value === "") {
    return "Enter the address.";
  }
  if (value.length < 5) {
    return "The address is too short. Add the street and the house number.";
  }
  return "";
}

function checkDate() {
  const value = dateInput.value;
  if (value === "") {
    return "Choose a date.";
  }
  if (value < dateToText(today)) {
    return "The date cannot be in the past.";
  }
  if (value > dateToText(lastDay)) {
    return "We plan up to 60 days ahead. Choose an earlier date.";
  }
  if (new Date(value + "T00:00:00").getDay() === 0) {
    return "We do not work on Sundays. Choose another day.";
  }
  return "";
}

function checkNote() {
  if (noteInput.value.length > 300) {
    return "The comment is too long. Please use up to 300 characters.";
  }
  return "";
}

function checkAgree() {
  if (!agreeInput.checked) {
    return "Please agree so that we can call you about the order.";
  }
  return "";
}

const fields = [
  { input: nameInput, check: checkName },
  { input: phoneInput, check: checkPhone },
  { input: emailInput, check: checkEmail },
  { input: methodSelect, check: checkMethod },
  { input: addressInput, check: checkAddress },
  { input: dateInput, check: checkDate },
  { input: noteInput, check: checkNote },
  { input: agreeInput, check: checkAgree }
];

watchFields(fields);

// The address field is shown only for delivery and a plumber visit
methodSelect.addEventListener("change", function () {
  if (needsAddress()) {
    $(addressWrap).stop(true, true).slideDown(200);
  } else {
    $(addressWrap).stop(true, true).slideUp(200);
    clearError(addressInput);
  }
});

form.addEventListener("submit", function (event) {
  event.preventDefault();

  let firstBad = validateAll(fields);

  const cart = getCart();
  if (cart.length === 0) {
    cartError.hidden = false;
    if (firstBad === null) {
      firstBad = cartError;
    }
  }

  if (firstBad !== null) {
    if (firstBad === cartError) {
      firstBad.setAttribute("tabindex", "-1");
    }
    firstBad.focus();
    return;
  }

  // Everything is correct: save the order to the history
  const orders = getOrders();
  let hasQuote = false;
  const items = [];
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].price === 0) {
      hasQuote = true;
    }
    items.push({ name: cart[i].name, qty: cart[i].qty, price: cart[i].price, isService: cart[i].isService });
  }
  const order = {
    number: "AS-" + (1001 + orders.length),
    date: new Date().toLocaleDateString("en-GB"),
    items: items,
    total: getCartTotal(cart),
    hasQuote: hasQuote,
    status: "Received"
  };
  orders.push(order);
  saveOrders(orders);
  saveCart([]);

  // Clear the form and show the success message
  form.reset();
  for (let i = 0; i < fields.length; i++) {
    clearError(fields[i].input);
  }
  $(addressWrap).hide();
  prefillFromAccount();
  showCart();

  sentText.textContent = "Order " + order.number + " for " + formatPrice(order.total) +
    " is saved in your order history. We will call you during working hours to confirm availability and price.";
  $(sentBox).stop(true, true).hide().fadeIn(400);
  sentBox.focus();
});

prefillFromAccount();
showCart();
