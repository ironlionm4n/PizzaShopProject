import React, { useRef } from "react";
import { BsCart4 } from "react-icons/bs";
import { CSSTransition } from "react-transition-group";

const Cart = ({ cartItems, showCart, setShowCart }) => {
  const nodeRef = useRef(null);
  const cartItemCount = cartItems.reduce(
    (count, item) => count + Number(item.count),
    0
  );

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  return (
    <>
      <div className="cart-icon" onClick={toggleCart}>
        <BsCart4 className="cart-icon-icon" />
        <span className="cart-count">{cartItemCount}</span>
      </div>
      <CSSTransition
        in={showCart}
        timeout={300}
        classNames={"cart"}
        unmountOnExit
        onEnter={() => console.log("on enter")}
        onExited={() => console.log("on exited")}
        nodeRef={nodeRef}
      >
        <div className={"cart-content"} ref={nodeRef}>
          <h1 className="cart-title">Cart</h1>
          {cartItems.map((cartItem) => (
            <CartItem key={cartItem.pizza.name} cartItem={cartItem} />
          ))}
          <span className="cart-total">
            Total: $
            {cartItems.reduce(
              (total, item) => total + item.pizza.price * item.count,
              0
            )}
          </span>
        </div>
      </CSSTransition>
    </>
  );
};

export default Cart;

const CartItem = ({ cartItem }) => {
  const { pizza, count } = cartItem;
  return (
    <div className="cart-item">
      <div className="cart-item__name">{pizza.name}</div>
      <div className="cart-item__price">${pizza.price}</div>
      <div className="cart-item__count">X {count}</div>
    </div>
  );
};
