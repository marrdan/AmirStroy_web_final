const tableBody = document.getElementById("pipe-table-body");
for (let i = 0; i < pipeSizes.length; i++) {
  const pipe = pipeSizes[i];
  const row = document.createElement("tr");
  if (!pipe.inStock) {
    row.className = "is-out";
  }

  const sizeCell = makeEl("th", "", "\u00D8 " + pipe.size + " mm");
  sizeCell.scope = "row";
  row.appendChild(sizeCell);

  row.appendChild(makeEl("td", "nowrap", formatPrice(pipe.perMeter)));

  const stockCell = document.createElement("td");
  if (pipe.inStock) {
    stockCell.appendChild(makeEl("span", "stock", "In stock"));
  } else {
    stockCell.appendChild(makeEl("span", "stock stock-out", "Out"));
  }
  row.appendChild(stockCell);
  tableBody.appendChild(row);
}


const calcForm = document.getElementById("calc-form");
const sizeSelect = document.getElementById("calc-size");
const lengthInput = document.getElementById("calc-length");
const lengthError = document.getElementById("calc-length-error");
const resultBox = document.getElementById("calc-result");
const resultGrid = document.getElementById("calc-grid");
const addButton = document.getElementById("calc-add");

const MAX_METERS = 500;
const START_TEXT = "Choose a size, enter the length and press Calculate.";

let metersToAdd = 0;

for (let i = 0; i < pipeSizes.length; i++) {
  if (pipeSizes[i].inStock) {
    const option = document.createElement("option");
    option.value = pipeSizes[i].size;
    option.textContent = "\u00D8 " + pipeSizes[i].size + " mm";
    sizeSelect.appendChild(option);
  }
}

function findPipe(size) {
  for (let i = 0; i < pipeSizes.length; i++) {
    if (pipeSizes[i].size === size) {
      return pipeSizes[i];
    }
  }
  return null;
}

// The price is simply: price of 1 meter x number of meters (for example 1412 x 6 = 8472)
function calcPrice(meters, perMeter) {
  return perMeter * meters;
}

function resetResult(message) {
  resultBox.textContent = message;
  resultGrid.hidden = true;
  addButton.disabled = true;
  metersToAdd = 0;
}

function showLengthError(message) {
  lengthInput.classList.add("is-invalid");
  lengthInput.setAttribute("aria-invalid", "true");
  lengthError.textContent = message;
  resetResult("Enter a correct length to see the price.");
}

function calculate() {
  const text = lengthInput.value.trim();
  if (text === "") {
    showLengthError("Enter the length in meters.");
    return;
  }
  if (!/^\d+$/.test(text)) {
    showLengthError("Use whole meters, for example 6.");
    return;
  }
  const meters = Number(text);
  if (meters < 1) {
    showLengthError("The length must be at least 1 meter.");
    return;
  }
  if (meters > MAX_METERS) {
    showLengthError("For more than " + MAX_METERS + " m please call us, we will make an offer.");
    return;
  }

  lengthInput.classList.remove("is-invalid");
  lengthInput.removeAttribute("aria-invalid");
  lengthError.textContent = "";

  const pipe = findPipe(Number(sizeSelect.value));
  const total = calcPrice(meters, pipe.perMeter);
  metersToAdd = meters;

  resultBox.textContent = formatPrice(pipe.perMeter) + " \u00D7 " + meters + " m = " + formatPrice(total);
  document.getElementById("out-per").textContent = formatPrice(pipe.perMeter);
  document.getElementById("out-meters").textContent = meters + " m";
  document.getElementById("out-price").textContent = formatPrice(total);
  resultGrid.hidden = false;
  $(resultGrid).stop(true, true).hide().fadeIn(200);
  addButton.disabled = false;
}

// the result updates while typing, and also on the Calculate button or Enter
calcForm.addEventListener("submit", function (event) {
  event.preventDefault();
  calculate();
});
lengthInput.addEventListener("input", function () {
  if (lengthInput.value.trim() === "") {
    lengthInput.classList.remove("is-invalid");
    lengthError.textContent = "";
    resetResult(START_TEXT);
  } else {
    calculate();
  }
});
sizeSelect.addEventListener("change", function () {
  if (lengthInput.value.trim() !== "") {
    calculate();
  }
});

addButton.addEventListener("click", function () {
  if (metersToAdd === 0) {
    return;
  }
  const pipe = findPipe(Number(sizeSelect.value));
  const result = addToCart({
    id: 1000 + pipe.size,
    name: "PPR pipe PN20 \u00D8" + pipe.size + " mm",
    price: pipe.perMeter,
    unit: "m",
    max: MAX_METERS,
    isService: false
  }, metersToAdd);
  showToast(result.message, result.atMax);
  flyToCart(addButton, null);
  flashButton(addButton, "Added \u2713");
});

// FAQ accordion
const accordion = document.getElementById("faq");
for (let i = 0; i < pipeQuestions.length; i++) {
  const item = makeEl("div", "faq-item");

  const button = makeEl("button", "faq-question", pipeQuestions[i].question);
  button.type = "button";
  button.setAttribute("aria-expanded", "false");
  button.id = "faq-button-" + i;
  button.setAttribute("aria-controls", "faq-answer-" + i);

  const answer = makeEl("div", "faq-answer");
  answer.id = "faq-answer-" + i;
  answer.style.display = "none";
  answer.appendChild(makeEl("p", "", pipeQuestions[i].answer));

  item.appendChild(button);
  item.appendChild(answer);
  accordion.appendChild(item);
}

$("#faq").on("click", ".faq-question", function () {
  const button = $(this);
  const answer = button.next(".faq-answer");
  answer.stop(true, true).slideToggle(250, function () {
    button.attr("aria-expanded", answer.is(":visible"));
  });
  button.toggleClass("open");
});
