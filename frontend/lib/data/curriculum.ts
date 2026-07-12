import type { Course, LearningPath, Lesson, Module } from "@/types";

// ── Lesson: Classes and Objects ───────────────────────────────────────────────

export const classesAndObjectsLesson: Lesson = {
  id: "oop-101",
  moduleId: "oop-mod-1",
  order: 1,
  slug: "classes-and-objects",
  title: "Classes and Objects in Java",
  description: "Master the foundation of OOP by understanding how to model real-world entities as Java classes and objects.",
  difficulty: "beginner",
  estimatedMin: 45,
  type: "concept",
  objectives: [
    "Understand what a class is and how it acts as a blueprint",
    "Create objects (instances) from a class",
    "Define fields (state) and methods (behavior)",
    "Understand constructors and how objects are initialized",
    "Trace object creation and method calls line by line",
    "Visualize how objects live on the heap while references live on the stack",
    "Apply these concepts to a real-world BankAccount example",
  ],
  content: {
    sections: [
      {
        id: "s1",
        type: "explanation",
        title: "What Is a Class?",
        body: "In the real world, a **BankAccount** has an account holder, a balance, and behaviors like depositing and withdrawing money. In Java, a **class** is the blueprint that describes these properties and behaviors. You define it once and create as many instances (objects) as you need.",
      },
      {
        id: "s1b",
        type: "explanation",
        title: "Class vs Object: the mental model",
        body: "**Class** means the design. It tells Java what data should exist and what actions are allowed.\n\n**Object** means the real instance created from that design. It has actual values like `Alice`, `5000.00`, or `ACTIVE`.\n\n- One class can create many objects\n- Every object follows the same structure\n- Each object owns its own independent state",
      },
      {
        id: "s2",
        type: "code",
        title: "Basic Class Syntax",
        body: "Here is the structure of a Java class:",
        code: {
          language: "java",
          fileName: "BankAccount.java",
          code: `public class BankAccount {
    // Fields (state)
    private String accountHolder;
    private double balance;

    // Constructor - called when creating a new object
    public BankAccount(String accountHolder, double initialBalance) {
        this.accountHolder = accountHolder;
        this.balance = initialBalance;
    }

    // Method - behavior
    public void deposit(double amount) {
        if (amount <= 0) throw new IllegalArgumentException("Amount must be positive");
        balance += amount;
        System.out.println("Deposited ₹" + amount + " | New balance: ₹" + balance);
    }

    public void withdraw(double amount) {
        if (amount > balance) throw new IllegalStateException("Insufficient funds");
        balance -= amount;
        System.out.println("Withdrawn ₹" + amount + " | New balance: ₹" + balance);
    }

    public void printBalance() {
        System.out.println(accountHolder + "'s balance: ₹" + balance);
    }
}`,
          runnable: false,
          highlight: [2, 3, 6, 7, 8, 11, 16, 22, 27],
        },
      },
      {
        id: "s3",
        type: "code",
        title: "Creating Objects",
        body: "Use the `new` keyword to create objects from your class:",
        code: {
          language: "java",
          fileName: "Main.java",
          code: `public class Main {
    public static void main(String[] args) {
        // Creating objects (instances)
        BankAccount alice = new BankAccount("Alice", 5000.00);
        BankAccount bob   = new BankAccount("Bob", 1000.00);

        // Each object has its OWN state
        alice.deposit(2000);    // Alice: ₹7000
        bob.withdraw(500);      // Bob:   ₹500

        alice.printBalance();   // Alice's balance: ₹7000
        bob.printBalance();     // Bob's balance: ₹500
    }
}`,
          runnable: true,
          output: `Deposited ₹2000.0 | New balance: ₹7000.0
Withdrawn ₹500.0 | New balance: ₹500.0
Alice's balance: ₹7000.0
Bob's balance: ₹500.0`,
        },
      },
      {
        id: "s4",
        type: "visual",
        title: "Stack vs. Heap Visualization",
        body: "When you write `BankAccount alice = new BankAccount(...)`, the **reference** (alice) lives on the Stack, while the actual object data lives on the **Heap**.",
        visual: "StackHeapVisual",
      },
      {
        id: "s3b",
        type: "callout",
        title: "What Java is doing in real time",
        body: "1. Java reads `new BankAccount(\"Alice\", 5000.00)` and creates a new object on the Heap.\n2. The constructor runs and stores the initial values inside that object.\n3. The variable `alice` keeps a reference to the object so Java can find it later.\n4. `alice.deposit(2000)` updates only Alice's object, not Bob's.\n5. Every method call changes object state according to the rules defined in the class.",
      },
      {
        id: "s5",
        type: "realworld",
        title: "Real-World Application",
        body: "Classes are used everywhere in production Java:\n- **Spring Boot**: `@Entity` classes map directly to database tables\n- **E-commerce**: `Product`, `Order`, `Customer` are all classes\n- **Banking apps**: `Account`, `Transaction`, `Card` model business entities\n- **Automation**: `WebDriver`, `PageObject` are class instances in Selenium",
      },
      {
        id: "s6",
        type: "callout",
        title: "Common Mistakes",
        body: "1. **Forgetting `new`**: `BankAccount a = BankAccount()` won't compile.\n2. **Accessing fields directly**: Always use methods (encapsulation) — don't make fields `public`.\n3. **Not using `this`**: In constructors, use `this.field = field` when names clash.\n4. **NullPointerException**: Calling methods on an uninitialized reference (`BankAccount a = null; a.deposit(100);`).",
      },
      {
        id: "s5b",
        type: "realworld",
        title: "Second practical example: food delivery order",
        body: "A delivery app might have an `Order` class with fields like `orderId`, `customerName`, `items`, and `status`.\n- `addItem()` changes what the customer ordered\n- `markPaid()` updates payment state\n- `assignRider()` connects the order to delivery logistics\n\nThis is the same idea as `BankAccount`: data and behavior stay together inside one object.",
      },
      {
        id: "s7",
        type: "explanation",
        title: "How to design your own class",
        body: "When you design a class, ask four questions:\n- What real thing am I modeling?\n- What information must this thing remember?\n- What actions should this thing perform safely?\n- What rules must never be broken?\n\nIf you can answer those clearly, your class usually becomes easier to write, test, and extend.",
      },
    ],
    exercises: [
      {
        id: "ex-1",
        lessonId: "oop-101",
        title: "Build a BankAccount Class",
        description: "Create a complete BankAccount class with proper encapsulation and error handling.",
        instructions: `Create a \`BankAccount\` class with the following requirements:

**Fields:**
- \`accountHolder\` (String) - private
- \`balance\` (double) - private, cannot go negative

**Constructor:**
- \`BankAccount(String accountHolder, double initialBalance)\`

**Methods:**
- \`deposit(double amount)\` - adds to balance, throws exception if amount ≤ 0
- \`withdraw(double amount)\` - subtracts from balance, throws exception if insufficient funds
- \`getBalance()\` - returns current balance
- \`printStatement()\` - prints holder name and balance

Create a \`Main\` class and test your implementation.`,
        starterCode: `public class BankAccount {
    // TODO: Add private fields
    
    // TODO: Add constructor
    
    // TODO: Add deposit method
    
    // TODO: Add withdraw method
    
    // TODO: Add getBalance method
    
    // TODO: Add printStatement method
}

class Main {
    public static void main(String[] args) {
        BankAccount account = new BankAccount("Alice", 5000.00);
        account.deposit(2000.00);
        account.withdraw(500.00);
        account.printStatement();
        System.out.println("Balance: " + account.getBalance());
    }
}`,
        solutionCode: `public class BankAccount {
    private String accountHolder;
    private double balance;

    public BankAccount(String accountHolder, double initialBalance) {
        this.accountHolder = accountHolder;
        this.balance = Math.max(0, initialBalance);
    }

    public void deposit(double amount) {
        if (amount <= 0) throw new IllegalArgumentException("Deposit amount must be positive");
        balance += amount;
    }

    public void withdraw(double amount) {
        if (amount <= 0) throw new IllegalArgumentException("Withdrawal amount must be positive");
        if (amount > balance) throw new IllegalStateException("Insufficient funds");
        balance -= amount;
    }

    public double getBalance() { return balance; }

    public void printStatement() {
        System.out.println("Account Holder: " + accountHolder);
        System.out.println("Current Balance: " + balance);
    }
}

class Main {
    public static void main(String[] args) {
        BankAccount account = new BankAccount("Alice", 5000.00);
        account.deposit(2000.00);
        account.withdraw(500.00);
        account.printStatement();
        System.out.println("Balance: " + account.getBalance());
    }
}`,
        testCases: [
          { id: "tc1", exerciseId: "ex-1", description: "Object creation", expected: "6500.0", isHidden: false },
          { id: "tc2", exerciseId: "ex-1", description: "Balance after deposit and withdraw", expected: "6500.0", isHidden: false },
          { id: "tc3", exerciseId: "ex-1", description: "getBalance returns correct value", expected: "6500.0", isHidden: true },
          { id: "tc4", exerciseId: "ex-1", description: "Throws on insufficient funds", expected: "IllegalStateException", isHidden: true },
        ],
        hints: [
          "Start with the fields — what data does a bank account need to track?",
          "Use `this.fieldName = paramName` in the constructor to avoid ambiguity.",
          "In the withdraw method, check `if (amount > balance)` before subtracting.",
          "Your `getBalance()` method just needs to `return balance;`",
        ],
        difficulty: "beginner",
      },
    ],
    quiz: {
      id: "q-oop-101",
      lessonId: "oop-101",
      title: "Classes and Objects Quiz",
      questions: [
        {
          id: "q1",
          type: "mcq",
          question: "What is the relationship between a class and an object in Java?",
          options: [
            { id: "a", text: "A class is a blueprint; an object is an instance created from it", isCorrect: true },
            { id: "b", text: "An object is a blueprint; a class is an instance of the object", isCorrect: false },
            { id: "c", text: "Classes and objects are the same thing", isCorrect: false },
            { id: "d", text: "A class can only create one object", isCorrect: false },
          ],
          explanation: "A **class** defines the structure and behavior (like a blueprint or mold). An **object** is a concrete instance created from that class using `new`. Multiple objects can be created from the same class, each with its own state.",
          difficulty: "beginner",
        },
        {
          id: "q2",
          type: "code_output",
          question: "What does this code print?",
          code: `BankAccount a = new BankAccount("Alice", 1000);
BankAccount b = new BankAccount("Bob", 2000);
a.deposit(500);
System.out.println(a.getBalance() + " " + b.getBalance());`,
          options: [
            { id: "a", text: "1500.0 2000.0", isCorrect: true },
            { id: "b", text: "1500.0 2500.0", isCorrect: false },
            { id: "c", text: "1000.0 2000.0", isCorrect: false },
            { id: "d", text: "2000.0 2000.0", isCorrect: false },
          ],
          explanation: "Each object (`a` and `b`) has its **own independent state**. When `a.deposit(500)` is called, only `a`'s balance changes from 1000 to 1500. `b`'s balance remains 2000. This is a core principle of OOP — each object encapsulates its own data.",
          difficulty: "beginner",
        },
        {
          id: "q3",
          type: "mcq",
          question: "Where in memory are object instances stored in Java?",
          options: [
            { id: "a", text: "Stack", isCorrect: false },
            { id: "b", text: "Heap", isCorrect: true },
            { id: "c", text: "Method area", isCorrect: false },
            { id: "d", text: "Code segment", isCorrect: false },
          ],
          explanation: "In Java, **objects are allocated on the Heap**. The Stack holds the **reference variables** (like `alice`, `bob`) that point to these heap objects. When you write `BankAccount alice = new BankAccount(...)`, the variable `alice` (a reference) goes on the stack, but the actual `BankAccount` object lives on the heap.",
          difficulty: "beginner",
        },
      ],
    },
    summary: "You've learned that a **class** is a blueprint defining fields (state) and methods (behavior). An **object** is a living instance of a class created with `new`. You also traced what happens in real time when Java creates an object, runs a constructor, and updates object state through method calls. Objects store their data on the **Heap** while references live on the **Stack**. Proper **encapsulation** means keeping fields `private` and exposing them through public methods.",
    nextLesson: "constructors-and-this-keyword",
  },
};

