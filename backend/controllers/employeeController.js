const mysql = require("mysql2/promise");

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Get all employees
const getEmployees = async (req, res) => {
    try {
        const [employees] = await db.query(
            "SELECT * FROM employees ORDER BY id DESC"
        );

        res.status(200).json(employees);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch employees",
            error: error.message
        });
    }
};

// Get single employee
const getEmployeeById = async (req, res) => {
    try {
        const [employees] = await db.query(
            "SELECT * FROM employees WHERE id = ?",
            [req.params.id]
        );

        if (employees.length === 0) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.status(200).json(employees[0]);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch employee",
            error: error.message
        });
    }
};

// Add employee
const createEmployee = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            role,
            department,
            salary
        } = req.body;

        // Validation
        if (!name || !email || !role || salary === undefined || salary === "") {
            return res.status(400).json({
                message: "Name, email, role and salary are required"
            });
        }

        if (Number(salary) < 0) {
            return res.status(400).json({
                message: "Salary cannot be negative"
            });
        }

        const [result] = await db.query(
            `INSERT INTO employees
            (name, email, phone, role, department, salary)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                name,
                email,
                phone || null,
                role,
                department || null,
                salary
            ]
        );

        res.status(201).json({
            message: "Employee created successfully",
            employeeId: result.insertId
        });
    } catch (error) {
        console.error(error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        res.status(500).json({
            message: "Failed to create employee",
            error: error.message
        });
    }
};

// Update employee
const updateEmployee = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            role,
            department,
            salary
        } = req.body;

        if (!name || !email || !role || salary === undefined || salary === "") {
            return res.status(400).json({
                message: "Name, email, role and salary are required"
            });
        }

        if (Number(salary) < 0) {
            return res.status(400).json({
                message: "Salary cannot be negative"
            });
        }

        const [result] = await db.query(
            `UPDATE employees
            SET name = ?,
                email = ?,
                phone = ?,
                role = ?,
                department = ?,
                salary = ?
            WHERE id = ?`,
            [
                name,
                email,
                phone || null,
                role,
                department || null,
                salary,
                req.params.id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.status(200).json({
            message: "Employee updated successfully"
        });
    } catch (error) {
        console.error(error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        res.status(500).json({
            message: "Failed to update employee",
            error: error.message
        });
    }
};

// Delete employee
const deleteEmployee = async (req, res) => {
    try {
        const [result] = await db.query(
            "DELETE FROM employees WHERE id = ?",
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.status(200).json({
            message: "Employee deleted successfully"
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to delete employee",
            error: error.message
        });
    }
};

module.exports = {
    getEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee
};