import { useEffect, useState } from "react";
import API from "../api/axios";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("orders/admin-orders/");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch admin orders", err);
      setError("You are not authorized to view admin orders.");
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await API.patch(`orders/update-status/${orderId}/`, {
        status: status,
      });

      alert("Order status updated successfully!");
      fetchOrders();
    } catch (err) {
      console.error("Failed to update status", err);
      alert(
        err?.response?.data?.error ||
          err?.response?.data?.detail ||
          "Failed to update order status",
      );
    }
  };

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Admin Order Management</h2>

      {orders.length === 0 ? (
        <p>No orders available.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="card shadow-sm mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5>Order #{order.id}</h5>
                  <p className="mb-1">
                    <strong>Customer:</strong> {order.user}
                  </p>
                  <p className="mb-0 text-muted">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>

                <span
                  className={`badge ${
                    order.status === "completed"
                      ? "bg-success"
                      : order.status === "pending"
                        ? "bg-warning text-dark"
                        : "bg-secondary"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <hr />

              <h6>Items:</h6>
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="d-flex justify-content-between border-bottom py-2"
                >
                  <div>
                    <strong>{item.product_name}</strong>
                    <p className="mb-0">Size: {item.size}</p>
                    <p className="mb-0">Qty: {item.quantity}</p>
                  </div>
                  <div>
                    <strong>₹{item.price}</strong>
                  </div>
                </div>
              ))}

              <div className="mt-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
                <h5>Total: ₹{order.total_price}</h5>

                <div className="d-flex gap-2">
                  {order.status !== "completed" && (
                    <button
                      className="btn btn-success"
                      onClick={() => updateStatus(order.id, "completed")}
                    >
                      Mark Completed
                    </button>
                  )}

                  {order.status !== "pending" && (
                    <button
                      className="btn btn-warning"
                      onClick={() => updateStatus(order.id, "pending")}
                    >
                      Mark Pending
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminOrders;
