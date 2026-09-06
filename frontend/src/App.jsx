import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000/api/employees";

function App() {
  const [employees, setEmployees] = useState([]);

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    salary: "",
  });

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      setLoading(true);

      const response = await axios.get(API_URL);

      setEmployees(response.data);
    } catch (error) {
      console.error("Failed to fetch employees:", error);

      showMessage(
        "Unable to load employees. Please check the backend server.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Show message
  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  // Handle input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "",
      department: "",
      salary: "",
    });

    setEditingId(null);
    setShowForm(false);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const role = formData.role.trim();
    const salary = Number(formData.salary);

    // Name validation
    if (name.length < 2) {
      showMessage(
        "Name must contain at least 2 characters.",
        "error"
      );
      return;
    }

    // Email validation
    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      showMessage(
        "Please enter a valid email address.",
        "error"
      );
      return;
    }

    // Phone validation
    if (
      phone &&
      !/^[0-9+\-\s()]{7,20}$/.test(phone)
    ) {
      showMessage(
        "Please enter a valid phone number.",
        "error"
      );
      return;
    }

    // Role validation
    if (role.length < 2) {
      showMessage(
        "Role must contain at least 2 characters.",
        "error"
      );
      return;
    }

    // Salary validation
    if (
      !formData.salary ||
      Number.isNaN(salary) ||
      salary < 0
    ) {
      showMessage(
        "Please enter a valid salary.",
        "error"
      );
      return;
    }

    const employeeData = {
      name,
      email,
      phone,
      role,
      department: formData.department,
      salary,
    };

    try {
      setSaving(true);

      if (editingId) {
        await axios.put(
          `${API_URL}/${editingId}`,
          employeeData
        );

        showMessage(
          "Employee updated successfully.",
          "success"
        );
      } else {
        await axios.post(
          API_URL,
          employeeData
        );

        showMessage(
          "Employee added successfully.",
          "success"
        );
      }

      resetForm();

      await fetchEmployees();
    } catch (error) {
      console.error(error);

      showMessage(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  // Edit employee
  const handleEdit = (employee) => {
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone || "",
      role: employee.role,
      department: employee.department || "",
      salary: employee.salary,
    });

    setEditingId(employee.id);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Delete employee
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/${id}`);

      showMessage(
        "Employee deleted successfully.",
        "success"
      );

      fetchEmployees();
    } catch (error) {
      console.error(error);

      showMessage(
        error.response?.data?.message ||
          "Failed to delete employee.",
        "error"
      );
    }
  };

  // Search and department filter
  const filteredEmployees = employees.filter(
    (employee) => {
      const searchText =
        search.toLowerCase();

      const matchesSearch =
        employee.name
          .toLowerCase()
          .includes(searchText) ||
        employee.email
          .toLowerCase()
          .includes(searchText) ||
        employee.role
          .toLowerCase()
          .includes(searchText);

      const matchesDepartment =
        departmentFilter === "" ||
        employee.department ===
          departmentFilter;

      return (
        matchesSearch &&
        matchesDepartment
      );
    }
  );

  // Unique departments
  const departments = [
    ...new Set(
      employees
        .map(
          (employee) =>
            employee.department
        )
        .filter(Boolean)
    ),
  ];

  // Average salary
  const averageSalary =
    employees.length > 0
      ? Math.round(
          employees.reduce(
            (total, employee) =>
              total +
              Number(employee.salary),
            0
          ) / employees.length
        )
      : 0;

  return (
    <div className="app">

      {/* Notification */}
      {message && (
        <div
          className={`notification ${messageType}`}
        >
          {message}
        </div>
      )}

      {/* Header */}
      <header className="header">
        <div>
          <h1>Employee Management</h1>

          <p>
            Manage your employees efficiently
          </p>
        </div>

        <button
          className="add-btn"
          onClick={() => {
            setEditingId(null);

            setFormData({
              name: "",
              email: "",
              phone: "",
              role: "",
              department: "",
              salary: "",
            });

            setShowForm(true);
          }}
        >
          + Add Employee
        </button>
      </header>

      <main className="container">

        {/* Statistics */}
        <section className="stats">

          <div className="stat-card">
            <span>
              Total Employees
            </span>

            <strong>
              {employees.length}
            </strong>
          </div>

          <div className="stat-card">
            <span>
              Departments
            </span>

            <strong>
              {departments.length}
            </strong>
          </div>

          <div className="stat-card">
            <span>
              Average Salary
            </span>

            <strong>
              Rs.{" "}
              {averageSalary.toLocaleString()}
            </strong>
          </div>

        </section>

        {/* Employee Form */}
        {showForm && (
          <section className="form-card">

            <div className="form-header">

              <div>
                <h2>
                  {editingId
                    ? "Edit Employee"
                    : "Add New Employee"}
                </h2>

                <p>
                  {editingId
                    ? "Update employee information"
                    : "Enter employee information below"}
                </p>
              </div>

              <button
                className="close-btn"
                onClick={resetForm}
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
            >

              <div className="form-grid">

                {/* Name */}
                <div className="input-group">
                  <label>
                    Full Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={
                      formData.name
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter full name"
                    required
                  />
                </div>

                {/* Email */}
                <div className="input-group">
                  <label>
                    Email *
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={
                      formData.email
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter email address"
                    required
                  />
                </div>

                {/* Phone */}
                <div className="input-group">
                  <label>
                    Phone
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={
                      formData.phone
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter phone number"
                  />
                </div>

                {/* Role */}
                <div className="input-group">
                  <label>
                    Role *
                  </label>

                  <input
                    type="text"
                    name="role"
                    value={
                      formData.role
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="e.g. Software Engineer"
                    required
                  />
                </div>

                {/* Department */}
                <div className="input-group">
                  <label>
                    Department
                  </label>

                  <select
                    name="department"
                    value={
                      formData.department
                    }
                    onChange={
                      handleChange
                    }
                  >
                    <option value="">
                      Select Department
                    </option>

                    <option value="IT">
                      IT
                    </option>

                    <option value="HR">
                      HR
                    </option>

                    <option value="Finance">
                      Finance
                    </option>

                    <option value="Marketing">
                      Marketing
                    </option>

                    <option value="Sales">
                      Sales
                    </option>

                    <option value="Operations">
                      Operations
                    </option>
                  </select>
                </div>

                {/* Salary */}
                <div className="input-group">
                  <label>
                    Salary *
                  </label>

                  <input
                    type="number"
                    name="salary"
                    value={
                      formData.salary
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter salary"
                    min="0"
                    required
                  />
                </div>

              </div>

              <div className="form-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={resetForm}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Employee"
                    : "Save Employee"}
                </button>

              </div>

            </form>

          </section>
        )}

        {/* Employees */}
        <section className="employees-section">

          <div className="section-heading">

            <div>
              <h2>
                Employees
              </h2>

              <p>
                View and manage all employees
              </p>
            </div>

          </div>

          {/* Filters */}
          <div className="filters">

            <input
              type="text"
              placeholder="Search by name, email or role..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="search-input"
            />

            <select
              value={
                departmentFilter
              }
              onChange={(e) =>
                setDepartmentFilter(
                  e.target.value
                )
              }
              className="filter-select"
            >
              <option value="">
                All Departments
              </option>

              <option value="IT">
                IT
              </option>

              <option value="HR">
                HR
              </option>

              <option value="Finance">
                Finance
              </option>

              <option value="Marketing">
                Marketing
              </option>

              <option value="Sales">
                Sales
              </option>

              <option value="Operations">
                Operations
              </option>
            </select>

          </div>

          {/* Loading */}
          {loading ? (
            <div className="empty-state">
              <h3>
                Loading Employees...
              </h3>

              <p>
                Please wait while employee data is loading.
              </p>
            </div>
          ) : filteredEmployees.length === 0 ? (

            <div className="empty-state">

              <h3>
                No Employees Found
              </h3>

              <p>
                {employees.length === 0
                  ? "Start by adding your first employee."
                  : "Try changing your search or filter."}
              </p>

              {employees.length === 0 && (
                <button
                  className="add-btn"
                  onClick={() =>
                    setShowForm(true)
                  }
                >
                  + Add Employee
                </button>
              )}

            </div>

          ) : (

            <div className="table-wrapper">

              <table>

                <thead>

                  <tr>
                    <th>ID</th>
                    <th>Employee</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Salary</th>
                    <th>Actions</th>
                  </tr>

                </thead>

                <tbody>

                  {filteredEmployees.map(
                    (employee) => (

                      <tr
                        key={
                          employee.id
                        }
                      >

                        <td>
                          #
                          {
                            employee.id
                          }
                        </td>

                        <td>
                          <strong>
                            {
                              employee.name
                            }
                          </strong>
                        </td>

                        <td>
                          {
                            employee.email
                          }
                        </td>

                        <td>
                          <span className="role-badge">
                            {
                              employee.role
                            }
                          </span>
                        </td>

                        <td>
                          {
                            employee.department ||
                            "—"
                          }
                        </td>

                        <td>
                          Rs.{" "}
                          {Number(
                            employee.salary
                          ).toLocaleString()}
                        </td>

                        <td>

                          <div className="actions">

                            <button
                              className="edit-btn"
                              onClick={() =>
                                handleEdit(
                                  employee
                                )
                              }
                            >
                              Edit
                            </button>

                            <button
                              className="delete-btn"
                              onClick={() =>
                                handleDelete(
                                  employee.id
                                )
                              }
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default App;