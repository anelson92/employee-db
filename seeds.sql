INSERT INTO department (dept_name)
VALUES ("Visual Merchandiser");

INSERT INTO employeeRole (title, salary, department_id)
VALUES ("Visual Merchandiser", 100000000, (SELECT id FROM department WHERE dept_name="Visual Merchandiser"));

INSERT INTO employee (first_name, last_name, employeeRole_id)
VALUES ("Amanda", "Nelson", (SELECT id FROM employeeRole WHERE title="Visual Merchandiser"));