// ── Courses ───────────────────────────────────────────────────────────────────

export const courses: Course[] = [
  {
    id: "java-foundations",
    slug: "java-foundations",
    pathId: "core-java",
    title: "Programming Foundations with Java",
    description: "Start your Java journey from absolute zero. Learn how Java works, set up your environment, and build real programs from day one.",
    icon: "🏗️",
    difficulty: "beginner",
    duration: "12 hours",
    lessonCount: 28,
    exerciseCount: 42,
    tags: ["variables", "loops", "methods", "arrays", "strings"],
    prerequisites: [],
    objectives: [
      "Understand how Java compiles and runs code via JVM",
      "Write and run your first Java program",
      "Use variables, data types, and operators",
      "Control program flow with conditions and loops",
      "Create reusable methods and work with arrays",
      "Build small, real-world programs",
    ],
    modules: [
      {
        id: "f-mod-1",
        courseId: "java-foundations",
        order: 1,
        title: "Getting Started with Java",
        description: "Set up your environment and write your first program.",
        lessons: [
          { id: "f-1", moduleId: "f-mod-1", order: 1, slug: "how-java-works", title: "How Java Works", description: "JDK, JRE, JVM explained", difficulty: "beginner", estimatedMin: 15, type: "concept", objectives: [], isFree: true },
          { id: "f-2", moduleId: "f-mod-1", order: 2, slug: "first-java-program", title: "Your First Java Program", description: "Hello World and beyond", difficulty: "beginner", estimatedMin: 20, type: "exercise", objectives: [], isFree: true },
          { id: "f-3", moduleId: "f-mod-1", order: 3, slug: "variables-and-types", title: "Variables & Data Types", description: "int, String, double, boolean", difficulty: "beginner", estimatedMin: 30, type: "concept", objectives: [] },
          { id: "f-4", moduleId: "f-mod-1", order: 4, slug: "operators", title: "Operators & Expressions", description: "Arithmetic, logical, comparison", difficulty: "beginner", estimatedMin: 25, type: "exercise", objectives: [] },
        ],
      },
      {
        id: "f-mod-2",
        courseId: "java-foundations",
        order: 2,
        title: "Control Flow",
        description: "Make decisions and repeat actions in your programs.",
        lessons: [
          { id: "f-5", moduleId: "f-mod-2", order: 1, slug: "if-else", title: "Conditionals: if/else/switch", description: "Make decisions in code", difficulty: "beginner", estimatedMin: 30, type: "concept", objectives: [] },
          { id: "f-6", moduleId: "f-mod-2", order: 2, slug: "loops", title: "Loops: for, while, do-while", description: "Repeat actions efficiently", difficulty: "beginner", estimatedMin: 35, type: "exercise", objectives: [] },
          { id: "f-7", moduleId: "f-mod-2", order: 3, slug: "nested-loops", title: "Nested Loops & Patterns", description: "Complex iteration patterns", difficulty: "beginner", estimatedMin: 25, type: "challenge", objectives: [] },
        ],
      },
      {
        id: "f-mod-3",
        courseId: "java-foundations",
        order: 3,
        title: "Methods & Arrays",
        description: "Organize code into reusable methods and work with collections of data.",
        lessons: [
          { id: "f-8", moduleId: "f-mod-3", order: 1, slug: "methods", title: "Methods & Parameters", description: "Code reuse and abstraction", difficulty: "beginner", estimatedMin: 35, type: "concept", objectives: [] },
          { id: "f-9", moduleId: "f-mod-3", order: 2, slug: "arrays", title: "Arrays", description: "Store multiple values", difficulty: "beginner", estimatedMin: 30, type: "exercise", objectives: [] },
          { id: "f-10", moduleId: "f-mod-3", order: 3, slug: "strings", title: "Working with Strings", description: "Text manipulation", difficulty: "beginner", estimatedMin: 30, type: "exercise", objectives: [] },
          { id: "f-11", moduleId: "f-mod-3", order: 4, slug: "mini-project-calculator", title: "Project: Calculator App", description: "Build a CLI calculator", difficulty: "beginner", estimatedMin: 60, type: "project", objectives: [] },
        ],
      },
    ],
  },
  {
    id: "java-oop",
    slug: "java-oop",
    pathId: "core-java",
    title: "Object-Oriented Programming in Java",
    description: "Master OOP by building real-world systems: bank accounts, employee management, payment gateways, and vehicle rentals.",
    icon: "🧩",
    difficulty: "beginner",
    duration: "16 hours",
    lessonCount: 34,
    exerciseCount: 58,
    tags: ["classes", "objects", "inheritance", "polymorphism", "encapsulation", "interfaces"],
    prerequisites: ["java-foundations"],
    objectives: [
      "Create classes that model real-world entities",
      "Apply the four pillars of OOP",
      "Use inheritance to build class hierarchies",
      "Implement interfaces and abstract classes",
      "Apply access modifiers for proper encapsulation",
    ],
    modules: [
      {
        id: "oop-mod-1",
        courseId: "java-oop",
        order: 1,
        title: "Classes and Objects",
        description: "Build the foundation of OOP thinking.",
        lessons: [classesAndObjectsLesson],
      },
      {
        id: "oop-mod-2",
        courseId: "java-oop",
        order: 2,
        title: "Encapsulation & Access Control",
        description: "Protect your data with proper encapsulation.",
        lessons: [
          { id: "oop-2", moduleId: "oop-mod-2", order: 1, slug: "encapsulation", title: "Encapsulation & Getters/Setters", description: "Data hiding principles", difficulty: "beginner", estimatedMin: 35, type: "concept", objectives: [] },
          { id: "oop-3", moduleId: "oop-mod-2", order: 2, slug: "constructors", title: "Constructors Deep Dive", description: "Constructor overloading, chaining", difficulty: "beginner", estimatedMin: 30, type: "exercise", objectives: [] },
        ],
      },
      {
        id: "oop-mod-3",
        courseId: "java-oop",
        order: 3,
        title: "Inheritance & Polymorphism",
        description: "Build class hierarchies and polymorphic behavior.",
        lessons: [
          { id: "oop-4", moduleId: "oop-mod-3", order: 1, slug: "inheritance", title: "Inheritance: extends keyword", description: "Employee → Manager hierarchy", difficulty: "intermediate", estimatedMin: 40, type: "concept", objectives: [] },
          { id: "oop-5", moduleId: "oop-mod-3", order: 2, slug: "polymorphism", title: "Polymorphism & Method Overriding", description: "Runtime vs compile-time", difficulty: "intermediate", estimatedMin: 40, type: "exercise", objectives: [] },
          { id: "oop-6", moduleId: "oop-mod-3", order: 3, slug: "abstract-classes", title: "Abstract Classes", description: "Partial blueprints", difficulty: "intermediate", estimatedMin: 35, type: "concept", objectives: [] },
          { id: "oop-7", moduleId: "oop-mod-3", order: 4, slug: "interfaces", title: "Interfaces & Payment Gateway", description: "Contracts for behavior", difficulty: "intermediate", estimatedMin: 45, type: "exercise", objectives: [] },
        ],
      },
    ],
  },
  {
    id: "java-intermediate",
    slug: "java-intermediate",
    pathId: "core-java",
    title: "Intermediate Java Programming",
    description: "Level up with lambdas, streams, exception handling, generics, and the modern Java API.",
    icon: "⚡",
    difficulty: "intermediate",
    duration: "20 hours",
    lessonCount: 38,
    exerciseCount: 65,
    tags: ["streams", "lambdas", "exceptions", "generics", "optional", "records"],
    prerequisites: ["java-oop"],
    objectives: [],
    modules: [],
  },
  {
    id: "java-collections",
    slug: "java-collections",
    pathId: "core-java",
    title: "Java Collections Framework",
    description: "Master ArrayList, HashMap, TreeSet, Queue and more with real-world inventory, shopping cart, and ordering systems.",
    icon: "📦",
    difficulty: "intermediate",
    duration: "14 hours",
    lessonCount: 26,
    exerciseCount: 44,
    tags: ["list", "map", "set", "queue", "iterator", "comparator"],
    prerequisites: ["java-intermediate"],
    objectives: [],
    modules: [],
  },
  {
    id: "java-spring-boot",
    slug: "java-spring-boot",
    pathId: "backend",
    title: "Spring Boot & REST API Development",
    description: "Build production-grade REST APIs with Spring Boot, Spring Data JPA, Spring Security, and JWT authentication.",
    icon: "🌱",
    difficulty: "advanced",
    duration: "30 hours",
    lessonCount: 52,
    exerciseCount: 78,
    tags: ["spring", "rest-api", "jpa", "security", "jwt", "swagger"],
    prerequisites: ["java-intermediate", "java-jdbc"],
    objectives: [],
    modules: [],
  },
  {
    id: "java-dsa",
    slug: "java-dsa",
    pathId: "dsa",
    title: "Data Structures & Algorithms in Java",
    description: "Build DSA intuition with visual explanations, Java implementations, complexity analysis, and interview problems.",
    icon: "🌳",
    difficulty: "intermediate",
    duration: "25 hours",
    lessonCount: 48,
    exerciseCount: 90,
    tags: ["arrays", "trees", "graphs", "sorting", "dynamic-programming", "recursion"],
    prerequisites: ["java-collections"],
    objectives: [],
    modules: [],
  },
  {
    id: "java-testing",
    slug: "java-testing",
    pathId: "testing",
    title: "Testing & Test Automation in Java",
    description: "Build professional test suites with JUnit 5, Mockito, REST Assured, and Selenium WebDriver.",
    icon: "🧪",
    difficulty: "intermediate",
    duration: "18 hours",
    lessonCount: 32,
    exerciseCount: 55,
    tags: ["junit5", "mockito", "selenium", "rest-assured", "testng", "ci-cd"],
    prerequisites: ["java-intermediate"],
    objectives: [],
    modules: [],
  },
];

