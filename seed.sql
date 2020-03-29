USE EmployeeDB;

/* departments */
INSERT INTO department (name)
VALUES ("Sales"), ("Engineering"), ("Finance"), ("Legal");

/* roles */
INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1), 
("Salesperson", 80000, 1), 
("Lead Engineer", 150000, 2), 
("Software Engineer", 120000, 2),
("Accountant", 125000, 3),
("Legal Team Lead", 250000, 4),
("Lawyer", 190000, 4);

/* employees */
INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES("John", "Doe", 1, 3),
("Mike", "Chan", 2, 1),
("Ashley", "Rodriguez", 3, null),
("Kevin", "Tupik", 4, 3),
("Malia", "Brown", 5, null),
("Sarah", "Lourd", 6, null),
("Tom", "Allen", 7, 6),
("Christian", "Eckenrode", 8, 2);

SELECT E1.id, E1.first_name, E1.last_name, role.title, department.name AS department, role.salary, CONCAT(E2.first_name, " ", E2.last_name) AS manager FROM role
INNER JOIN department ON department.id = role.department_id
INNER JOIN employee E1 ON E1.role_id = role.id
LEFT JOIN employee E2 ON E1.manager_id = E2.id;