// Visitor reviews (rating and comment) for products and services. Saved in localStorage as JSON.
// A review belongs to an item key such as "product-5" or "service-101".
const REVIEWS_KEY = "amirstroy_reviews";

function getReviews(itemKey) {
  const all = readList(REVIEWS_KEY);
  const result = [];
  for (let i = 0; i < all.length; i++) {
    if (all[i].itemKey === itemKey) {
      result.push(all[i]);
    }
  }
  return result;
}

function reviewStats(itemKey) {
  const list = getReviews(itemKey);
  let sum = 0;
  for (let i = 0; i < list.length; i++) {
    sum += list[i].rating;
  }
  return { count: list.length, average: list.length > 0 ? Math.round(sum / list.length * 10) / 10 : 0 };
}

function reviewLine(itemKey) {
  const stats = reviewStats(itemKey);
  if (stats.count === 0) {
    return "No visitor reviews yet";
  }
  return "Visitor rating: " + stats.average + " (" + stats.count + (stats.count === 1 ? " review)" : " reviews)");
}

// Cards on the page show a short line with the rating; update all of them after a change
function refreshReviewLines() {
  const lines = document.querySelectorAll("[data-review-key]");
  for (let i = 0; i < lines.length; i++) {
    lines[i].textContent = reviewLine(lines[i].dataset.reviewKey);
  }
}

const REVIEWS_TEMPLATE = `
  <h3>Reviews</h3>
  <p class="review-summary" id="review-summary"></p>
  <ul class="review-list" id="review-list"></ul>
  <form id="review-form" novalidate>
    <h4 class="review-form-title">Leave a review</h4>
    <div class="mb-3">
      <label class="form-label" for="review-name">Your name</label>
      <input class="form-control" id="review-name" type="text" autocomplete="name" aria-describedby="review-name-error">
      <div class="invalid-feedback" id="review-name-error"></div>
    </div>
    <fieldset class="rating-input mb-1" id="review-rating" tabindex="-1" aria-describedby="review-rating-error">
      <legend class="form-label">Your rating</legend>
      <div class="star-row">
        <input class="visually-hidden" type="radio" name="rate" id="rate-5" value="5"><label for="rate-5"><span class="visually-hidden">5 stars</span></label>
        <input class="visually-hidden" type="radio" name="rate" id="rate-4" value="4"><label for="rate-4"><span class="visually-hidden">4 stars</span></label>
        <input class="visually-hidden" type="radio" name="rate" id="rate-3" value="3"><label for="rate-3"><span class="visually-hidden">3 stars</span></label>
        <input class="visually-hidden" type="radio" name="rate" id="rate-2" value="2"><label for="rate-2"><span class="visually-hidden">2 stars</span></label>
        <input class="visually-hidden" type="radio" name="rate" id="rate-1" value="1"><label for="rate-1"><span class="visually-hidden">1 star</span></label>
      </div>
    </fieldset>
    <div class="invalid-feedback mb-2" id="review-rating-error"></div>
    <div class="mb-3">
      <label class="form-label" for="review-text">Comment</label>
      <textarea class="form-control" id="review-text" rows="3" aria-describedby="review-text-error"></textarea>
      <div class="invalid-feedback" id="review-text-error"></div>
    </div>
    <div class="sent panel" id="review-success" role="status" style="display:none">
      <p class="mb-0"><strong>Thank you!</strong> Your review is saved.</p>
    </div>
    <button class="btn btn-main" type="submit">Send review</button>
  </form>`;

// Builds the reviews block inside a container (a page has only one such block).
// options: getExtra() returns extra data saved with a review; describe(review) returns extra text
// for the review header; onChange() is called after a review is added or deleted.
function setupReviews(container, options) {
  container.innerHTML = REVIEWS_TEMPLATE;
  const list = container.querySelector("#review-list");
  const summary = container.querySelector("#review-summary");
  const form = container.querySelector("#review-form");
  const nameInput = container.querySelector("#review-name");
  const ratingInput = container.querySelector("#review-rating");
  const textInput = container.querySelector("#review-text");
  const success = container.querySelector("#review-success");
  let currentKey = null;

  function render() {
    const items = getReviews(currentKey);
    list.innerHTML = "";
    summary.textContent = reviewLine(currentKey) + ".";
    if (items.length === 0) {
      list.appendChild(makeEl("li", "review-empty", "No reviews yet. Be the first to rate this."));
      return;
    }
    for (let i = items.length - 1; i >= 0; i--) {
      const review = items[i];
      const item = makeEl("li", "review");
      const head = makeEl("div", "review-head");
      head.appendChild(makeEl("strong", "", review.name));
      let meta = review.date;
      if (options.describe) {
        meta += ", " + options.describe(review);
      }
      head.appendChild(makeEl("span", "review-meta", meta));
      item.appendChild(head);
      item.appendChild(makeRating(review.rating));
      item.appendChild(makeEl("p", "review-text", review.text));

      const remove = makeEl("button", "remove-btn");
      remove.type = "button";
      remove.innerHTML = TRASH_ICON;
      remove.title = "Delete this review";
      remove.setAttribute("aria-label", "Delete the review by " + review.name);
      remove.addEventListener("click", function () {
        deleteReview(review.id);
      });
      item.appendChild(remove);
      list.appendChild(item);
    }
  }

  function changed() {
    render();
    refreshReviewLines();
    if (options.onChange) {
      options.onChange();
    }
  }

  function deleteReview(id) {
    const all = readList(REVIEWS_KEY);
    const kept = [];
    for (let i = 0; i < all.length; i++) {
      if (all[i].id !== id) {
        kept.push(all[i]);
      }
    }
    writeJSON(REVIEWS_KEY, kept);
    showToast("Review deleted.", false);
    changed();
  }

  function checkName() {
    return nameError(nameInput.value);
  }

  function checkRating() {
    return form.querySelector('input[name="rate"]:checked') === null ? "Choose a rating from 1 to 5 stars." : "";
  }

  function checkText() {
    const value = textInput.value.trim();
    if (value === "") {
      return "Write a short comment.";
    }
    if (value.length < 5) {
      return "The comment is too short. Write at least 5 characters.";
    }
    if (value.length > 300) {
      return "The comment is too long. Please use up to 300 characters.";
    }
    return "";
  }

  const fields = [
    { input: nameInput, check: checkName },
    { input: ratingInput, check: checkRating },
    { input: textInput, check: checkText }
  ];
  watchFields(fields);

  function resetForm() {
    form.reset();
    for (let i = 0; i < fields.length; i++) {
      clearError(fields[i].input);
    }
    success.style.display = "none";
    const user = getCurrentUser();
    if (user !== null) {
      nameInput.value = user.name;
    }
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const firstBad = validateAll(fields);
    if (firstBad !== null) {
      firstBad.focus();
      return;
    }

    const review = {
      id: Date.now(),
      itemKey: currentKey,
      name: nameInput.value.trim(),
      rating: Number(form.querySelector('input[name="rate"]:checked').value),
      text: textInput.value.trim(),
      date: new Date().toLocaleDateString("en-GB")
    };
    if (options.getExtra) {
      Object.assign(review, options.getExtra());
    }
    const all = readList(REVIEWS_KEY);
    all.push(review);
    writeJSON(REVIEWS_KEY, all);

    const keepName = nameInput.value;
    resetForm();
    nameInput.value = keepName;
    $(success).stop(true, true).hide().fadeIn(300);
    changed();
  });

  return {
    // shows the reviews of one item with an empty form
    show: function (itemKey) {
      currentKey = itemKey;
      resetForm();
      render();
    },
    render: render
  };
}
