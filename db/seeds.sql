-- Departments in department table ---
INSERT INTO department (name)
VALUES
    ("Information Systems"),
    ("Finance"),
    ("Legal"),
    ("Sales"),
    ("Administration");

-- Employee roles in role table ---
INSERT INTO role (title, salary, department_id)
VALUES
    ("Software Engineer", 140000, 1),
    ("Assistant Controller", 120000, 2),
    ("General Counsel", 250000, 3),
    ("Licensing Associate", 65000, 4),
    ("Administrative Assistant", 50000, 5);

-- Employee info in employee table ---
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ("Scott", "Roman", 1, 2),
    ("Linda", "Kanazu", 2, 3),
    ("Tony", "Sanzaro", 3, 1),
    ("Ben", "Rodriguez", 4, 3),
    ("Briana", "Simpson", 5, 2);
