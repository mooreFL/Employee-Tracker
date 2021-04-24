USE employee_trackerDB;

INSERT INTO department (name)
VALUES ("Web Development"), ("Sales"), ("Legal"), ("Human Resources"), ("Management"), ("Accounting");

INSERT INTO role (title, salary, department_id)
VALUES ("Senior", 200000, 1),("Junior", 60000, 1),("Lawyer", 150000, 3),("Graphic Design", 100000, 1),("Accountant", 85000, 6),("Receptionist", 30000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Patrick", "Moore",1,NULL),("Adam", "Alcantara",2, NULL),("Arecio","Canton",3,NULL),("Annie","Mascarello",4,NULL),("Tom","Cruise",2, 1);

INSERT INTO employee (first_name, role_id, manager_id)
VALUES ("John","Marston",3, 1),("Arthur","Morgan",2, 2),("Josiah","Trelawney",2, 3),("Dutch","VanDerLinde",4, 4),("Paul","Harris",2, 5);



