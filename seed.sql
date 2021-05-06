USE employeeTracker_db;

INSERT INTO department (name)
VALUES 
('Clerical'), ('Judicial'), ('Attorney'), ('Information Technology'), ('Accounting');

INSERT INTO role (title, salary, department_id)
VALUES 
('Court Clerk', 45000, 1), ('Judge', 120000, 2), ('County Attorney', 85000, 3), ('IT Specialist', 60000, 4), ('Accountant', 65000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ('Gabrielle', 'Gibson', 1, null), ('John', 'Brown', 2, 4), ('Joseph', 'Johnson', 3, null), ('Paul', 'Kinneson', 4, null), ('Joe', 'Alvin', 5, null);


