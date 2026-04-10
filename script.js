// Preloaded 20 items (Indian + popular)
let menu = [
    {id:1, name:"Mini Idli", price:10, discount:0},
    {id:2, name:"Dosa Roll", price:25, discount:5},
    {id:3, name:"Poori", price:20, discount:0},
    {id:4, name:"Lemon Tea", price:15, discount:2},
    {id:5, name:"Coffee", price:20, discount:0},
    {id:6, name:"Samosa", price:10, discount:0},
    {id:7, name:"Veg Fried Rice", price:50, discount:10},
    {id:8, name:"Veg Noodles", price:45, discount:5},
    {id:9, name:"Paneer Roll", price:40, discount:0},
    {id:10, name:"Chocolate Sandwich", price:35, discount:0},
    {id:11, name:"French Fries", price:30, discount:0},
    {id:12, name:"Cheese Burger", price:70, discount:10},
    {id:13, name:"Chicken Burger", price:90, discount:5},
    {id:14, name:"Pasta", price:80, discount:0},
    {id:15, name:"Tiramisu", price:200, discount:10},
    {id:16, name:"Hot Dog", price:60, discount:0},
    {id:17, name:"Cheese Pizza", price:120, discount:15},
    {id:18, name:"Veg Pizza", price:100, discount:10},
    {id:19, name:"Chicken Pizza", price:150, discount:20},
    {id:20, name:"Fried Chicken", price:120, discount:15}
];

let cart = [];
let favourites = [];

window.onload = function() {
    displayMenu();
    displayCart();
    displayFavourites();
    showTopDiscounts();
};

// Display menu table (ID | Name | Price | Order | ❤️)
function displayMenu() {
    const table = document.getElementById('menuTable');
    table.innerHTML = `
        <tr>
            <th>ID</th><th>Name</th><th>Price</th><th>Order</th><th>❤️</th>
        </tr>
    `;
    menu.forEach( (item, i) => {
        table.innerHTML += `
            <tr>
                <td>${item.id}</td>
                <td style="text-align:left;">${item.name}</td>
                <td>₹${item.price}</td>
                <td><button class="add-btn" onclick="addToCart(${i})">Add</button></td>
                <td><button class="add-btn" onclick="addToFavourite(${i})">❤️</button></td>
            </tr>
        `;
    });
}

// Add new item (owner)
function addItem() {
    const id = Number(document.getElementById('itemId').value);
    const name = document.getElementById('itemName').value.trim();
    const price = Number(document.getElementById('itemPrice').value);
    const discount = Number(document.getElementById('itemDiscount').value);

    if (!id || !name || !price || isNaN(discount)) {
        showAlert("Please fill all fields correctly!");
        return;
    }

    menu.push({ id, name, price, discount });
    displayMenu();
    showTopDiscounts();

    // clear inputs
    document.getElementById('itemId').value = '';
    document.getElementById('itemName').value = '';
    document.getElementById('itemPrice').value = '';
    document.getElementById('itemDiscount').value = '';
    showAlert("New item added!");
}

// Add to cart (applies discount if any)
function addToCart(index) {
    let item = Object.assign({}, menu[index]); // shallow copy
    if (item.discount && item.discount > 0) {
        const discAmount = (item.price * item.discount / 100);
        item.price = Math.round(item.price - discAmount);
    }
    cart.push(item);
    displayCart();
    showAlert(item.name + " added to your order!");
}

// Display cart / bill
function displayCart() {
    const tbl = document.getElementById('cartTable');
    let total = 0;
    tbl.innerHTML = `
        <tr><th>Name</th><th>Price</th><th>Remove</th></tr>
    `;
    cart.forEach( (it, idx) => {
        tbl.innerHTML += `
            <tr>
                <td style="text-align:left;">${it.name}</td>
                <td>₹${it.price}</td>
                <td><button class="add-btn" onclick="removeFromCart(${idx})">Remove</button></td>
            </tr>
        `;
        total += Number(it.price);
    });
    document.getElementById('totalBill').innerText = "Total: ₹" + total;
}

function removeFromCart(i) {
    cart.splice(i,1);
    displayCart();
}

function clearCart() {
    cart = [];
    displayCart();
    showAlert("Cart cleared");
}

// Favourites
function addToFavourite(index) {
    const item = menu[index];
    if (!favourites.find(f => f.id === item.id)) {
        favourites.push(item);
        displayFavourites();
        showAlert(item.name + " added to favourites!");
    } else {
        showAlert(item.name + " is already a favourite!");
    }
}
function displayFavourites(){
    const list = document.getElementById('favList');
    list.innerHTML = '';
    favourites.forEach(f => {
        list.innerHTML += `<li>${f.name} - ₹${f.price} (${f.discount}% off)</li>`;
    });
}

// Top discounts (separate box)
function showTopDiscounts() {
    const list = document.getElementById('discountList');
    list.innerHTML = '';
    // show top 5 discounts sorted by discount percent
    const top = menu.filter(m => m.discount > 0).sort((a,b) => b.discount - a.discount).slice(0,5);
    if (top.length === 0) {
        list.innerHTML = '<li>No discounts today</li>';
        return;
    }
    top.forEach(it => {
        list.innerHTML += `<li>${it.name} - ${it.discount}% off</li>`;
    });
}

/* ---------------------------
   ANIME ALERT (with OK) that auto-hides after 1 second
   --------------------------- */
let alertTimeout = null;
function showAlert(text) {
    const box = document.getElementById('animeAlert');
    const txt = document.getElementById('alertText');
    txt.innerText = text;
    box.style.display = 'block';
    box.setAttribute('aria-hidden','false');

    // clear any previous timeout
    if (alertTimeout) clearTimeout(alertTimeout);

    // auto-hide after 1 second
    alertTimeout = setTimeout(()=> {
        hideAlert();
    }, 1000);
}

function hideAlert() {
    const box = document.getElementById('animeAlert');
    box.style.display = 'none';
    box.setAttribute('aria-hidden','true');
    if (alertTimeout) { clearTimeout(alertTimeout); alertTimeout = null; }
}