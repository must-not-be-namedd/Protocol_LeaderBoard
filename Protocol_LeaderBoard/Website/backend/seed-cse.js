require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const cseQuestions = [
    // OOP
    { q: "What is encapsulation in OOP?", a: "Binding data and methods together", b: "Hiding implementation details", c: "Multiple inheritance", d: "Code reuse", ans: "A" },
    { q: "Which feature of OOP indicates code reusability?", a: "Encapsulation", b: "Inheritance", c: "Polymorphism", d: "Abstraction", ans: "B" },
    { q: "Which keyword is used to access the superclass method?", a: "super", b: "this", c: "extends", d: "static", ans: "A" },
    { q: "What is polymorphism?", a: "Many forms", b: "Hiding data", c: "Creating objects", d: "Inheriting classes", ans: "A" },
    { q: "Which access modifier makes a member visible only within the class?", a: "Public", b: "Protected", c: "Private", d: "Default", ans: "C" },
    { q: "What is an abstract class?", a: "A class that cannot be instantiated", b: "A class with no methods", c: "A class with only static methods", d: "A final class", ans: "A" },
    { q: "What is the output of '1' + 1 in Java?", a: "2", b: "11", c: "Error", d: "undefined", ans: "B" },
    { q: "Which of these is NOT an OOP principle?", a: "Encapsulation", b: "Polymorphism", c: "Compilation", d: "Inheritance", ans: "C" },
    { q: "In Java, multiple inheritance is achieved through?", a: "Interfaces", b: "Classes", c: "Abstract Classes", d: "Methods", ans: "A" },
    { q: "What is a constructor?", a: "A method to initialize objects", b: "A method to destroy objects", c: "A static block", d: "A variable", ans: "A" },

    // DBMS
    { q: "What does SQL stand for?", a: "Structured Question Language", b: "Structured Query Language", c: "Simple Query Language", d: "Sequential Query Language", ans: "B" },
    { q: "Which key uniquely identifies a record in a table?", a: "Foreign Key", b: "Primary Key", c: "Unique Key", d: "Candidate Key", ans: "B" },
    { q: "What is Normalization?", a: "Increasing redundancy", b: "Reducing redundancy", c: "Creating tables", d: "Deleting tables", ans: "B" },
    { q: "Which command is used to remove a table?", a: "DELETE", b: "REMOVE", c: "DROP", d: "TRUNCATE", ans: "C" },
    { q: "What does ACID stand for?", a: "Atomicity, Consistency, Isolation, Durability", b: "Atomicity, Consistency, Integrity, Durability", c: "Accuracy, Consistency, Isolation, Durability", d: "Atomicity, Concurrency, Isolation, Durability", ans: "A" },
    { q: "Which clause is used to filter records?", a: "GROUP BY", b: "ORDER BY", c: "WHERE", d: "HAVING", ans: "C" },
    { q: "What is a Foreign Key?", a: "A key linking two tables", b: "A unique key", c: "A null key", d: "A primary key", ans: "A" },
    { q: "Which SQL statement is used to update data?", a: "SAVE", b: "MODIFY", c: "UPDATE", d: "CHANGE", ans: "C" },
    { q: "What isn't a type of database model?", a: "Network", b: "Relational", c: "Object-Oriented", d: "Distributed", ans: "D" },
    { q: "What is the full form of DDL?", a: "Data Definition Language", b: "Data Derivation Language", c: "Dynamic Data Language", d: "Detailed Data Language", ans: "A" },

    // OS
    { q: "What is the core of the OS called?", a: "Shell", b: "Kernel", c: "Command", d: "Script", ans: "B" },
    { q: "Which is not an operating system?", a: "Windows", b: "Linux", c: "Oracle", d: "MacOS", ans: "C" },
    { q: "What is virtual memory?", a: "Memory on the hard disk", b: "Memory in RAM", c: "Memory in CPU", d: "Memory in Cache", ans: "A" },
    { q: "What is a deadlock?", a: "A process waiting for I/O", b: "Two processes waiting for each other", c: "A crashed process", d: "A terminated process", ans: "B" },
    { q: "What is context switching?", a: "Switching CPU between processes", b: "Switching memory", c: "Switching users", d: "Switching disks", ans: "A" },
    { q: "What is a thread?", a: "A heavy weight process", b: "A light weight process", c: "A program", d: "A function", ans: "B" },
    { q: "FIFO is a scheduling algorithm based on?", a: "Priority", b: "First Come First Serve", c: "Shortest Job First", d: "Round Robin", ans: "B" },
    { q: "What is thrashing?", a: "High CPU usage", b: "High Disk usage", c: "Excessive paging", d: "Low memory", ans: "C" },
    { q: "Which directory contains device files in Linux?", a: "/etc", b: "/dev", c: "/bin", d: "/usr", ans: "B" },
    { q: "What is the command to list files in Linux?", a: "ls", b: "cd", c: "mv", d: "rm", ans: "A" },

    // Networks
    { q: "IP stands for?", a: "Internet Protocol", b: "Intranet Protocol", c: "Internal Protocol", d: "Internet Post", ans: "A" },
    { q: "Which layer is the IP layer?", a: "Transport", b: "Network", c: "Data Link", d: "Physical", ans: "B" },
    { q: "HTTP uses which port by default?", a: "21", b: "80", c: "443", d: "22", ans: "B" },
    { q: "HTTPS uses which port?", a: "80", b: "443", c: "8080", d: "21", ans: "B" },
    { q: "What is localhost IP?", a: "192.168.1.1", b: "127.0.0.1", c: "10.0.0.1", d: "0.0.0.0", ans: "B" },
    { q: "Which protocol is connectionless?", a: "TCP", b: "UDP", c: "FTP", d: "HTTP", ans: "B" },
    { q: "What is DNS?", a: "Domain Name System", b: "Data Name System", c: "Domain Network System", d: "Data Network System", ans: "A" },
    { q: "OSI model has how many layers?", a: "5", b: "6", c: "7", d: "4", ans: "C" },
    { q: "Which device operates at the Data Link layer?", a: "Router", b: "Switch", c: "Hub", d: "Repeater", ans: "B" },
    { q: "TCP is?", a: "Connection Oriented", b: "Connectionless", c: "Unreliable", d: "Fast", ans: "A" },

    // DSA
    { q: "Time complexity of binary search?", a: "O(n)", b: "O(log n)", c: "O(1)", d: "O(n^2)", ans: "B" },
    { q: "Which data structure uses LIFO?", a: "Queue", b: "Stack", c: "Tree", d: "Graph", ans: "B" },
    { q: "Which data structure uses FIFO?", a: "Queue", b: "Stack", c: "Tree", d: "Heap", ans: "A" },
    { q: "Worst case of QuickSort?", a: "O(n log n)", b: "O(n^2)", c: "O(n)", d: "O(log n)", ans: "B" },
    { q: "What is a linked list?", a: "Linear data structure", b: "Non-linear data structure", c: "Array", d: "Tree", ans: "A" },
    { q: "Height of a balanced binary tree?", a: "O(n)", b: "O(log n)", c: "O(n^2)", d: "O(1)", ans: "B" },
    { q: "Which sorting algorithm is stable?", a: "QuickSort", b: "MergeSort", c: "HeapSort", d: "SelectionSort", ans: "B" },
    { q: "What is hashing?", a: "Sorting data", b: "Mapping keys to values", c: "Searching data", d: "Encrypting data", ans: "B" },
    { q: "A graph with no cycles is a?", a: "Tree", b: "Heap", c: "Stack", d: "Map", ans: "A" },
    { q: "DFS uses which data structure?", a: "Queue", b: "Stack", c: "Array", d: "Linked List", ans: "B" },

    // Mixed / Misc
    { q: "Which language is used for Web Apps?", a: "C++", b: "JavaScript", c: "C", d: "Assembly", ans: "B" },
    { q: "What is Git?", a: "Code Editor", b: "Version Control System", c: "Operating System", d: "Database", ans: "B" },
    { q: "What does URL stand for?", a: "Uniform Resource Locator", b: "Universal Resource Locator", c: "Uniform Reference Locator", d: "Universal Reference Locator", ans: "A" },
    { q: "Which is a NoSQL database?", a: "PostgreSQL", b: "MySQL", c: "MongoDB", d: "Oracle", ans: "C" },
    { q: "What is API?", a: "Application Programming Interface", b: "Application Protocol Interface", c: "Applied Program Interface", d: "App Interface", ans: "A" }
];

(async () => {
    try {
        console.log(`Seeding ${cseQuestions.length} CSE questions...`);

        let inserted = 0;
        for (const q of cseQuestions) {
            await pool.query(
                `INSERT INTO questions (question_text, option_a, option_b, option_c, option_d, correct_option) 
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [q.q, q.a, q.b, q.c, q.d, q.ans]
            );
            inserted++;
        }
        console.log(`✅ Successfully seeded ${inserted} questions.`);
        process.exit(0);
    } catch (err) {
        console.error("❌ Seeding failed:", err);
        process.exit(1);
    }
})();
