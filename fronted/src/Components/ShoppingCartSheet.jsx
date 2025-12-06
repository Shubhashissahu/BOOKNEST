import Offcanvas from "react-bootstrap/Offcanvas";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import { Trash } from "react-bootstrap-icons";

export default function ShoppingCartSheet({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
}) {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 5.99 : 0;
  const total = subtotal + shipping;

  return (
    <Offcanvas
      show={isOpen}
      onHide={onClose}
      placement="end"
      scroll={true}
      backdrop={true}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Shopping Cart</Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body className="d-flex flex-column justify-content-between">
        {cartItems.length === 0 ? (
          <p className="text-muted text-center my-5">Your cart is empty</p>
        ) : (
          <>
            <div className="flex-grow-1 overflow-auto">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="d-flex mb-3 align-items-center border-bottom pb-2"
                >
                  <div
                    style={{ width: "70px", height: "100px" }}
                    className="me-3"
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      rounded
                      fluid
                      style={{ objectFit: "cover", width: "100%", height: "100%" }}
                    />
                  </div>

                  <div className="flex-grow-1">
                    <h6 className="mb-1">{item.title}</h6>
                    <small className="text-muted">{item.author}</small>
                    <p className="mb-1 fw-bold text-warning">
                      ${item.price.toFixed(2)}
                    </p>

                    <div className="d-flex align-items-center">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() =>
                          onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
                        }
                      >
                        −
                      </Button>

                      <span className="mx-2">{item.quantity}</span>

                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </Button>

                      <Button
                        variant="link"
                        className="text-danger ms-auto"
                        onClick={() => onRemoveItem(item.id)}
                      >
                        <Trash size={18} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-top pt-3 mt-auto">
              <div className="d-flex justify-content-between mb-1">
                <span className="text-muted">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="d-flex justify-content-between mb-1">
                <span className="text-muted">Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between fw-bold">
                <span>Total</span>
                <span className="text-warning">${total.toFixed(2)}</span>
              </div>

              <Button variant="warning" className="w-100 mt-3">
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}
