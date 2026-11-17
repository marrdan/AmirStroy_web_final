// Services page: cards with a plumber choice, a details window with reviews, booking to the cart.
const serviceGrid = document.getElementById("service-grid");
const cards = {};            // service id -> { render }
let modalService = null;
let modalPlumberId = null;

// ---------- data helpers ----------
function getPlumber(id) {
  for (let i = 0; i < plumbers.length; i++) {
    if (plumbers[i].id === id) {
      return plumbers[i];
    }
  }
  return plumbers[0];
}

// The plumber's factor changes the price; services priced after inspection stay at 0
function plumberPrice(service, plumber) {
  if (service.price === 0) {
    return 0;
  }
  return Math.round(service.price * plumber.factor / 100) * 100;
}

function priceLabel(price) {
  return price > 0 ? "from " + formatPrice(price) : "Price after inspection";
}

// The same service with another plumber is a different cart item
function cartIdFor(service, plumber) {
  return "svc" + service.id + "-" + plumber.id;
}

function isInCart(id) {
  const cart = getCart();
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === id) {
      return true;
    }
  }
  return false;
}

// ---------- booking ----------
function bookService(service, plumber, button) {
  const result = addToCart({
    id: cartIdFor(service, plumber),
    name: "Plumber: " + service.name + " (" + plumber.name + ")",
    price: plumberPrice(service, plumber),
    unit: "visit",
    max: 1,
    isService: true
  }, 1);
  showToast(result.message, false);
  flyToCart(button, null);
  flashButton(button, "Added \u2713", refreshAll);
}

function refreshAll() {
  for (const id in cards) {
    cards[id].render();
  }
  if (modalService !== null) {
    renderModalState();
  }
}

// ---------- cards ----------
function createServiceCard(service) {
  const col = makeEl("div", "col-12 col-md-6 col-lg-4");
  const card = makeEl("article", "card product service-card");
  const body = makeEl("div", "card-body");

  body.appendChild(makeEl("h3", "product-name", service.name));
  body.appendChild(makeEl("p", "product-meta", service.text));

  const selectId = "plumber-" + service.id;
  const label = makeEl("label", "form-label small mb-0", "Plumber");
  label.htmlFor = selectId;
  const select = makeEl("select", "form-select form-select-sm");
  select.id = selectId;
  for (let i = 0; i < plumbers.length; i++) {
    const option = document.createElement("option");
    option.value = plumbers[i].id;
    option.textContent = plumbers[i].name + " \u00B7 " + plumbers[i].rating + " \u2605";
    select.appendChild(option);
  }
  select.value = "aleksey";

  const ratingBox = document.createElement("div");
  const reviewsText = makeEl("p", "review-line");
  reviewsText.dataset.reviewKey = "service-" + service.id;

  const buy = makeEl("div", "buy");
  const price = makeEl("p", "price price-quote");
  const bookButton = makeEl("button", "btn btn-main", "Book a plumber");
  bookButton.type = "button";
  const detailsButton = makeEl("button", "btn btn-ghost", "Details and reviews");
  detailsButton.type = "button";
  detailsButton.setAttribute("aria-label", "Details and reviews: " + service.name);
  buy.appendChild(price);
  buy.appendChild(bookButton);
  buy.appendChild(detailsButton);

  body.appendChild(label);
  body.appendChild(select);
  body.appendChild(ratingBox);
  body.appendChild(reviewsText);
  body.appendChild(buy);
  card.appendChild(body);
  col.appendChild(card);

  // draws everything that depends on the chosen plumber and on the cart
  function render() {
    const plumber = getPlumber(select.value);
    ratingBox.innerHTML = "";
    ratingBox.appendChild(makeRating(plumber.rating));
    reviewsText.textContent = reviewLine("service-" + service.id);
    price.textContent = priceLabel(plumberPrice(service, plumber));
    price.classList.toggle("price-quote", plumberPrice(service, plumber) === 0);
    if (isInCart(cartIdFor(service, plumber))) {
      bookButton.className = "btn btn-max";
      bookButton.textContent = "In cart";
      bookButton.disabled = true;
    } else {
      bookButton.className = "btn btn-main";
      bookButton.textContent = "Book a plumber";
      bookButton.disabled = false;
    }
    bookButton.setAttribute("aria-label", "Book " + plumber.name + ": " + service.name);
  }

  select.addEventListener("change", render);
  bookButton.addEventListener("click", function () {
    bookService(service, getPlumber(select.value), bookButton);
  });
  detailsButton.addEventListener("click", function () {
    openModal(service, select.value, card);
  });
  // a click on the empty part of the card opens the details too
  card.addEventListener("click", function (event) {
    if (!event.target.closest("button, select, label")) {
      openModal(service, select.value, card);
    }
  });

  cards[service.id] = { render: render, select: select };
  render();
  return col;
}

