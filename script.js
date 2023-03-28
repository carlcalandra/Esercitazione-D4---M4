const baseUrl = "https://striveschool-api.herokuapp.com/books"

let carrello = {};

let books = [];

let cardsContainer = document.querySelector("#cards .row");

const fetchApi = async (url) => {
    const response = await fetch(url);
    return await response.json();
}

const createCard = (book, i) => {
    let colDiv = document.createElement("div");
    let cardDiv = document.createElement("div");
    let cardBody = document.createElement("div");
    let aBook = document.createElement("a");
    aBook.href = "./product.html?asin=" + book.asin;
    let img = document.createElement("img");
    aBook.appendChild(img);
    let buttonDiv = document.createElement("div");
    let buttonHide = document.createElement("button");
    let buttonCart = document.createElement("button");
    cardBody.className = "card-body"
    buttonDiv.className = "text-body-secondary d-flex justify-content-between"
    buttonHide.className = "btn btn-danger";
    buttonHide.innerText = "Hide";
    buttonCart.className = "btn btn-success add-to-cart";
    buttonCart.innerText = "Add to cart"
    buttonHide.onclick = () => hideThis(colDiv);
    buttonCart.onclick = () => addToCart(book, cardDiv);
    cardDiv.className = "card mb-4 p-0 bg-body-tertiary";
    colDiv.className = "col position-relative";
    img.src = book.img;
    img.className = "card-img-top";
    let h6 = document.createElement("h6");
    h6.className = "card-title text-truncate"
    h6.innerText = book.title;
    let p = document.createElement("p");
    p.innerHTML =  `<span>Category: ${book.category}€</span><br>
                    <span>Price: ${book.price}€</span>`
    if (Object.keys(carrello).indexOf(book.asin) !== -1) {
        addBadge(cardDiv, book.asin);
    }
    buttonDiv.append(buttonHide, buttonCart);
    cardBody.append(h6, p, buttonDiv);
    cardDiv.append(aBook, cardBody);
    colDiv.appendChild(cardDiv);
    return colDiv;
}

function hideThis(element){
    element.classList.add("d-none");
}

const removeFromCart = (item) => {
    carrello[item.book.asin].quantity -= 1;
    if (carrello[item.book.asin].quantity === 0){
        delete carrello[item.book.asin];
        let cartBadge = document.getElementById(`cart-badge-${item.book.asin}`);
        cartBadge.remove();
    } 
    createCart();
}

function addBadge(element, asin) {
    let span = document.createElement("span");
    span.id = `cart-badge-${asin}`;
    span.className = "position-absolute cart-badge translate-middle p-3 bg-success  rounded-circle";
    span.innerHTML = `<span class="visually-hidden"><i class="bi bi-cart"></i></span>`
    element.appendChild(span);
}

function addToCart(book, element) {
    if (Object.keys(carrello).indexOf(book.asin) === -1){
        carrello[book.asin] = {
            book:book,
            quantity:1
        }
        addBadge(element, book.asin);
    } else {
        carrello[book.asin].quantity += 1;
    } 
    createCart();
}

const filterArray = (value) => {
    return books.filter(book => book.title.toLowerCase().includes(value.toLowerCase()));
}

const appendCardsToDom = (books) => {
    cardsContainer.innerHTML = "";
    let cardElements = books.map((book, id) => createCard(book, id));
    cardsContainer.append(...cardElements);    
}

{/* <ul class="dropdown-menu dropdown-menu-end">
<li class="d-flex justify-content-end mx-4">Total: <span id="total-amount" class="text-primary ms-2">0€</span></li>
<li>
    <hr class="dropdown-divider">
</li>
<li>
    <hr class="dropdown-divider">
</li>
<li><a class="dropdown-item" href="#">Something else here</a></li>
</ul> */}

const calculateTotal = (cartKeys) => {
    return cartKeys.reduce((acc, key) => {
        acc += carrello[key].quantity * carrello[key].book.price;
        return acc; 
    }, 0)
}

const totalItem = (cartKeys) => {
    return cartKeys.reduce((acc, key) => {
        acc += carrello[key].quantity;
        return acc;
    }, 0)
}

