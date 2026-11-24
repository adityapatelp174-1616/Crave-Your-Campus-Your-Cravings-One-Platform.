/* CRAVE CAMPUS - SINGLE JAVASCRIPT FILE. Sections are labelled for easy editing. */
/* ==========================================================================
   AUTHENTICATION FORMS: login, registration, password visibility and reset.
   These are frontend demonstrations; no credentials are stored or transmitted.
   ========================================================================== */

// EXPLANATION: This loop finds every Show/Hide password button and changes its related input between password and text.
// Toggle visibility for the password field belonging to the button's own form.
document.querySelectorAll("[data-toggle]").forEach(button => {
  button.addEventListener("click", () => {
    const form = button.closest("form");
    const input = form ? form.querySelector("#" + button.dataset.toggle) : null;
    if (!input) return;
    const reveal = input.type === "password";
    input.type = reveal ? "text" : "password";
    button.textContent = reveal ? "Hide" : "Show";
  });
});
// Display validation or demo-status messages inside the form currently being used.

// EXPLANATION: Reusable helper: puts a success or error message inside the form passed to this function.
function showMessage(form, message, type) {
  const box = form.querySelector(".message");
  if (!box) return;
  box.textContent = message;
  box.className = "message " + type;
}
// Gmail-only address validation used by the three account forms.

// EXPLANATION: Checks that the entered address uses the Gmail domain; this is a front-end rule, not account verification.
function validGmail(value) { return /^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(value.trim()); }

// LOGIN: validates the Gmail address and password, then explains backend sign-in is not connected.

// EXPLANATION: LOGIN: obtain the login form so its submit event can validate the entered details.
const loginForm = document.getElementById("login-form");
if (loginForm) loginForm.addEventListener("submit", event => {
  event.preventDefault();
  const email = loginForm.querySelector("#email").value.trim();
  const password = loginForm.querySelector("#password").value;
  if (!validGmail(email)) return showMessage(loginForm, "Please enter a valid Gmail address ending in @gmail.com.", "error");
  if (!password) return showMessage(loginForm, "Please enter your password.", "error");
  showMessage(loginForm, "Frontend demo only: connect a secure authentication service to sign in. No credentials were sent or stored.", "success");
});

// REGISTRATION: checks required details, mobile format, Gmail, password strength and terms acceptance.

// EXPLANATION: REGISTER: obtain the registration form before checking each required field.
const registerForm = document.getElementById("register-form");
if (registerForm) registerForm.addEventListener("submit", event => {
  event.preventDefault();
  const name = registerForm.querySelector("#fullname").value.trim();
  const mobile = registerForm.querySelector("#mobile").value.replace(/[\s()-]/g, "");
  const email = registerForm.querySelector("#email").value.trim();
  const password = registerForm.querySelector("#password").value;
  const confirm = registerForm.querySelector("#confirm-password").value;
  if (!name || !mobile || !email || !password || !confirm) return showMessage(registerForm, "Please complete every required field.", "error");
  if (!/^\+?[0-9]{10,13}$/.test(mobile)) return showMessage(registerForm, "Enter a valid mobile number (10–13 digits, with optional country code).", "error");
  if (!validGmail(email)) return showMessage(registerForm, "Please use a valid Gmail address ending in @gmail.com.", "error");
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(password)) return showMessage(registerForm, "Use at least 8 characters with uppercase, lowercase, a number and a symbol.", "error");
  if (password !== confirm) return showMessage(registerForm, "Your passwords do not match. Please check and try again.", "error");
  if (!registerForm.querySelector("#terms").checked) return showMessage(registerForm, "Please accept the terms and conditions to continue.", "error");
  showMessage(registerForm, "Your details passed frontend validation. Account creation needs a secure backend; no account has been created yet.", "success");
});

// PASSWORD RESET: validates the email and explains that a backend is needed to send a real reset link.

// EXPLANATION: FORGOT PASSWORD: obtain the reset form; a real email reset requires a server.
const forgotForm = document.getElementById("forgot-form");
if (forgotForm) forgotForm.addEventListener("submit", event => {
  event.preventDefault();
  const email = forgotForm.querySelector("#email").value.trim();
  if (!validGmail(email)) return showMessage(forgotForm, "Enter the Gmail address linked to your account.", "error");
  showMessage(forgotForm, "This page is ready for backend integration. A real reset email cannot be sent until an authentication service is connected.", "success");
});

