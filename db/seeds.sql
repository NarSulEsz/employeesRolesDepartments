-- Insert initial data into department table
INSERT INTO department (name) VALUES ('Sales'), ('Engineering'), ('Finance');

-- Insert initial data into role table
INSERT INTO role (title, salary, department_id) VALUES 
('Salesperson', 60000, 1),
('Software Engineer', 100000, 2),
('Accountant', 80000, 3);

-- Insert initial data into employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
('Leonel', 'Messi', 1, NULL),
('Diego', 'Maradonna', 2, NULL),
('Eric', 'Cantona', 3, 1);