export const learningPaths: LearningPath[] = [
  {
    id: "core-java",
    slug: "core-java",
    title: "Core Java Developer",
    description: "From zero to job-ready Java developer. Master fundamentals, OOP, collections, streams, and advanced Java concepts.",
    icon: "☕",
    color: "#f97316",
    totalHours: 80,
    courseCount: 6,
    difficulty: "beginner",
    courses: courses.filter(c => ["java-foundations", "java-oop", "java-intermediate", "java-collections", "java-advanced", "java-jdbc"].includes(c.id)),
    tags: ["Core Java", "OOP", "Streams", "Collections"],
  },
  {
    id: "backend",
    slug: "backend",
    title: "Spring Boot Backend Developer",
    description: "Build production REST APIs with Spring Boot, JPA, Security, and microservices architecture.",
    icon: "🌱",
    color: "#84cc16",
    totalHours: 120,
    courseCount: 4,
    difficulty: "advanced",
    courses: courses.filter(c => ["java-spring-boot", "java-microservices"].includes(c.id)),
    tags: ["Spring Boot", "REST API", "JPA", "Microservices"],
  },
  {
    id: "dsa",
    slug: "dsa",
    title: "DSA & Interview Preparation",
    description: "Master data structures, algorithms, and prepare for top company interviews with 200+ practice problems.",
    icon: "🎯",
    color: "#06b6d4",
    totalHours: 60,
    courseCount: 2,
    difficulty: "intermediate",
    courses: courses.filter(c => ["java-dsa"].includes(c.id)),
    tags: ["DSA", "Algorithms", "Interview", "Complexity"],
  },
  {
    id: "testing",
    slug: "testing",
    title: "Java Test Automation Engineer",
    description: "Become a professional SDET with JUnit, Mockito, Selenium, REST Assured, and CI/CD pipelines.",
    icon: "🧪",
    color: "#10b981",
    totalHours: 50,
    courseCount: 2,
    difficulty: "intermediate",
    courses: courses.filter(c => ["java-testing"].includes(c.id)),
    tags: ["JUnit", "Selenium", "REST Assured", "TestNG"],
  },
];