/* ==========================================================================
   HELP CENTRE: FAQ accordions, issue shortcuts and support-form validation.
   ========================================================================== */

// EXPLANATION: FAQ ACCORDION: clicking a question opens or closes its answer panel.
document.querySelectorAll(".faq-question").forEach(button => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const open = item.classList.toggle("open");
    button.setAttribute("aria-expanded", String(open));
  });
});

// EXPLANATION: HELP TOPICS: clicking an issue shortcut selects/highlights the matching topic.
document.querySelectorAll(".problem-chip").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".problem-chip").forEach(chip => chip.classList.remove("active"));
    button.classList.add("active");
    document.getElementById("support-category").value = button.dataset.problem;
    document.getElementById("support-subject").focus();
    document.querySelector(".support-panel").scrollIntoView({behavior:"smooth",block:"center"});
  });
});

// EXPLANATION: SUPPORT FORM: checks the submitted help request and shows a local confirmation message.
document.getElementById("support-form").addEventListener("submit", event => {
  event.preventDefault();
  const name = document.getElementById("support-name").value.trim();
  const email = document.getElementById("support-email").value.trim();
  const category = document.getElementById("support-category").value;
  const subject = document.getElementById("support-subject").value.trim();
  const description = document.getElementById("support-description").value.trim();
  const box = document.getElementById("support-message");
  const fail = message => { box.textContent = message; box.className = "message error"; };
  if (!name || !email || !category || !subject || !description) return fail("Please complete all fields before submitting.");
  if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(email)) return fail("Please enter a valid Gmail address ending in @gmail.com.");
  box.textContent = "Thanks, " + name + ". Your request passed the form checks. This demo does not send or store support tickets until a backend is connected.";
  box.className = "message success";
  event.target.reset();
  document.querySelectorAll(".problem-chip").forEach(chip => chip.classList.remove("active"));
});

/* ==========================================================================
   FOOD ORDERING: original restaurant/menu data, category filters, search,
   vendor menus, cart quantities, delivery details and demo checkout.
   The original ordering implementation is retained below.
   ========================================================================== */
// CRAVE CAMPUS - Simple JavaScript for restaurant search and cart.

// Each restaurant has its own menu.
// There are 6 restaurants and 5 dishes in each menu = 30 food items.
// Each local vendor has its own menu. Prices are sample campus prices.

