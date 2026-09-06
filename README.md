
# Employee Management System

A full-stack web-based Employee Management System built using React, Node.js, Express.js, and MySQL.

## Project Overview

The Employee Management System is designed to manage employee information through a simple and responsive web interface.

The application allows users to:

- Add new employees
- View all employees
- Update employee information
- Delete employees
- Search employees
- Filter employees by department
- Validate employee form data
- Store employee information in MySQL

## Technologies Used

### Frontend

- React.js
- Vite
- Axios
- CSS3
- Responsive Design

### Backend

- Node.js
- Express.js
- MySQL2
- CORS
- Dotenv

### Database

- MySQL

### API Testing

- Postman

### Version Control

- Git
- GitHub

## Features

### Employee Management

The system provides complete CRUD functionality:

- Create Employee
- Read Employee
- Update Employee
- Delete Employee

### Search

Employees can be searched by:

- Name
- Email
- Role

### Department Filter

Employees can be filtered according to their department, such as:

- IT
- HR
- Finance
- Marketing
- Sales
- Operations

### Form Validation

The employee form includes validation for:

- Employee name
- Email address
- Phone number
- Role
- Salary

### Responsive Design

The interface is designed to work on:

- Desktop
- Tablet
- Mobile devices

## Project Structure

```text
employee-management-system
│
├── backend
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend
│   ├── src
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
````

## API Endpoints

| Method | Endpoint             | Description        |
| ------ | -------------------- | ------------------ |
| GET    | `/api/employees`     | Get all employees  |
| POST   | `/api/employees`     | Add a new employee |
| PUT    | `/api/employees/:id` | Update an employee |
| DELETE | `/api/employees/:id` | Delete an employee |

## Database

The application uses MySQL to store employee information.

Employee records contain information such as:

* ID
* Name
* Email
* Phone
* Role
* Department
* Salary

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/IsraArif-stack/syntecxhub-employee-management-system.git
```

### 2. Go to the project folder

```bash
cd syntecxhub-employee-management-system
```

### 3. Install backend dependencies

```bash
cd backend
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the backend folder.

Example:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=employee_management
PORT=5000
```

### 5. Start the backend

```bash
npm run dev
```

### 6. Install frontend dependencies

Open another terminal:

```bash
cd frontend
npm install
```

### 7. Start the frontend

```bash
npm run dev
```

## Testing

The REST API can be tested using Postman.

The following operations were tested:

* GET employees
* POST employee
* PUT employee
* DELETE employee

## Author

Isra Arif

## Project Type

Web-Based Full-Stack Application

## License

This project was developed for educational and internship purposes.

````
to mujhe `ho gaya` bolo.** Phir hum **Step 17 — final project demo/video ke liye exactly kya show karna hai** karenge.
