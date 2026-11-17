// Product details window: photo, description, rating, reviews and the "Add to cart" button.
// The window is built once, the first time a card is opened.
let productModalElement = null;
let productModal = null;
let productReviews = null;
let shownProduct = null;
let shownCard = null;

const PRODUCT_MODAL_TEMPLATE = `
  <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
    <div class="modal-content service-modal">
      <div class="modal-header">
        <h2 class="modal-title" id="product-modal-title"></h2>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="product-detail">
          <div class="product-detail-photo"><img id="pm-image" alt=""></div>
          <div class="product-detail-info">
            <p class="stock" id="pm-stock"></p>
            <p id="pm-description"></p>
            <ul class="include-list" id="pm-specs"></ul>
            <div id="pm-rating"></div>
            <p class="review-line" id="pm-review-line"></p>
          </div>
        </div>
        <div class="modal-buy">
          <p class="price" id="pm-price"></p>
          <button class="btn btn-main add-btn" type="button" id="pm-add">Add to cart</button>
        </div>
        <p class="in-cart text-center" id="pm-incart" hidden></p>
        <hr>
        <div id="product-reviews"></div>
      </div>
    </div>
  </div>`;

function buildProductModal() {
  productModalElement = document.createElement("div");
  productModalElement.className = "modal fade";
  productModalElement.id = "product-modal";
  productModalElement.tabIndex = -1;
  productModalElement.setAttribute("aria-labelledby", "product-modal-title");
  productModalElement.setAttribute("aria-hidden", "true");
  productModalElement.innerHTML = PRODUCT_MODAL_TEMPLATE;
  document.body.appendChild(productModalElement);

  productModal = bootstrap.Modal.getOrCreateInstance(productModalElement);
  productReviews = setupReviews(document.getElementById("product-reviews"), {});

  const addButton = document.getElementById("pm-add");
  addButton.addEventListener("click", function () {
    addProductToCart(shownProduct, addButton, paintModalButton);
  });
  document.addEventListener("cartchange", function () {
    if (shownProduct !== null) {
      paintModalButton(false);
    }
  });

  productModalElement.addEventListener("hidden.bs.modal", function () {
    if (shownCard !== null) {
      shownCard.classList.remove("is-picked");
    }
    shownProduct = null;
    shownCard = null;
  });
}

function paintModalButton(justAdded) {
  const button = document.getElementById("pm-add");
  const line = document.getElementById("pm-incart");
  if (shownProduct.stock === 0) {
    button.className = "btn btn-ghost add-btn";
    button.textContent = "Out of stock";
    button.disabled = true;
    line.hidden = true;
    return;
  }
  paintAddButton(shownProduct, button, line, justAdded);
}

function openProductModal(product, card) {
  if (productModalElement === null) {
    buildProductModal();
  }
  shownProduct = product;
  shownCard = card;
  card.classList.add("is-picked");

  document.getElementById("product-modal-title").textContent = product.name;
  document.getElementById("pm-description").textContent = product.description;

  const image = document.getElementById("pm-image");
  image.hidden = false;
  image.alt = product.name;
  image.onerror = function () { image.hidden = true; };
  image.src = product.image;

  const stock = document.getElementById("pm-stock");
  stock.textContent = getStockText(product);
  stock.className = product.stock === 0 ? "stock stock-out" : (product.stock <= 3 ? "stock stock-few" : "stock");

  const specs = document.getElementById("pm-specs");
  specs.innerHTML = "";
  const facts = [
    "Code: " + product.code,
    "Category: " + categoryNames[product.category],
    "Sold per: " + (product.unit === "m" ? "meter" : "piece"),
    "In stock: " + product.stock
  ];
  for (let i = 0; i < facts.length; i++) {
    specs.appendChild(makeEl("li", "", facts[i]));
  }

  const ratingBox = document.getElementById("pm-rating");
  ratingBox.innerHTML = "";
  ratingBox.appendChild(makeRating(product.rating));
  const reviewsLine = document.getElementById("pm-review-line");
  reviewsLine.dataset.reviewKey = "product-" + product.id;
  reviewsLine.textContent = reviewLine("product-" + product.id);

  document.getElementById("pm-price").textContent = formatPrice(product.price) + (product.unit === "m" ? "/m" : "");
  paintModalButton(false);
  productReviews.show("product-" + product.id);
  productModal.show();
}
