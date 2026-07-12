export interface LearningStep {
  title: string;
  detail: string;
}

export interface LearningExample {
  title: string;
  scenario: string;
  takeaway: string;
}

export interface LearningGuide {
  summary: string;
  whyItMatters: string;
  realTimeExplanation: LearningStep[];
  example: LearningExample;
  outcomes: string[];
  commonMistakes?: string[];
}

export const courseGuides: Record<string, LearningGuide> = {
  "java-foundations": {
    summary: "This course turns programming from syntax memorization into predictable problem solving. Learners understand what Java does when code compiles, runs, branches, loops, and calls methods.",
    whyItMatters: "Every advanced Java topic depends on these basics. If variables, control flow, and methods feel natural, OOP, collections, Spring, and testing become much easier to learn.",
    realTimeExplanation: [
      {
        title: "Read the problem",
        detail: "Start by identifying the input, the rule, and the expected output. This trains learners to think like a developer before writing syntax.",
      },
      {
        title: "Translate logic into Java statements",
        detail: "Learners map plain-English decisions into variables, conditions, loops, and methods so code becomes a representation of reasoning.",
      },
      {
        title: "Run, inspect, and improve",
        detail: "Each lesson should show what changes in memory, output, or flow after every line so beginners understand cause and effect in real time.",
      },
    ],
    example: {
      title: "Electricity bill calculator",
      scenario: "A learner reads units consumed, applies rate slabs with if/else logic, uses variables for totals, and prints a final bill summary.",
      takeaway: "This shows how fundamentals solve a real business rule instead of only printing Hello World.",
    },
    outcomes: [
      "Write Java programs from scratch with confidence",
      "Break problems into steps before coding",
      "Debug beginner mistakes like wrong conditions or loop boundaries",
    ],
    commonMistakes: [
      "Jumping into syntax before understanding the input-output flow",
      "Treating loops as magic instead of tracing each iteration",
      "Writing long code blocks without extracting reusable methods",
    ],
  },
  "java-oop": {
    summary: "This course teaches learners how to model real systems with classes, objects, encapsulation, inheritance, interfaces, and clean responsibilities.",
    whyItMatters: "Most production Java code is object-oriented. OOP is how teams represent accounts, orders, users, invoices, payments, and services in a maintainable way.",
    realTimeExplanation: [
      {
        title: "Start from a real object",
        detail: "Pick something tangible like a bank account or employee record and identify its data, actions, and business rules.",
      },
      {
        title: "Model it with a class",
        detail: "Turn the data into fields and the actions into methods, then explain why private fields and constructors protect object integrity.",
      },
      {
        title: "Scale to systems",
        detail: "Show how inheritance, polymorphism, and interfaces help multiple object types cooperate without hard-coded branching everywhere.",
      },
    ],
    example: {
      title: "Order management flow",
      scenario: "An Order class owns line items, a PaymentGateway interface supports multiple payment providers, and different order states drive different behaviors.",
      takeaway: "Learners see how OOP keeps complex business logic organized instead of mixing everything into one main method.",
    },
    outcomes: [
      "Design classes that match real business concepts",
      "Explain the four pillars of OOP with code",
      "Read and extend larger Java codebases with less confusion",
    ],
    commonMistakes: [
      "Making every field public and skipping encapsulation",
      "Using inheritance when composition would be simpler",
      "Creating god classes with too many responsibilities",
    ],
  },
  "java-intermediate": {
    summary: "This course helps learners move from working Java to modern Java by introducing exceptions, generics, Optional, records, lambdas, and streams.",
    whyItMatters: "Intermediate Java is where code becomes cleaner, safer, and more expressive. These tools are common in enterprise applications and interviews.",
    realTimeExplanation: [
      {
        title: "Spot repetitive code",
        detail: "Start with verbose code and show why manual loops, unchecked casts, and broad try/catch blocks become difficult to maintain.",
      },
      {
        title: "Introduce the modern feature",
        detail: "Explain the exact pain point a feature solves, such as generics removing casts or streams simplifying collection transformations.",
      },
      {
        title: "Compare old vs new",
        detail: "Learners understand modern Java best when they can compare traditional code with the modern equivalent line by line.",
      },
    ],
    example: {
      title: "Filtering premium customers",
      scenario: "A list of customers is filtered, sorted, and mapped into a report using streams instead of manual loops and temporary lists.",
      takeaway: "This makes stream pipelines feel practical rather than academic.",
    },
    outcomes: [
      "Write safer code with exceptions and generics",
      "Use streams and lambdas for common transformations",
      "Recognize when modern Java improves readability",
    ],
  },
  "java-collections": {
    summary: "This course explains how to choose the right data structure for the problem and how collections change performance, readability, and correctness.",
    whyItMatters: "Real applications constantly group, search, sort, cache, and deduplicate data. Collections are the backbone of those operations.",
    realTimeExplanation: [
      {
        title: "Define the job",
        detail: "Ask whether the program needs ordering, uniqueness, key lookup, queueing, or sorting before choosing a collection.",
      },
      {
        title: "Match the data structure",
        detail: "Explain why ArrayList, HashMap, Set, Queue, or TreeMap is a fit based on access pattern and constraints.",
      },
      {
        title: "Trace real mutations",
        detail: "Show inserts, deletes, and lookups step by step so the learner can predict collection behavior in real time.",
      },
    ],
    example: {
      title: "Shopping cart and inventory",
      scenario: "A cart uses a list for ordered items, inventory uses a map for product lookups, and a set tracks unique coupon codes.",
      takeaway: "The learner sees that collection choice comes from business needs, not memorization.",
    },
    outcomes: [
      "Choose the right collection for common problems",
      "Explain lookup vs ordering tradeoffs",
      "Use comparators and iterators with more confidence",
    ],
  },
  "java-spring-boot": {
    summary: "This course connects Java fundamentals to production backend development with controllers, services, repositories, JPA, security, and JWT-based APIs.",
    whyItMatters: "Spring Boot is one of the most common ways Java teams build APIs. Learners need to understand how requests move through a backend in real time.",
    realTimeExplanation: [
      {
        title: "Start from an HTTP request",
        detail: "A learner follows a request from controller to service to repository to database and back to the client as a JSON response.",
      },
      {
        title: "Separate responsibilities",
        detail: "Explain why controllers should orchestrate, services should hold business rules, and repositories should focus on persistence.",
      },
      {
        title: "Add production concerns",
        detail: "Introduce validation, authentication, error handling, and API documentation once the basic flow is clear.",
      },
    ],
    example: {
      title: "Task management REST API",
      scenario: "A client sends POST and GET requests to create and fetch tasks while Spring Boot validates input, persists data with JPA, and protects routes with JWT.",
      takeaway: "This turns abstract framework terms into a concrete backend workflow.",
    },
    outcomes: [
      "Build and explain REST APIs end to end",
      "Use layered architecture with confidence",
      "Understand how auth and persistence fit into API development",
    ],
  },
  "java-dsa": {
    summary: "This course builds algorithmic intuition by connecting data structures, complexity, and problem-solving patterns to real coding and interview work.",
    whyItMatters: "DSA sharpens problem solving for interviews and also improves everyday engineering decisions around performance and correctness.",
    realTimeExplanation: [
      {
        title: "Visualize the structure",
        detail: "Start by showing how data is stored and traversed so the learner understands the shape of the solution before code appears.",
      },
      {
        title: "Trace the algorithm",
        detail: "Walk through each iteration or recursive call with sample input to make state changes visible.",
      },
      {
        title: "Evaluate the tradeoff",
        detail: "Discuss time and space complexity after the learner already understands why the algorithm works.",
      },
    ],
    example: {
      title: "Delivery route planner",
      scenario: "A graph represents city stops and edges represent roads, then breadth-first search or Dijkstra-style thinking is used to find efficient routes.",
      takeaway: "Algorithms feel more real when tied to logistics or product behavior.",
    },
    outcomes: [
      "Explain algorithms with dry runs, not just final code",
      "Choose structures that fit the problem constraints",
      "Discuss complexity clearly in interviews",
    ],
  },
  "java-testing": {
    summary: "This course teaches learners how to verify Java code with unit, integration, API, and UI automation tests using tools teams use in production.",
    whyItMatters: "Testing is how teams ship safely. Strong Java developers are expected to validate behavior, isolate defects, and automate repetitive checks.",
    realTimeExplanation: [
      {
        title: "Define the behavior",
        detail: "Start by describing what must happen, what must never happen, and which inputs matter most.",
      },
      {
        title: "Choose the right test level",
        detail: "Use unit tests for logic, API tests for contracts, and UI tests for user flows so the learner sees purpose behind each tool.",
      },
      {
        title: "Read failures as feedback",
        detail: "Show how assertion failures, mock interactions, and logs tell a story about what broke and why.",
      },
    ],
    example: {
      title: "Login feature quality checks",
      scenario: "JUnit validates password rules, Mockito isolates the service layer, REST Assured tests the API, and Selenium verifies the visible login flow.",
      takeaway: "Learners understand how multiple test types cooperate around one real feature.",
    },
    outcomes: [
      "Write meaningful tests instead of brittle happy-path checks",
      "Choose JUnit, Mockito, REST Assured, or Selenium intentionally",
      "Debug failures without guessing",
    ],
  },
};

