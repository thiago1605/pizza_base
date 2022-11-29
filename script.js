const select = (e) => document.querySelector(e),
  selectAll = (e) => document.querySelectorAll(e);

let modalQt = 1,
  modalKey = 0,
  cart = [];

pizzaJson.map((pizza, id) => {
  const pizzaItem = select(".models .pizza-item").cloneNode(true);
  //get ID -----------------------------------
  pizzaItem.setAttribute("data-key", id);
  //------------------------------------------
  pizzaItem.querySelector(".pizza-item--img img").src = pizza.img;
  pizzaItem.querySelector(".pizza-item--name").textContent = pizza.name;
  pizzaItem.querySelector(".pizza-item--desc").textContent = pizza.description;
  pizzaItem.querySelector(
    ".pizza-item--price"
  ).textContent = `R$ ${pizza.price.toFixed(2)}`;

  pizzaItem.querySelector("a").addEventListener("click", (e) => {
    e.preventDefault();
    const key = e.target.closest(".pizza-item").getAttribute("data-key");

    modalQt = 1;
    modalKey = key;

    select(".pizzaBig > img").src = pizzaJson[key].img;
    select(".pizzaInfo > h1").textContent = pizzaJson[key].name;
    select(".pizzaInfo--desc").textContent = pizzaJson[key].description;
    select(".pizzaInfo--actualPrice").textContent = `R$ ${pizza.price.toFixed(
      2
    )}`;
    select(".pizzaInfo--size.selected").classList.remove("selected");

    selectAll(".pizzaInfo--size").forEach((size, sizeIndex) => {
      if (sizeIndex == 2) {
        size.classList.add("selected");
      }
      size.querySelector("span").textContent = pizzaJson[key].sizes[sizeIndex];
    });

    select(".pizzaInfo--qt").textContent = modalQt;

    select(".pizzaWindowArea").style.opacity = 0;
    select(".pizzaWindowArea").style.display = "flex";
    setTimeout(() => {
      select(".pizzaWindowArea").style.opacity = 1;
    }, 200);
  });

  select(".pizza-area").append(pizzaItem);
});


//Modal events
const closeModal = () => {
  select(".pizzaWindowArea").style.opacity = 0;
  setTimeout(() => {
    select(".pizzaWindowArea").style.display = "none";
  }, 500);
};

selectAll(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach(
  (item) => {
    item.addEventListener("click", closeModal);
  }
);

select(".pizzaInfo--qtmenos").addEventListener("click", () => {
  if (modalQt <= 1) {
    return;
  }
  modalQt--;
  select(".pizzaInfo--qt").textContent = modalQt;
});

select(".pizzaInfo--qtmais").addEventListener("click", () => {
  modalQt++;
  select(".pizzaInfo--qt").textContent = modalQt;
});

selectAll(".pizzaInfo--size").forEach((size) => {
  size.addEventListener("click", () => {
    select(".pizzaInfo--size.selected").classList.remove("selected");
    size.classList.add("selected");
  });
});

select(".pizzaInfo--addButton").addEventListener("click", () => {
  let size = parseInt(
      select(".pizzaInfo--size.selected").getAttribute("data-key")
    ),
    identifier = `${pizzaJson[modalKey].id}@${size}`,
    key = cart.findIndex((item) => item.identifier == identifier);

  if (key > -1) {
    cart[key].qt += modalQt;
  } else {
    cart.push({
      identifier,
      id: pizzaJson[modalKey].id,
      size,
      qt: modalQt,
    });
  }
  updateCart();
  closeModal();
});

select(".menu-openner").addEventListener("click", () => {
  if (cart.length > 0) select("aside").style.left = "0";
});

select(".menu-closer").addEventListener("click", () => {
  select("aside").style.left = "100vw";
});

function updateCart() {
  select(".menu-openner > span").textContent = cart.length;
  select("aside").classList.remove("show");
  select("aside").style.left = "100vw";

  if (cart.length <= 0) {
    return;
  }

  select("aside").classList.add("show");
  select(".cart").textContent = "";

  let subtotal = 0,
    desconto = 0,
    total = 0;

  cart.map((pizza) => {
    let pizzaItem = pizzaJson.find((item) => item.id == pizza.id),
      cartItem = select(".models .cart--item").cloneNode(true);

    subtotal += pizzaItem.price * pizza.qt;

    cartItem.querySelector("img").src = pizzaItem.img;

    let pizzaSizeName;
    switch (pizza.size) {
      case 0:
        pizzaSizeName = "P";
        break;
      case 1:
        pizzaSizeName = "M";
        break;
      case 2:
        pizzaSizeName = "G";
        break;
    }

    cartItem.querySelector(
      ".cart--item-nome"
    ).textContent = `${pizzaItem.name} (${pizzaSizeName})`;
    cartItem.querySelector(".cart--item--qt").textContent = pizza.qt;
    cartItem
      .querySelector(".cart--item-qtmais")
      .addEventListener("click", () => {
        pizza.qt++;
        updateCart();
      });
    cartItem
      .querySelector(".cart--item-qtmenos")
      .addEventListener("click", () => {
        if (pizza.qt > 1) {
          pizza.qt--;
        } else {
          cart.splice(cart.indexOf(pizza), 1);
        }
        updateCart();
      });

    select(".cart").append(cartItem);
  });

  desconto = subtotal * 0.1;
  total = subtotal - desconto;

  select(".subtotal > span:last-child").textContent = `R$ ${subtotal.toFixed(
    2
  )}`;
  select(".desconto > span:last-child").textContent = `R$ ${desconto.toFixed(
    2
  )}`;
  select(".total > span:last-child").textContent = `R$ ${total.toFixed(2)}`;
}
