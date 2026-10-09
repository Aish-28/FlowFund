
import { useState } from "react";
import { FiUserPlus, FiUser, FiMail, FiLock } from "react-icons/fi";
import DashboardLayout from "../../components/DashboardLayout";
import { createAdmin } from "../../services/adminService";
import "./AddAdmin.css";

const navItems = [
  { label: "Dashboard", path: "/admin-dashboard", icon: "dashboard" },
  { label: "Users", path: "/admin-users", icon: "users" },
  { label: "Payments", path: "/admin-payments", icon: "wallet" },
  { label: "Transactions", path: "/admin-transactions", icon: "transactions" },
  { label: "Add Admin", path: "/admin/add", icon: "settings" },
];

export default function AddAdmin() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (form.name.trim().length < 2) {
      setError("Name must contain at least 2 characters.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      const result = await createAdmin({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      setSuccess(result.message || "Admin account created successfully.");
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      setError(err.message || "Unable to create admin account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Add Admin"
      subtitle="Create another administrator account."
      role="ADMIN"
      navItems={navItems}
    >
      <div className="add-admin-page">
        <section className="add-admin-card">
          <div className="add-admin-heading">
            <div className="add-admin-icon">
              <FiUserPlus />
            </div>
            <div>
              <h1>Add New Admin</h1>
              <p>Enter the details to create an administrator account.</p>
            </div>
          </div>

          {error && <div className="add-admin-message error">{error}</div>}
          {success && (
            <div className="add-admin-message success">{success}</div>
          )}

          <form onSubmit={handleSubmit}>
            <label htmlFor="admin-name">Full Name</label>
            <div className="add-admin-input">
              <FiUser />
              <input
                id="admin-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter full name"
                minLength={2}
                maxLength={80}
                required
              />
            </div>

            <label htmlFor="admin-email">Email Address</label>
            <div className="add-admin-input">
              <FiMail />
              <input
                id="admin-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email address"
                required
              />
            </div>

            <label htmlFor="admin-password">Password</label>
            <div className="add-admin-input">
              <FiLock />
              <input
                id="admin-password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                minLength={8}
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              <FiUserPlus />
              {loading ? "Creating Admin..." : "Create Admin"}
            </button>
          </form>
        </section>
      </div>
    </DashboardLayout>
  );
}