// ---------- details window ----------
const modalElement = document.getElementById("service-modal");
const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
const modalBook = document.getElementById("modal-book");
const plumberBox = document.getElementById("modal-plumbers");

function openModal(service, plumberId, card) {
  modalService = service;
  modalPlumberId = plumberId;
  card.classList.add("is-picked");

  document.getElementById("service-modal-title").textContent = service.name;
  document.getElementById("modal-text").textContent = service.details;
  document.getElementById("modal-time").textContent = "Usual time: " + service.time + ".";

  const includes = document.getElementById("modal-includes");
  includes.innerHTML = "";
  for (let i = 0; i < service.includes.length; i++) {
    includes.appendChild(makeEl("li", "", service.includes[i]));
  }

  // one radio button per plumber, with price, rating and hourly rate
  plumberBox.innerHTML = "";
  for (let i = 0; i < plumbers.length; i++) {
    const plumber = plumbers[i];
    const option = makeEl("label", "plumber-option");
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "modal-plumber";
    radio.value = plumber.id;
    radio.className = "visually-hidden";
    radio.checked = plumber.id === plumberId;
    radio.addEventListener("change", function () {
      modalPlumberId = plumber.id;
      cards[service.id].select.value = plumber.id;
      refreshAll();
    });
    option.appendChild(radio);
    option.appendChild(makeEl("strong", "", plumber.name));
    option.appendChild(makeEl("span", "plumber-rating", "\u2605 " + plumber.rating));
    option.appendChild(makeEl("span", "", priceLabel(plumberPrice(service, plumber))));
    option.appendChild(makeEl("span", "plumber-note", formatPrice(plumber.hourly) + " per hour"));
    plumberBox.appendChild(option);
  }

  reviews.show("service-" + service.id);
  renderModalState();
  modal.show();
}

modalElement.addEventListener("hidden.bs.modal", function () {
  for (const id in cards) {
    cards[id].select.closest(".card").classList.remove("is-picked");
  }
  modalService = null;
});

// price, booking button and reviews of the opened service
function renderModalState() {
  const plumber = getPlumber(modalPlumberId);
  const price = plumberPrice(modalService, plumber);
  document.getElementById("modal-price").textContent = priceLabel(price);
  if (isInCart(cartIdFor(modalService, plumber))) {
    modalBook.className = "btn btn-max";
    modalBook.textContent = "In cart";
    modalBook.disabled = true;
  } else {
    modalBook.className = "btn btn-main";
    modalBook.textContent = "Book " + plumber.name;
    modalBook.disabled = false;
  }
}

modalBook.addEventListener("click", function () {
  bookService(modalService, getPlumber(modalPlumberId), modalBook);
});

// ---------- reviews ----------
const reviews = setupReviews(document.getElementById("modal-reviews"), {
  getExtra: function () { return { plumberId: modalPlumberId }; },
  describe: function (review) { return "plumber " + getPlumber(review.plumberId).name; }
});

// ---------- start ----------
for (let i = 0; i < services.length; i++) {
  serviceGrid.appendChild(createServiceCard(services[i]));
}

// people who prefer less motion get a still picture of the plumber
const scene = document.getElementById("work-scene");
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches && scene.pauseAnimations) {
  scene.pauseAnimations();
  scene.setCurrentTime(2);
}