export const moduleGuides: Record<string, LearningGuide> = {
  "f-mod-1": {
    summary: "Learners understand what Java needs to compile and run, then write their first programs with confidence.",
    whyItMatters: "The JVM, JDK, and source-code flow stop feeling mysterious when learners see how each piece participates in execution.",
    realTimeExplanation: [
      { title: "Write source code", detail: "Create a simple class and explain what the file name and main method do." },
      { title: "Compile it", detail: "Show that the compiler checks syntax and turns .java into bytecode." },
      { title: "Run it on the JVM", detail: "Explain that the JVM executes the bytecode and produces visible output." },
    ],
    example: {
      title: "CLI greeting tool",
      scenario: "A learner runs a small app that prints a personalized greeting and starts to recognize the full write-compile-run cycle.",
      takeaway: "The first program becomes a process they understand, not a ritual they copy.",
    },
    outcomes: ["Set up Java locally", "Explain JDK vs JRE vs JVM", "Run small Java programs end to end"],
  },
  "f-mod-2": {
    summary: "This module teaches how programs make decisions and repeat work in a controlled way.",
    whyItMatters: "Every real program needs branching and repetition for validation, menu systems, billing, and processing records.",
    realTimeExplanation: [
      { title: "Check a condition", detail: "The program compares values and decides which branch to enter." },
      { title: "Repeat the action", detail: "A loop executes until the stopping rule becomes false." },
      { title: "Observe state changes", detail: "Each pass changes counters, totals, or indexes and learners trace those changes line by line." },
    ],
    example: {
      title: "ATM menu loop",
      scenario: "A user repeatedly chooses deposit, withdraw, or exit while conditions and loops keep the menu running safely.",
      takeaway: "Conditionals and loops feel real when they control a familiar workflow.",
    },
    outcomes: ["Use if/else with confidence", "Write predictable loops", "Avoid off-by-one mistakes by tracing state"],
  },
  "f-mod-3": {
    summary: "This module shows how to organize logic into reusable methods and how to work with groups of data using arrays and strings.",
    whyItMatters: "Without methods and basic collections, programs quickly become repetitive and hard to maintain.",
    realTimeExplanation: [
      { title: "Extract repeated logic", detail: "Move a repeated task into a method with clear inputs and outputs." },
      { title: "Store related values", detail: "Use arrays when many values of the same kind need to be processed together." },
      { title: "Transform text and data", detail: "Strings and arrays help learners build programs that feel closer to real user input." },
    ],
    example: {
      title: "Student marks analyzer",
      scenario: "An array stores scores, methods compute total and average, and strings format a clean report.",
      takeaway: "Learners see how small utilities combine into one useful program.",
    },
    outcomes: ["Write reusable methods", "Process arrays with loops", "Build small console tools that read and present data"],
  },
  "oop-mod-1": {
    summary: "This module helps learners model one real thing as a Java object and understand how object state changes over time.",
    whyItMatters: "It is the bridge from procedural thinking to object-oriented design.",
    realTimeExplanation: [
      { title: "Identify the object", detail: "Pick a business concept like a bank account and list its data and actions." },
      { title: "Create multiple instances", detail: "Instantiate two objects and show that each one owns its own state." },
      { title: "Trace behavior changes", detail: "Call methods and explain exactly which object's balance or fields change." },
    ],
    example: {
      title: "Bank account behavior",
      scenario: "Alice and Bob each get their own BankAccount object, and deposits or withdrawals affect only the target object.",
      takeaway: "This is the clearest way to understand independent object state.",
    },
    outcomes: ["Explain class vs object clearly", "Write simple classes with constructors", "Trace object state in real time"],
  },
  "oop-mod-2": {
    summary: "This module explains why Java classes should protect their internal state and expose safe operations instead of direct field access.",
    whyItMatters: "Encapsulation is how production systems stop invalid state from creeping through the codebase.",
    realTimeExplanation: [
      { title: "Hide raw data", detail: "Mark fields private so outside code cannot bypass rules." },
      { title: "Expose controlled methods", detail: "Use getters, setters, and purpose-driven methods to guard updates." },
      { title: "Construct valid objects", detail: "Use constructors to guarantee objects start in a meaningful state." },
    ],
    example: {
      title: "Employee salary rules",
      scenario: "Instead of letting any class change salary directly, a controlled method validates raises and prevents invalid values.",
      takeaway: "Encapsulation protects business rules, not just syntax style.",
    },
    outcomes: ["Use access modifiers deliberately", "Explain why setters are not always enough", "Keep objects in valid states"],
  },
  "oop-mod-3": {
    summary: "This module shows how related classes share behavior and how Java can choose behavior at runtime through polymorphism.",
    whyItMatters: "Inheritance and interfaces make large systems extensible without rewriting existing code.",
    realTimeExplanation: [
      { title: "Find the shared concept", detail: "Pull common behavior into a parent class or interface." },
      { title: "Create specialized types", detail: "Subclasses or implementations add behavior specific to one domain case." },
      { title: "Use one reference for many behaviors", detail: "Polymorphism lets the runtime call the correct implementation without manual if/else chains." },
    ],
    example: {
      title: "Payment processing",
      scenario: "CreditCardPayment, UpiPayment, and WalletPayment all follow a PaymentGateway contract while exposing different internal logic.",
      takeaway: "Interfaces make change safer because new payment types can be added with less disruption.",
    },
    outcomes: ["Recognize when inheritance helps", "Explain overriding and runtime dispatch", "Use interfaces to decouple code"],
  },
};

