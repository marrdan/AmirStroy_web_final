
const CART_KEY = "amirstroy_cart";
const ORDERS_KEY = "amirstroy_orders";


function formatPrice(number) {
  const text = String(Math.round(number));
  let result = "";
  for (let i = 0; i < text.length; i++) {
    if (i > 0 && (text.length - i) % 3 === 0) {
      result += " ";
    }
    result += text[i];
  }
  return result + " ₸";
}

function getCart() {
  return readList(CART_KEY);
}

function saveCart(cart) {
  writeJSON(CART_KEY, cart);
  updateCartBadge();
  // tell the page that the cart changed, so buttons and counters can repaint
  document.dispatchEvent(new Event("cartchange"));
}

function getOrders() {
  return readList(ORDERS_KEY);
}

function saveOrders(orders) {
  writeJSON(ORDERS_KEY, orders);
}


function countCartItems() {
  const cart = getCart();
  let count = 0;
  for (let i = 0; i < cart.length; i++) {
    count += cart[i].qty;
  }
  return count;
}


function getCartTotal(cart) {
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    total += cart[i].price * cart[i].qty;
  }
  return total;
}

function updateCartBadge() {
  const badge = document.getElementById("cart-count");
  if (!badge) {
    return;
  }
  const count = countCartItems();
  badge.textContent = count;
  badge.hidden = count === 0;
}


function getCartQty(id) {
  const cart = getCart();
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === id) {
      return cart[i].qty;
    }
  }
  return 0;
}

// Returns { message, atMax }: atMax is true when the cart now holds everything that is available
function addToCart(item, amount) {
  const cart = getCart();
  let found = null;
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === item.id) {
      found = cart[i];
    }
  }

  if (found === null) {
    cart.push({
      id: item.id,
      name: item.name,
      price: item.price,
      unit: item.unit,
      max: item.max,
      isService: item.isService,
      qty: 0
    });
    found = cart[cart.length - 1];
  }

  // never put more in the cart than the stock allows
  if (found.qty + amount > found.max) {
    found.qty = found.max;
    saveCart(cart);
    return { message: "Maximum reached: only " + found.max + " available.", atMax: true };
  }

  found.qty += amount;
  saveCart(cart);
  return { message: item.name + " added to the cart.", atMax: found.qty >= found.max };
}

// Message at the bottom of the screen. A warning is shown in red.
function showToast(message, isWarning) {
  let toast = $("#toast");
  if (toast.length === 0) {
    toast = $('<div id="toast" class="toast-message" role="status"></div>');
    $("body").append(toast);
  }
  toast.toggleClass("is-warning", Boolean(isWarning));
  toast.stop(true, true).text(message).fadeIn(200).delay(2200).fadeOut(400);
}

// Small "pop" of the cart counter in the menu, so the visitor sees that the cart changed
function bumpCartBadge() {
  const badge = $("#cart-count");
  badge.removeClass("bump");
  void badge[0]?.offsetWidth;
  badge.addClass("bump");
}

// Shows a short confirmation on a button ("Added"), then restores it
function flashButton(button, text, done) {
  if (button.dataset.flashing === "1") {
    return;
  }
  const original = button.textContent;
  button.dataset.flashing = "1";
  button.textContent = text;
  button.classList.add("is-flash");
  setTimeout(function () {
    button.textContent = original;
    button.classList.remove("is-flash");
    delete button.dataset.flashing;
    if (done) {
      done();
    }
  }, 900);
}
