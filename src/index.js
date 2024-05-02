import React, { StrictMode, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Cart from "./components/Cart";

const pizzaData = [
  {
    name: "Focaccia",
    ingredients: "Bread with italian olive oil and rosemary",
    price: 6,
    photoName: "pizzas/focaccia.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Margherita",
    ingredients: "Tomato and mozarella",
    price: 10,
    photoName: "pizzas/margherita.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Spinaci",
    ingredients: "Tomato, mozarella, spinach, and ricotta cheese",
    price: 12,
    photoName: "pizzas/spinaci.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Funghi",
    ingredients: "Tomato, mozarella, mushrooms, and onion",
    price: 12,
    photoName: "pizzas/funghi.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Salamino",
    ingredients: "Tomato, mozarella, and pepperoni",
    price: 15,
    photoName: "pizzas/salamino.jpg",
    soldOut: true,
  },
  {
    name: "Pizza Prosciutto",
    ingredients: "Tomato, mozarella, ham, aragula, and burrata cheese",
    price: 18,
    photoName: "pizzas/prosciutto.jpg",
    soldOut: false,
  },
];

const App = () => {
  const [cartItems, setCartItems] = React.useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const onOrder = () => {
    setShowModal(true);
  };

  const onModalClose = () => {
    setShowModal(false);
    setCartItems([]);
    setShowCart(false);
  };

  const onRemoveFromCart = (cartItem) => {
    setCartItems(() =>
      cartItems.filter((item) => item.pizza.name !== cartItem.name)
    );
  };

  const onAddToCart = (cartItem) => {
    setCartItems(() => cartItems.concat(cartItem));
    setShowCart(true);
  };

  return (
    <>
      <div className="container">
        <Header />
        <Menu
          cartItems={cartItems}
          onAddToCart={onAddToCart}
          onRemoveFromCart={onRemoveFromCart}
        />
        <Footer cartItems={cartItems} onOrder={onOrder} />
      </div>
      <Cart
        cartItems={cartItems}
        showCart={showCart}
        setShowCart={setShowCart}
      />
      <div className={`modal${showModal && "-show"}`} onClick={onModalClose}>
        <div className={`modal-content${showModal ? "-show" : "-hide"}`}>
          <span className="close">&times;</span>
          <h2 className="modal-header">Order Confirmation</h2>
          <p className="modal-paragraph">Your order has been placed!</p>
          {cartItems.map((cartItem) => (
            <div key={cartItem.pizza.name} className="modal-item">
              <span>{cartItem.pizza.name}</span>
              <span>X {cartItem.count}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const Pizza = ({ pizza, onAddToCart, cartItems, onRemoveFromCart }) => {
  const { photoName, name, ingredients, price, soldOut } = pizza;
  const [count, setCount] = React.useState(0);
  const countRef = React.useRef();
  let inCart = false;
  for (let i = 0; i < cartItems.length; i++) {
    if (cartItems[i].pizza.name === name) {
      inCart = true;
    }
  }

  return (
    <li className={`pizza ${soldOut && "sold-out"}`}>
      <img src={photoName} alt={`Pizza ${name}`} />
      <div>
        <h3>{name}</h3>
        <p>{ingredients}</p>
        <div style={{ display: "flex", maxWidth: "24rem", minWidth: "24rem" }}>
          <span style={{ fontSize: "2rem", fontWeight: 500 }}>
            {soldOut ? "SOLD OUT" : `$${price}`}
          </span>
          <input
            type="number"
            id="count"
            value={count}
            min={0}
            max={10}
            ref={countRef}
            onChange={(e) => {
              if (e.target.value < 0) e.target.value = 0;
              if (e.target.value > 10) e.target.value = 10;
              setCount(e.target.value);
            }}
            disabled={soldOut ? true : inCart ? true : false}
          />
          {inCart ? (
            <button
              className="btn-remove"
              onClick={() => {
                onRemoveFromCart(pizza);
                setCount(0);
              }}
            >
              Remove from Cart
            </button>
          ) : (
            <button
              className={!soldOut ? "btn" : "btn disabled"}
              onClick={() => {
                onAddToCart({ pizza: pizza, count: countRef.current.value });
                setCount(0);
              }}
              disabled={soldOut ? true : count < 1 ? true : false}
            >
              {soldOut ? "Sold Out" : "Add to Cart"}
            </button>
          )}
        </div>
      </div>
    </li>
  );
};

const Header = () => {
  return (
    <header className="header">
      <h1>Fast React Pizza Co.</h1>
    </header>
  );
};

const Menu = ({ cartItems, onAddToCart, onRemoveFromCart }) => {
  const pizzas = pizzaData;

  return (
    <main className="menu">
      <h2>Menu</h2>

      {pizzas.length > 0 ? (
        <>
          <p>
            Authentic Italian cuisine. 6 creative dishes to choose from. All
            from our stone oven, all organic, all delicious.
          </p>
          <ul className="pizzas">
            {pizzas.map((pizza) => {
              return (
                <Pizza
                  onAddToCart={onAddToCart}
                  pizza={pizza}
                  key={pizza.name}
                  cartItems={cartItems}
                  onRemoveFromCart={onRemoveFromCart}
                />
              );
            })}
          </ul>
        </>
      ) : (
        <p>Out of food!!</p>
      )}
    </main>
  );
};

const Footer = ({ cartItems, onOrder }) => {
  const hour = new Date().getHours();
  const openHour = 12;
  const closeHour = 22;
  const isOpen = hour >= openHour && hour < closeHour;

  return (
    <footer className="footer">
      {isOpen ? (
        <Open
          openHour={openHour}
          closeHour={closeHour}
          cartItems={cartItems}
          onOrder={onOrder}
        />
      ) : (
        <Closed openHour={openHour} closeHour={closeHour} a />
      )}
    </footer>
  );
};

const Open = ({ openHour, closeHour, cartItems, onOrder }) => {
  return (
    <div className="order">
      <p>
        Open between {openHour}:00 and close at {closeHour}:00. Order online
        today!
      </p>
      <button
        className={cartItems.length < 1 ? "btn disabled" : "btn"}
        disabled={cartItems.length < 1}
        onClick={onOrder}
      >
        Place Order
      </button>
    </div>
  );
};

const Closed = ({ openHour, closeHour }) => {
  return (
    <div className="order">
      <p>
        Closed, please come back between the hours of {openHour}:00 and{" "}
        {closeHour}:00
      </p>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
