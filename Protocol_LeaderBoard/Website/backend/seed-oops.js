const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const oopQuestions = [
    {
        q: "What is the primary purpose of a 'destructor' in C++?",
        a: "To initialize an object",
        b: "To copy an object",
        c: "To free resources allocated to an object",
        d: "To call a superclass method",
        ans: "C",
        exp: "A destructor is a special member function that is executed whenever an object's lifetime ends, primarily used to release resources like memory or file handles."
    },
    {
        q: "In Java, what is the default value of an uninitialized object reference in a class?",
        a: "0",
        b: "null",
        c: "undefined",
        d: "Empty string",
        ans: "B",
        exp: "In Java, all non-primitive instance variables that are object references are initialized to null by default."
    },
    {
        q: "Which concept allows a subclass to provide a specific implementation of a method that is already provided by its parent class?",
        a: "Method Overloading",
        b: "Method Overriding",
        c: "Encapsulation",
        d: "Abstraction",
        ans: "B",
        exp: "Method overriding is a feature that allows a subclass to provide a specific implementation of a method that is already defined in its superclass."
    },
    {
        q: "What does the 'final' keyword indicate when applied to a class in Java?",
        a: "The class cannot be instantiated",
        b: "The class cannot be inherited",
        c: "The class has no methods",
        d: "The class is abstract",
        ans: "B",
        exp: "A 'final' class in Java cannot be subclassed (inherited from), ensuring its implementation cannot be changed or extended."
    },
    {
        q: "Which OOP principle is primarily achieved using access specifiers like private, protected, and public?",
        a: "Inheritance",
        b: "Polymorphism",
        c: "Encapsulation",
        d: "Composition",
        ans: "C",
        exp: "Encapsulation is the bundling of data and methods that operate on that data, restricting direct access using visibility modifiers."
    },
    {
        q: "What is an 'Interface' in object-oriented programming?",
        a: "A concrete class",
        b: "A blueprint for a class that contains only abstract methods (mostly)",
        c: "A way to achieve multiple inheritance of state",
        d: "A type of constructor",
        ans: "B",
        exp: "An interface defines a contract or a set of methods that a class must implement, allowing for a form of multiple inheritance in languages like Java."
    },
    {
        q: "Which member of a class can be accessed without creating an instance of that class?",
        a: "Private member",
        b: "Instance member",
        c: "Static member",
        d: "Protected member",
        ans: "C",
        exp: "Static members belong to the class itself rather than any specific object, so they can be accessed using the class name."
    },
    {
        q: "What is 'Dynamic Binding'?",
        a: "Binding at compile time",
        b: "Connecting a method call to its body at runtime",
        c: "Allocating memory at runtime",
        d: "Defining variables in a script",
        ans: "B",
        exp: "Dynamic binding (or late binding) occurs at runtime based on the actual type of the object, typically used for polymorphic method calls."
    },
    {
        q: "In C++, what is a 'Pure Virtual Function'?",
        a: "A function with no return type",
        b: "A function declared with '= 0'",
        c: "A function that cannot be inherited",
        d: "A static function",
        ans: "B",
        exp: "A pure virtual function is a function that has no implementation in the base class and must be overridden in derived classes, making the class abstract."
    },
    {
        q: "What is 'Aggregation' in the context of OOP?",
        a: "A 'is-a' relationship",
        b: "A weak 'has-a' relationship where the child can exist independently of the parent",
        c: "A strong 'has-a' relationship where the child depends on the parent",
        d: "Multiple inheritance",
        ans: "B",
        exp: "Aggregation represents a 'has-a' relationship where the contained object can survive independently of the container (e.g., a Department has Professors)."
    },
    {
        q: "Which of the following is NOT true about a constructor?",
        a: "It has the same name as the class",
        b: "It does not have a return type",
        c: "It can be inherited",
        d: "It can be overloaded",
        ans: "C",
        exp: "Constructors are not inherited by subclasses. Instead, they are called during the initialization of the subclass object."
    },
    {
        q: "What is the 'this' keyword used for in most OOP languages?",
        a: "To refer to the current object instance",
        b: "To create a new object",
        c: "To refer to the static class",
        d: "To delete an object",
        ans: "A",
        exp: "The 'this' keyword is a reference variable that refers to the current object, often used to resolve naming conflicts between instance variables and parameters."
    },
    {
        q: "Which of these is a benefit of 'Abstraction'?",
        a: "Increases code complexity",
        b: "Reduces programming effort and complexity by hiding details",
        c: "Prevents code reuse",
        d: "Makes debugging harder",
        ans: "B",
        exp: "Abstraction hides complex implementation details and only reveals the essential features, making the system easier to understand and maintain."
    },
    {
        q: "What is 'Composition' in OOP?",
        a: "A way to group primitive types",
        b: "A strong 'has-a' relationship where the life of the child is tied to the parent",
        c: "Another name for Inheritance",
        d: "A way to hide data",
        ans: "B",
        exp: "Composition is a strict 'has-a' relationship where the sub-objects cannot exist without the container object (e.g., a House has Rooms)."
    },
    {
        q: "Which feature allows us to create a hierarchy of classes?",
        a: "Polymorphism",
        b: "Inheritance",
        c: "Encapsulation",
        d: "Coupling",
        ans: "B",
        exp: "Inheritance allows a class (subclass) to acquire properties and behavior from another class (superclass), forming a hierarchical tree."
    },
    {
        q: "What is 'Message Passing' in OOP?",
        a: "Copying variables between functions",
        b: "The process of communicating by calling methods on objects",
        c: "A network protocol",
        d: "Sending data to a database",
        ans: "B",
        exp: "In OOP, objects communicate with each other primarily by calling methods on one another, which is referred to as message passing."
    },
    {
        q: "What is a 'Friend Function' in C++?",
        a: "A function that is a member of every class",
        b: "A non-member function that has access to private and protected members of a class",
        c: "A function that only works with global variables",
        d: "A function inherited by all subclasses",
        ans: "B",
        exp: "A friend function can access private and protected data of a class even though it is not a member of that class."
    },
    {
        q: "Which type of polymorphism is also known as 'Static Binding'?",
        a: "Method Overriding",
        b: "Method Overloading",
        c: "Interface Implementation",
        d: "Dynamic Binding",
        ans: "B",
        exp: "Method overloading (and operator overloading) are resolved at compile time, which is known as static binding."
    },
    {
        q: "In Java, can an interface have a body for its methods?",
        a: "Never",
        b: "Yes, using 'default' or 'static' keywords",
        c: "Only for constructors",
        d: "Only in private sections",
        ans: "B",
        exp: "Since Java 8, interfaces can have default and static methods that include an implementation body."
    },
    {
        q: "What is the purpose of the 'super' keyword in Java?",
        a: "To call the constructor of the current class",
        b: "To refer to the immediate parent class object",
        c: "To make a class final",
        d: "To create a global variable",
        ans: "B",
        exp: "The 'super' keyword refers to the immediate superclass of the current class, used to call parent constructors or access overridden methods."
    },
    {
        q: "What is an 'Anonymous Inner Class'?",
        a: "A class with no name defined inside another class",
        b: "A class that cannot be accessed",
        c: "A global class",
        d: "A class defined in a separate file",
        ans: "A",
        exp: "An anonymous inner class is a class defined without a name, typically used to override a few methods for a single-use object."
    },
    {
        q: "Which OOP concept involves hiding the internal state and requiring all interaction to be performed through an object's methods?",
        a: "Abstraction",
        b: "Encapsulation",
        c: "Inheritance",
        d: "Polymorphism",
        ans: "B",
        exp: "Encapsulation keeps data fields private and provides public getter and setter methods, controlling how data is accessed and modified."
    },
    {
        q: "What is 'Hybrid Inheritance'?",
        a: "Inheriting from a single class",
        b: "A combination of two or more types of inheritance",
        c: "Inheriting from multiple parents",
        d: "Creating an object from an interface",
        ans: "B",
        exp: "Hybrid inheritance is a complex structure that combines different inheritance types (e.g., Hierarchical and Multiple) into one tree."
    },
    {
        q: "Which specific concept is used to represent the 'is-a' relationship?",
        a: "Encapsulation",
        b: "Inheritance",
        c: "Aggregation",
        d: "Association",
        ans: "B",
        exp: "Inheritance represents the 'is-a' relationship (e.g., a Dog *is a* Mammal)."
    },
    {
        q: "What happens if a class has no constructor defined in Java?",
        a: "The program fails to compile",
        b: "The JVM provides a default no-argument constructor",
        c: "The class cannot be instantiated",
        d: "All fields are left uninitialized",
        ans: "B",
        exp: "If no constructor is explicitly provided, the compiler automatically generates a default no-argument constructor for the class."
    },
    {
        q: "What is the main advantage of 'Polymorphism'?",
        a: "Reduces memory usage",
        b: "Allows one interface to be used for multiple underlying forms",
        c: "Makes variables global",
        d: "Speeds up compilation",
        ans: "B",
        exp: "Polymorphism allows common operations to be defined in a base class and specialized behavior to be implemented in derived classes, using the same name."
    },
    {
        q: "Which of the following describes 'Loose Coupling'?",
        a: "Classes are highly dependent on each other",
        b: "Classes have minimal knowledge of each other and interact through stable interfaces",
        c: "Classes are all defined in one file",
        d: "Methods use global variables only",
        ans: "B",
        exp: "Loose coupling ensures that changes in one part of the system have minimal impact on other parts, improving maintainability."
    },
    {
        q: "What is 'Method Overloading'?",
        a: "Methods with same name but different parameters in the same class",
        b: "Methods with same name and same parameters in different classes",
        c: "A method that takes too many arguments",
        d: "A recursive method",
        ans: "A",
        exp: "Method overloading allows multiple methods in the same class to share the same name if they have different parameter lists (type, number, or order)."
    },
    {
        q: "Which keyword is used in C++ for data abstraction through classes?",
        a: "public",
        b: "abstract",
        c: "virtual",
        d: "class",
        ans: "D",
        exp: "The 'class' keyword is the fundamental building block in C++ that enables encapsulation and abstraction by grouping data and methods."
    },
    {
        q: "What is 'Cohesion' in software design?",
        a: "How strongly related the responsibilities of a single module are",
        b: "The number of links between modules",
        c: "The speed of execution",
        d: "The amount of documentation",
        ans: "A",
        exp: "High cohesion means a module or class has a focused set of related responsibilities, which is highly desirable in good OOP design."
    }
];

(async () => {
    try {
        console.log(`Seeding ${oopQuestions.length} NEW OOP questions...`);

        let inserted = 0;
        for (const q of oopQuestions) {
            await pool.query(
                `INSERT INTO questions (question_text, option_a, option_b, option_c, option_d, correct_option, explanation) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [q.q, q.a, q.b, q.c, q.d, q.ans, q.exp]
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
