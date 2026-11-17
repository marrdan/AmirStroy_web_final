# AmirStroy

Plumbing goods shop (Web Technologies 1, Final project). Pure HTML, CSS, Bootstrap 5, JavaScript and jQuery, no backend.

## Pages
`index`, `catalog`, `pipes` (guide and calculator), `services`, `history` (order history), `contacts` (cart and order form), `signup`, `login`, `forgot` (password recovery), `profile`.

## Structure
- `css/style.css`: all styles; light and dark palettes are CSS variables at the top
- `js/theme.js`: light/dark mode, saved in localStorage (loaded in `<head>`)
- `js/storage.js`: safe localStorage helpers (JSON)
- `js/auth.js`: demo accounts (users and session), menu for guest / logged-in user
- `js/forms.js`: shared form checks and errors under the fields
- `js/reviews.js`: visitor ratings and comments for products and services
- `js/product-modal.js`: details window of a product (description, rating, reviews)
- `js/effects.js`: item flying to the cart and the sound (Web Audio, no sound files)
- `js/data.js`: arrays with products, services, pipe sizes and FAQ
- `js/cart.js`: cart, orders, price format, toast message
- `js/cards.js`: creates cards with DOM methods
- `js/main.js`: shared jQuery effects (back to top, smooth scroll)
- `js/<page>.js`: one file per page

## Saved data (localStorage, JSON)
`amirstroy_theme`, `amirstroy_cart`, `amirstroy_orders`, `amirstroy_users`, `amirstroy_session`, `amirstroy_reviews`, `amirstroy_sound`.
Accounts are a demo: passwords are stored in the browser and must not be real. A forgotten password is reset with the security question chosen at sign-up (accounts without one use the phone number).

## Credits
Product photos: Yandex Images. Fonts: Onest and Unbounded (Google Fonts). Bootstrap 5.3.3, jQuery 3.7.1.
AI assistant Claude (Anthropic) helped with the dark mode, accounts and code clean-up.