const createCartItem = (item) => {
    const liCartItem = document.createElement("li");
    liCartItem.id = `cart-${item.book.asin}`
    liCartItem.className = "row p-2 g-2";
    const imgCol = document.createElement("div");
    imgCol.className = "col-3";
    const img = document.createElement("img");
    img.src = item.book.img;
    const descCol = document.createElement("div");
    descCol.className = "col-6 d-flex flex-column";
    const h6 = document.createElement("h6");
    h6.className = "text-truncate m-0"
    h6.innerText = item.book.title;
    const pPrice = document.createElement("span");
    pPrice.innerText = `Price: ${item.book.price.toFixed(2)}€`;
    const pQuantity = document.createElement("span");
    pQuantity.innerText = `Quantity: ${item.quantity}`;
    descCol.append(h6, pPrice, pQuantity);
    imgCol.appendChild(img);
    let totalCol = document.createElement("div");
    totalCol.className = "col-3 d-flex flex-column";
    let pTotal = document.createElement("span");
    pTotal.innerText = `Total:${(item.quantity*item.book.price).toFixed(2)}€`;
    let buttonRemove = document.createElement("button");
    buttonRemove.type = "button";
    buttonRemove.className = "btn btn-primary";
    buttonRemove.innerText = "Remove"
    buttonRemove.onclick = () => removeFromCart(item);
    totalCol.append(pTotal, buttonRemove);
    liCartItem.append(imgCol, descCol, totalCol);
    return liCartItem;
}

const emptyCart = () => {
    carrello = {};
    let badges = document.getElementsByClassName("cart-badge");
    while (badges.length > 0) {
        badges[0].remove();
    }
    createCart();
}

const handleFilter = function() {
    if (this.value.length > 2) {
        appendCardsToDom(filterArray(this.value));
    } else {
        appendCardsToDom(books);
    }
};
const createCart = () => {
    let cartKeys = Object.keys(carrello);
    let ulCartDropdownMenu = document.getElementById("cart-dropdown-menu");
    ulCartDropdownMenu.innerHTML = "";
    let liDivider = document.createElement("li");
    liDivider.innerHTML =  `<hr class="dropdown-divider">`
    let liTotal = document.createElement("li");
    liTotal.innerHTML = `<li class="d-flex justify-content-end mx-4">Total: <span id="total-amount" class="text-primary ms-2">${calculateTotal(cartKeys).toFixed(2)}€</span></li>`
    liTotal.className = "d-flex justify-content-end mr-4";
    ulCartDropdownMenu.append(liTotal, liDivider);
    if (cartKeys.length === 0) {
        let liCartEmpty = document.createElement("li");
        liCartEmpty.innerText = "Cart is empty";
        liCartEmpty.className = "text-center"
        ulCartDropdownMenu.appendChild(liCartEmpty);
    } else {
        ulCartDropdownMenu.append(...cartKeys.map(key => createCartItem(carrello[key])));
        ulCartDropdownMenu.appendChild(liDivider);
        let liEmptyButton = document.createElement("li");
        let emptyCartButton = document.createElement("button");
        emptyCartButton.type = "button";
        emptyCartButton.onclick = emptyCart;
        emptyCartButton.className = "btn btn-secondary";
        emptyCartButton.innerText = "Remove all";
        liEmptyButton.className = "d-flex justify-content-center"
        liEmptyButton.appendChild(emptyCartButton);
        ulCartDropdownMenu.appendChild(liEmptyButton);
    }
    let cartCounter = document.getElementById("cart-counter");
    cartCounter.innerText = totalItem(cartKeys);
}

function getCurrentURL () {
    return window.location.href
  }

window.onload = async () => {
    let url = new URL(getCurrentURL())
    if (url.pathname === "/index.html") {
        const filterInput = document.getElementById("filter");
        filterInput.oninput = handleFilter;
        books = await fetchApi(baseUrl);
        appendCardsToDom(books);
        createCart();
    } else if (url.pathname === "/product.html") {
        let asin = url.searchParams.get("asin");
        let book = await fetchApi(`${baseUrl}/${asin}`);
        console.log(book);
        let colPicture = document.createElement("div");
        colPicture.className = "col-12 col-md-6 book-cover d-flex justify-content-center";
        let img = document.createElement("img");
        img.src = book.img;
        let h2 = document.createElement("h2");
        h2.innerText = book.title;
        let spanCategory = document.createElement("span");
        spanCategory.innerHTML = `Category: <strong>${book.category}</strong>`;
        spanCategory.className = "fs-4"
        let spanPrice = document.createElement("span");
        spanPrice.innerHTML = `Price: <strong>${book.price}€</strong>`
        let spanAsin = document.createElement("span");
        spanAsin.innerHTML = `asin: ${book.asin}`
        let flexDiv = document.createElement("div");
        flexDiv.className = "d-flex flex-column justify-content-center col-12 col-md-6";
        let subFlexDiv = document.createElement("div");
        subFlexDiv.style.flexBasis = "50%";
        subFlexDiv.append(h2, spanCategory, spanPrice, spanAsin)
        subFlexDiv.className = "d-flex flex-column justify-content-between"
        let row = document.getElementById("product-detail");
        colPicture.appendChild(img);
        flexDiv.append(subFlexDiv);
        row.append(colPicture, flexDiv);

    }
}