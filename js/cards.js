function makeEl(tag, className, text) {
  const el = document.createElement(tag);
  if (className) {
    el.className = className;
  }
  if (text !== undefined) {
    el.textContent = text;
  }
  return el;
}


function makeRating(rating) {
  const p = makeEl("p", "rating");
  const stars = makeEl("span", "stars");
  stars.style.setProperty("--rating", rating);
  stars.setAttribute("role", "img");
  stars.setAttribute("aria-label", "Rated " + rating + " out of 5");
  p.appendChild(stars);
  const number = makeEl("span", "", String(rating));
  number.setAttribute("aria-hidden", "true");
  p.appendChild(number);
  return p;
}


function getStockText(product) {
  if (product.stock === 0) {
    return "Out of stock";
  }
  if (product.stock <= 3) {
    return product.stock + " left";
  }
  return "In stock";
}


// Draws an "Add to cart" button and the "In cart: N of M" line from what the cart really holds.
// Used by the product card and by the details window.
function paintAddButton(product, button, line, justAdded) {
  const inCart = getCartQty(product.id);
  const atMax = inCart >= product.stock;
  line.hidden = inCart === 0;
  line.classList.toggle("is-max", atMax);
  line.textContent = (atMax ? "Maximum in cart: " : "In cart: ") + inCart + " of " + product.stock;
  if (atMax) {
    button.className = "btn btn-max add-btn";
    button.textContent = "Max in cart";
    button.disabled = true;
    return;
  }
  button.disabled = false;
  button.className = justAdded ? "btn btn-main add-btn is-flash" : "btn btn-main add-btn";
  if (justAdded) {
    button.textContent = "Added \u2713";
  } else {
    button.textContent = product.unit === "m" ? "Add 1 m to cart" : "Add to cart";
  }
}

function addProductToCart(product, button, repaint) {
  const result = addToCart({
    id: product.id,
    name: product.name,
    price: product.price,
    unit: product.unit,
    max: product.stock,
    isService: false
  }, 1);
  showToast(result.message, result.atMax);
  flyToCart(button, product.image);
  repaint(true);
  clearTimeout(button.flashTimer);
  button.flashTimer = setTimeout(function () { repaint(false); }, 900);
}

function createProductCard(product, columnClass) {
  const col = makeEl("div", columnClass);
  if (product.stock === 0) {
    col.classList.add("is-out");
  }

  const card = makeEl("article", "card product");

 
  const photo = makeEl("div", "photo");
  photo.appendChild(makeEl("span", "photo-code", product.code));
  photo.appendChild(makeEl("span", "photo-note", "photo soon"));
  const img = document.createElement("img");
  img.src = product.image;
  img.alt = product.name;
  img.loading = "lazy";
  
  img.addEventListener("error", function () {
    img.hidden = true; 
  });
  photo.appendChild(img);
  card.appendChild(photo);

  const body = makeEl("div", "card-body");

  let stockClass = "stock";
  if (product.stock === 0) {
    stockClass += " stock-out";
  } else if (product.stock <= 3) {
    stockClass += " stock-few";
  }
  body.appendChild(makeEl("p", stockClass, getStockText(product)));
  const title = makeEl("h3", "product-name");
  const nameButton = makeEl("button", "name-link", product.name);
  nameButton.type = "button";
  nameButton.setAttribute("aria-label", "Details and reviews: " + product.name);
  title.appendChild(nameButton);
  body.appendChild(title);
  body.appendChild(makeEl("p", "product-meta", product.note));
  body.appendChild(makeRating(product.rating));

  const reviewsLine = makeEl("p", "review-line");
  reviewsLine.dataset.reviewKey = "product-" + product.id;
  reviewsLine.textContent = reviewLine("product-" + product.id);
  body.appendChild(reviewsLine);

  // "In cart: 3 of 10"; turns red when the maximum is reached
  const inCartLine = makeEl("p", "in-cart");
  inCartLine.hidden = true;
  body.appendChild(inCartLine);

  const buy = makeEl("div", "buy");
  let priceText = formatPrice(product.price);
  if (product.unit === "m") {
    priceText += "/m";
  }
  buy.appendChild(makeEl("p", "price", priceText));

  const button = makeEl("button", "btn btn-main add-btn");
  button.type = "button";
  if (product.stock === 0) {
    button.className = "btn btn-ghost";
    button.textContent = "Out of stock";
    button.disabled = true;
  } else {
    button.setAttribute("aria-label", "Add to cart: " + product.name);
    const repaint = function (justAdded) {
      paintAddButton(product, button, inCartLine, justAdded);
    };
    button.addEventListener("click", function () {
      addProductToCart(product, button, repaint);
    });
    // the cart can also change in the details window; stop listening when the card is removed
    const onCartChange = function () {
      if (!card.isConnected) {
        document.removeEventListener("cartchange", onCartChange);
        return;
      }
      repaint(false);
    };
    document.addEventListener("cartchange", onCartChange);
    repaint(false);
  }
  buy.appendChild(button);
  body.appendChild(buy);

  card.appendChild(body);
  col.appendChild(card);

  // a click on the name or on the empty part of the card opens the details window
  const openDetails = function () {
    openProductModal(product, card);
  };
  nameButton.addEventListener("click", openDetails);
  card.addEventListener("click", function (event) {
    if (!event.target.closest("button, a, select, label")) {
      openDetails();
    }
  });
  return col;
}

// Trash can icon (static markup, no user data inside)
const TRASH_ICON = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">' +
  '<path fill="currentColor" fill-rule="evenodd" d="M9 3h6l1 2h4v2H4V5h4l1-2zM6 9h12l-1 11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 9zm3.5 2v8H11v-8H9.5zm3.5 0v8h1.5v-8H13z"/></svg>';