// EXPLANATION: RESTAURANT DATA: each object stores one vendor and its menu items, prices, categories and images.
const restaurants = [
    {
        id: 1, name: "Dosa Junction", rating: 4.3, time: "15-25 min",
        type: "South Indian", image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80",
        menu: [
            { id: 101, name: "Masala Dosa", category: "Indian", price: 120, image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80", description: "Crispy dosa filled with potato masala." },
            { id: 102, name: "Mysore Masala Dosa", category: "Indian", price: 150, image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80", description: "Spiced Mysore chutney with potato filling." },
            { id: 103, name: "Idli Sambar", category: "Indian", price: 80, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80", description: "Soft idlis served with sambar." },
            { id: 104, name: "Medu Vada", category: "Snacks", price: 90, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80", description: "Crispy lentil fritters." },
            { id: 105, name: "Onion Uttapam", category: "Indian", price: 110, image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80", description: "Soft uttapam topped with onions." },
            { id: 106, name: "Filter Coffee", category: "Drinks", price: 40, image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&auto=format&fit=crop&q=80", description: "Traditional South Indian filter coffee." },
        ]
    },
    {
        id: 2, name: "Punjabi Tadka", rating: 4.4, time: "15-25 min",
        type: "North Indian", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80",
        menu: [
            { id: 201, name: "Shahi Paneer", category: "Indian", price: 180, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80", description: "Paneer in a rich creamy gravy." },
            { id: 202, name: "Dal Makhani", category: "Indian", price: 160, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80", description: "Slow-cooked black lentils." },
            { id: 203, name: "Chole Bhature", category: "Indian", price: 120, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80", description: "Spiced chickpeas with fluffy bhature." },
            { id: 204, name: "Butter Naan", category: "Indian", price: 40, image: "https://images.unsplash.com/photo-1600628422019-6b1b7c6c3f9b?w=600&auto=format&fit=crop&q=80", description: "Soft naan brushed with butter." },
            { id: 205, name: "Paneer Tikka", category: "Indian", price: 200, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80", description: "Marinated paneer grilled with spices." },
            { id: 206, name: "Sweet Lassi", category: "Drinks", price: 60, image: "https://images.unsplash.com/photo-1513558161293-cdaf765edfd4?w=600&auto=format&fit=crop&q=80", description: "Chilled sweet yoghurt drink." },
        ]
    },
    {
        id: 3, name: "Oven Express", rating: 4.5, time: "15-25 min",
        type: "Chinese", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80",
        menu: [
            { id: 301, name: "Veg Hakka Noodles", category: "Chinese", price: 130, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80", description: "Stir-fried noodles with vegetables." },
            { id: 302, name: "Veg Fried Rice", category: "Chinese", price: 120, image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80", description: "Fried rice with mixed vegetables." },
            { id: 303, name: "Veg Manchurian", category: "Chinese", price: 150, image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80", description: "Vegetable balls in Manchurian sauce." },
            { id: 304, name: "Spring Rolls", category: "Snacks", price: 100, image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80", description: "Crispy rolls with vegetable filling." },
            { id: 305, name: "Chilli Paneer", category: "Chinese", price: 180, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80", description: "Paneer tossed in spicy chilli sauce." },
            { id: 306, name: "Lemon Iced Tea", category: "Drinks", price: 60, image: "https://images.unsplash.com/photo-1513558161293-cdaf765edfd4?w=600&auto=format&fit=crop&q=80", description: "Refreshing lemon iced tea." },
        ]
    },
    {
        id: 4, name: "Burger Hub", rating: 4.6, time: "15-25 min",
        type: "Fast Food", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
        menu: [
            { id: 401, name: "Cheese Burger", category: "Burger", price: 120, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80", description: "Burger with a melted cheese slice." },
            { id: 402, name: "Veg Loaded Pizza", category: "Pizza", price: 180, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80", description: "Pizza loaded with vegetables and cheese." },
            { id: 403, name: "French Fries", category: "Snacks", price: 80, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80", description: "Golden crispy potato fries." },
            { id: 404, name: "Grilled Sandwich", category: "Snacks", price: 100, image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80", description: "Grilled sandwich with vegetable filling." },
            { id: 405, name: "Paneer Wrap", category: "Snacks", price: 130, image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80", description: "Spiced paneer wrapped in a soft roll." },
            { id: 406, name: "Cold Coffee", category: "Drinks", price: 90, image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&auto=format&fit=crop&q=80", description: "Chilled creamy coffee." },
        ]
    },
    {
        id: 5, name: "Jain Rasoi", rating: 4.7, time: "15-25 min",
        type: "Jain Food", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80",
        menu: [
            { id: 501, name: "Jain Shahi Paneer", category: "Jain", price: 180, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80", description: "Jain-style paneer in a creamy gravy." },
            { id: 502, name: "Jain Dal Tadka", category: "Jain", price: 140, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80", description: "Comforting Jain-style yellow dal." },
            { id: 503, name: "Jain Veg Pulao", category: "Jain", price: 130, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80", description: "Mildly spiced vegetable pulao." },
            { id: 504, name: "Jain Aloo Jeera", category: "Jain", price: 120, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80", description: "Potatoes tossed with cumin." },
            { id: 505, name: "Jain Masala Khichdi", category: "Jain", price: 140, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80", description: "Comforting rice and lentil khichdi." },
            { id: 506, name: "Jaljeera", category: "Drinks", price: 40, image: "https://images.unsplash.com/photo-1513558161293-cdaf765edfd4?w=600&auto=format&fit=crop&q=80", description: "Tangy and refreshing jaljeera." },
        ]
    },
    {
        id: 6, name: "Sweet Cravings", rating: 4.2, time: "15-25 min",
        type: "Sweets & Cafe", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80",
        menu: [
            { id: 601, name: "Gulab Jamun", category: "Dessert", price: 60, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80", description: "Soft sweet dumplings in sugar syrup." },
            { id: 602, name: "Rasmalai", category: "Dessert", price: 80, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80", description: "Soft chenna patties in creamy milk." },
            { id: 603, name: "Chocolate Brownie", category: "Dessert", price: 100, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80", description: "Rich chocolate brownie." },
            { id: 604, name: "Red Velvet Pastry", category: "Dessert", price: 90, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80", description: "Soft red velvet cake pastry." },
            { id: 605, name: "Kaju Katli", category: "Dessert", price: 120, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80", description: "Classic cashew sweet." },
            { id: 606, name: "Cappuccino", category: "Drinks", price: 100, image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&auto=format&fit=crop&q=80", description: "Espresso with steamed milk foam." },
            { id: 607, name: "Hot Chocolate", category: "Drinks", price: 120, image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&auto=format&fit=crop&q=80", description: "Warm chocolate drink." },
            { id: 608, name: "Oreo Milkshake", category: "Drinks", price: 130, image: "https://images.unsplash.com/photo-1513558161293-cdaf765edfd4?w=600&auto=format&fit=crop&q=80", description: "Creamy cookies-and-cream shake." },
            { id: 609, name: "Strawberry Shake", category: "Drinks", price: 120, image: "https://images.unsplash.com/photo-1513558161293-cdaf765edfd4?w=600&auto=format&fit=crop&q=80", description: "Chilled strawberry milkshake." },
        ]
    },
];

// Current category, selected restaurant and cart.

// EXPLANATION: STATE: remembers the selected category, currently open vendor and items in the cart.
let selectedCategory = "All";
let selectedRestaurant = null;
let cart = [];

// Get HTML elements that JavaScript needs to update.

// EXPLANATION: DOM REFERENCES: cache the page elements that JavaScript will update repeatedly.
const contentArea = document.getElementById("content-area");
const searchBox = document.getElementById("search-box");
const cartModal = document.getElementById("cart-modal");

// Show restaurants matching the current search and category.

// EXPLANATION: VENDOR LIST: filters vendors by search text/category and renders the matching vendor cards.
function showRestaurants() {
    selectedRestaurant = null;
    document.getElementById("page-title").textContent = "Local food vendors";
    document.getElementById("page-description").textContent =
        "Choose a local vendor to explore its menu.";
    document.getElementById("back-button").style.display = "none";
    contentArea.className = "restaurant-grid";

    const searchText = searchBox.value.toLowerCase();

    // Keep restaurants that have at least one matching dish.
    const matchingRestaurants = restaurants.filter(function(restaurant) {
        return restaurant.menu.some(function(food) {
            const matchesName = food.name.toLowerCase().includes(searchText);
            const matchesCategory = selectedCategory === "All" ||
                                    food.category === selectedCategory;
            return matchesName && matchesCategory;
        });
    });

    contentArea.innerHTML = "";

    matchingRestaurants.forEach(function(restaurant) {
        const matchingCount = restaurant.menu.filter(function(food) {
            const matchesName = food.name.toLowerCase().includes(searchText);
            const matchesCategory = selectedCategory === "All" ||
                                    food.category === selectedCategory;
            return matchesName && matchesCategory;
        }).length;

        const card = document.createElement("div");
        card.className = "restaurant-card";
        card.innerHTML = `
            <img src="${restaurant.image}" alt="${restaurant.name}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&auto=format&fit=crop&q=80';">
            <div class="restaurant-info">
                <h3>${restaurant.name}</h3>
                <p>${restaurant.type}</p>
                <div class="restaurant-meta">
                    <span class="rating">★ ${restaurant.rating}</span>
                    <span>🕒 ${restaurant.time}</span>
                </div>
                <p>${matchingCount} matching dish(es)</p>
                <button class="view-menu-button" onclick="openRestaurant(${restaurant.id})">
                    View vendor menu →
                </button>
            </div>
        `;
        contentArea.appendChild(card);
    });

    showNoResults(matchingRestaurants.length);
}

// Open one restaurant and display only its menu.

// EXPLANATION: OPEN VENDOR: finds a vendor by ID, stores the selection and switches the catalogue to its menu.
function openRestaurant(restaurantId) {
    selectedRestaurant = restaurants.find(function(restaurant) {
        return restaurant.id === restaurantId;
    });

    // Clear the search so the customer can see the restaurant's full menu.
    searchBox.value = "";
    selectedCategory = "All";
    document.querySelectorAll(".category").forEach(function(button) {
        button.classList.toggle("active", button.dataset.category === "All");
    });

    document.getElementById("page-title").textContent = selectedRestaurant.name;
    document.getElementById("page-description").textContent =
        "★ " + selectedRestaurant.rating + " rating  |  " +
        selectedRestaurant.time + " delivery";
    document.getElementById("back-button").style.display = "inline-block";

    displayMenu();
}

// Display dishes from the selected restaurant.

// EXPLANATION: MENU RENDERING: creates the food cards for the currently selected vendor.
function displayMenu() {
    contentArea.className = "restaurant-grid";
    contentArea.innerHTML = "";

    // Filter this restaurant's menu using category and search text.
    const searchText = searchBox.value.toLowerCase();
    const menuItems = selectedRestaurant.menu.filter(function(food) {
        const matchesName = food.name.toLowerCase().includes(searchText);
        const matchesCategory = selectedCategory === "All" ||
                                food.category === selectedCategory;
        return matchesName && matchesCategory;
    });

    menuItems.forEach(function(food) {
        const card = document.createElement("div");
        card.className = "food-card";
        card.innerHTML = `
            <img src="${food.image}" alt="${food.name}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&auto=format&fit=crop&q=80';">
            <div class="food-info">
                <h3>${food.name}</h3>
                <p>${food.description}</p>
                <div class="food-bottom">
                    <strong>₹${food.price}</strong>
                    <button class="add-button" onclick="addToCart(${food.id})">Add +</button>
                </div>
            </div>
        `;
        contentArea.appendChild(card);
    });

    showNoResults(menuItems.length);
}

// Show or hide the no results message.

// EXPLANATION: EMPTY STATE: shows or hides the no-results message based on the number of matches.
function showNoResults(numberOfResults) {
    document.getElementById("no-results").style.display =
        numberOfResults === 0 ? "block" : "none";
}

// Search as the user types.
searchBox.addEventListener("input", function() {
    if (selectedRestaurant === null) {
        showRestaurants();
    } else {
        displayMenu();
    }
});

// Category filter buttons.
document.querySelectorAll(".category").forEach(function(button) {
    button.addEventListener("click", function() {
        document.querySelectorAll(".category").forEach(function(item) {
            item.classList.remove("active");
        });

        button.classList.add("active");
        selectedCategory = button.dataset.category;

        if (selectedRestaurant === null) {
            showRestaurants();
        } else {
            displayMenu();
        }
    });
});

// Return to the vendor list.
document.getElementById("back-button").addEventListener("click", showRestaurants);

// Add a dish to the cart.

// EXPLANATION: ADD TO CART: finds a dish and adds it to the active cart, keeping the cart tied to its vendor.
function addToCart(foodId) {
    const food = selectedRestaurant.menu.find(function(item) {
        return item.id === foodId;
    });

    // For this beginner project, one cart can contain food from one restaurant.
    if (cart.length > 0 && cart[0].restaurantId !== selectedRestaurant.id) {
        alert("Your cart already has items from another restaurant. Place that order or clear the cart first.");
        return;
    }

    const existingItem = cart.find(function(item) {
        return item.id === foodId;
    });

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...food,
            quantity: 1,
            restaurantId: selectedRestaurant.id,
            restaurantName: selectedRestaurant.name
        });
    }

    updateCart();
}

// Change dish quantity. If it reaches zero, remove the dish.

// EXPLANATION: QUANTITY: increases/decreases a cart item's count and removes it when the count reaches zero.
function changeQuantity(foodId, amount) {
    const item = cart.find(function(food) {
        return food.id === foodId;
    });

    if (!item) return;
    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(function(food) {
            return food.id !== foodId;
        });
    }

    updateCart();
}

// Update cart items, item count and total price.

// EXPLANATION: CART DISPLAY: rebuilds cart rows, item count, total price and checkout button state.
function updateCart() {
    const cartItems = document.getElementById("cart-items");
    let total = 0;
    let itemCount = 0;

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
        document.getElementById("cart-restaurant").textContent = "";
    } else {
        document.getElementById("cart-restaurant").textContent =
            "Order from: " + cart[0].restaurantName;
    }

    cart.forEach(function(item) {
        total += item.price * item.quantity;
        itemCount += item.quantity;

        const row = document.createElement("div");
        row.className = "cart-row";
        row.innerHTML = `
            <div>
                <strong>${item.name}</strong>
                <p>₹${item.price} each</p>
            </div>
            <div>
                <button class="quantity-button" onclick="changeQuantity(${item.id}, -1)">−</button>
                ${item.quantity}
                <button class="quantity-button" onclick="changeQuantity(${item.id}, 1)">+</button>
            </div>
        `;
        cartItems.appendChild(row);
    });

    document.getElementById("cart-count").textContent = itemCount;
    document.getElementById("cart-total").textContent = "₹" + total;
    document.getElementById("place-order").disabled = cart.length === 0;
}

// Open and close the cart popup.

// EXPLANATION: CART OPEN: displays the cart dialog when the cart button is clicked.
document.getElementById("cart-button").addEventListener("click", function() {
    cartModal.classList.add("show");
});


// EXPLANATION: CART CLOSE: hides the dialog when its close button is clicked.
document.getElementById("close-cart").addEventListener("click", function() {
    cartModal.classList.remove("show");
});

// Close popup if the dark background is clicked.
cartModal.addEventListener("click", function(event) {
    if (event.target === cartModal) {
        cartModal.classList.remove("show");
    }
});

// Demo order button. It does not connect to a real payment system.

// EXPLANATION: DEMO CHECKOUT: validates delivery fields, shows a demo confirmation and clears the cart.
document.getElementById("place-order").addEventListener("click", function() {
    if (cart.length === 0) {
        return;
    }

    // Check that the student has entered all delivery details.
    const blockName = document.getElementById("block-name");
    const floorName = document.getElementById("floor-name");
    const registrationId = document.getElementById("registration-id");

    if (!blockName.value.trim() || !floorName.value.trim() ||
        !/^[0-9]{8}$/.test(registrationId.value)) {
        alert("Please enter your block, floor/room and an 8-digit registration ID.");
        if (!blockName.value.trim()) {
            blockName.focus();
        } else if (!floorName.value.trim()) {
            floorName.focus();
        } else {
            registrationId.focus();
        }
        return;
    }

    alert("Your demo order from " + cart[0].restaurantName +
        " has been placed! Delivery location: " + blockName.value +
        ", " + floorName.value + ".");
    cart = [];
    updateCart();
    cartModal.classList.remove("show");
});

// Display restaurants when the website first opens.
showRestaurants();
updateCart();




// Small UX improvements layered onto the original ordering flow.
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && cartModal) cartModal.classList.remove("show");
});


/* ==========================================================================
   SINGLE-PAGE NAVIGATION: switches between Home, Login, Register, Forgot
   Password and Help without requiring separate HTML documents.
   ========================================================================== */
(function () {
  const pageIds = ["page-home", "page-login", "page-register", "page-forgot", "page-help"];

// EXPLANATION: PAGE ROUTER: reads the URL hash and shows exactly one of the five page sections.
  function showPage() {
    const requested = window.location.hash.replace("#", "");
    const targetId = pageIds.includes(requested) ? requested : "page-home";
    document.querySelectorAll(".page-view").forEach(page => {
      page.classList.toggle("active", page.id === targetId);
    });
    const activePage = document.getElementById(targetId);
    if (activePage) document.title = activePage.dataset.pageTitle || "Crave Campus";
    // Scroll to the top only when switching between full-page screens; normal section anchors keep their native scroll position.
    if (pageIds.includes(requested)) window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", showPage);
  showPage();
})();