export const roadmapGuides: Record<string, LearningGuide> = {
  foundations: courseGuides["java-foundations"],
  oop: courseGuides["java-oop"],
  intermediate: courseGuides["java-intermediate"],
  collections: courseGuides["java-collections"],
  advanced: {
    summary: "Advanced Java deepens understanding of concurrency, JVM behavior, performance, and networking so learners can reason about production systems.",
    whyItMatters: "This is where Java stops being only application syntax and becomes an engineering platform you can tune, scale, and troubleshoot.",
    realTimeExplanation: [
      { title: "See the moving parts", detail: "Learners study threads, memory, and IO as systems interacting at runtime." },
      { title: "Understand failure modes", detail: "Deadlocks, latency, and leaks are explained through small reproducible examples." },
      { title: "Think like a production engineer", detail: "The focus shifts from just writing code to making it reliable under load." },
    ],
    example: {
      title: "Concurrent order processor",
      scenario: "Multiple worker threads process incoming orders while shared resources must be synchronized safely.",
      takeaway: "Concurrency concepts make sense when attached to throughput and data consistency.",
    },
    outcomes: ["Understand thread coordination", "Reason about JVM and performance basics", "Prepare for production troubleshooting"],
  },
  dsa: courseGuides["java-dsa"],
  jdbc: {
    summary: "Database programming teaches how Java applications connect to relational databases, execute queries, and map business data safely.",
    whyItMatters: "Most business systems depend on stored data, so backend developers need to understand persistence below higher-level frameworks.",
    realTimeExplanation: [
      { title: "Open a connection", detail: "Explain what the application needs before it can talk to a database." },
      { title: "Send and read queries", detail: "The learner watches parameters go into SQL and rows come back out." },
      { title: "Manage resources safely", detail: "Transactions, connection pools, and cleanup are taught as reliability concerns, not afterthoughts." },
    ],
    example: {
      title: "Student enrollment records",
      scenario: "A Java app inserts students, fetches course lists, and updates enrollments using JDBC and parameterized queries.",
      takeaway: "The learner sees how application data becomes durable system data.",
    },
    outcomes: ["Write safe JDBC code", "Understand SQL integration from Java", "Appreciate why connection management matters"],
  },
  testing: courseGuides["java-testing"],
  interview: {
    summary: "Interview preparation consolidates Java, DSA, design thinking, and communication so learners can explain solutions clearly under pressure.",
    whyItMatters: "Knowing the answer is not enough. Candidates need to think out loud, justify tradeoffs, and debug in front of another engineer.",
    realTimeExplanation: [
      { title: "Clarify the question", detail: "Strong candidates restate the problem, ask constraints, and confirm the expected behavior." },
      { title: "Build the answer incrementally", detail: "They move from brute force to better solutions while keeping the interviewer aligned." },
      { title: "Explain tradeoffs clearly", detail: "Complexity, edge cases, and testing strategy are communicated as part of the solution." },
    ],
    example: {
      title: "Top K frequent elements",
      scenario: "A candidate explains the brute-force idea, improves it with a map and heap, and discusses complexity while coding.",
      takeaway: "This stage is about communication quality as much as coding quality.",
    },
    outcomes: ["Structure interview answers", "Explain DSA tradeoffs better", "Stay composed during live coding and follow-ups"],
  },
  spring: courseGuides["java-spring-boot"],
  microservices: {
    summary: "This stage teaches how multiple services communicate, deploy, and recover in real-world production environments.",
    whyItMatters: "Modern Java backend roles often involve distributed systems, event-driven messaging, observability, and deployment automation.",
    realTimeExplanation: [
      { title: "Split the business domain", detail: "Learners see why one monolith becomes multiple services with focused responsibilities." },
      { title: "Connect the services", detail: "HTTP calls, asynchronous messaging, and shared contracts are introduced with concrete flows." },
      { title: "Operate in production", detail: "Containers, CI/CD, monitoring, and resilience patterns complete the backend picture." },
    ],
    example: {
      title: "E-commerce platform services",
      scenario: "Order, inventory, payment, and notification services collaborate through APIs and events while being deployed independently.",
      takeaway: "Microservices make sense when the learner sees the operational tradeoffs, not just the architecture diagram.",
    },
    outcomes: ["Explain distributed system basics", "Understand messaging and service boundaries", "Connect Java development to production delivery"],
  },
};
