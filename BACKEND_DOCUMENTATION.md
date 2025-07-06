# FoundX Backend Documentation

## 🔧 What is the Backend?

The backend is the "brain" of the FoundX application - it's the server that runs behind the scenes, handling all the data, user accounts, and business logic. Think of it as the engine of a car - users don't see it directly, but it powers everything they do on the website.

## 🛠️ Technology Stack (The Tools We Use)

### **Node.js** - The Runtime Environment

- **What it is**: JavaScript that runs on the server (not just in web browsers)
- **Why we use it**: Fast, efficient, and allows us to use the same language (JavaScript) for both frontend and backend
- **Think of it as**: The operating system for our server application

### **Express.js 5.1.0** - The Web Framework

- **What it is**: A minimal and flexible web application framework
- **Why we use it**: Makes it easy to create APIs and handle web requests
- **Think of it as**: The traffic controller that directs requests to the right place

### **MongoDB with Mongoose 8.16.1** - The Database

- **What it is**: A NoSQL database that stores data in flexible, JSON-like documents
- **Why we use it**: Perfect for storing user data, projects, and startup information
- **Think of it as**: A digital filing cabinet that organizes all our information

### **JWT (JSON Web Tokens)** - Authentication

- **What it is**: A secure way to verify user identity
- **Why we use it**: Keeps user accounts secure and sessions active
- **Think of it as**: A digital ID card that proves who you are

### **Bcrypt** - Password Security

- **What it is**: A library that encrypts passwords
- **Why we use it**: Protects user passwords even if our database is compromised
- **Think of it as**: A safe that locks away sensitive information

## 📁 Project Structure

```
backend/
├── src/
│   ├── index.js                # Application entry point
│   ├── app.js                  # Express app configuration
│   ├── constants.js            # Application constants
│   ├── controllers/            # Business logic handlers
│   │   ├── user.controller.js      # User account operations
│   │   ├── startUp.controller.js   # Startup management
│   │   ├── project.controller.js   # Project operations
│   │   └── task.controller.js      # Task management
│   ├── models/                 # Database schemas
│   │   ├── user.models.js          # User data structure
│   │   ├── startup.model.js        # Startup data structure
│   │   ├── projects.models.js      # Project data structure
│   │   └── task.model.js           # Task data structure
│   ├── routes/                 # API endpoint definitions
│   │   ├── user.routes.js          # User-related endpoints
│   │   ├── startUp.routes.js       # Startup-related endpoints
│   │   ├── project.router.js       # Project-related endpoints
│   │   └── task.route.js           # Task-related endpoints
│   ├── middlewares/            # Security and validation
│   │   └── authMiddleware.js       # Authentication verification
│   ├── utils/                  # Helper functions
│   │   ├── ApiError.js             # Error handling
│   │   ├── ApiResponse.js          # Standardized responses
│   │   └── asyncHandler.js         # Async error handling
│   └── db/                     # Database connection
│       └── index.js                # MongoDB connection setup
├── public/                     # File uploads storage
│   └── temp/                       # Temporary file storage
├── package.json               # Project dependencies and scripts
└── Readme.md                  # Project documentation
```

## 🌟 Key Features

### **User Management**

- **Registration**: New users can create accounts
- **Login/Logout**: Secure authentication system
- **Profile Management**: Users can update their information
- **Password Security**: Encrypted password storage
- **Session Management**: JWT-based authentication

### **Startup Management**

- **Create Startups**: Users can register new startup ideas
- **Update Information**: Edit startup details and descriptions
- **Multiple Startups**: Users can manage several startups
- **Status Tracking**: Monitor startup development stages

### **Project Management**

- **Project Creation**: Break down startups into manageable projects
- **Project Updates**: Modify project details and timelines
- **Project Organization**: Categorize and prioritize projects
- **Progress Tracking**: Monitor project completion status

### **Task Management**

- **Task Creation**: Add specific tasks within projects
- **Task Assignment**: Assign tasks to team members
- **Due Dates**: Set and track deadlines
- **Status Updates**: Mark tasks as complete or in progress
- **Priority Levels**: Organize tasks by importance

## 🔗 API Endpoints

### **User Operations** (`/api/v1/users`)

- **POST /register**: Create a new user account
- **POST /login**: User authentication
- **POST /logout**: End user session
- **GET /profile**: Get user information
- **PUT /profile**: Update user details
- **POST /change-password**: Update user password

### **Startup Operations** (`/api/v1/startups`)

- **POST /**: Create a new startup
- **GET /**: Get all user's startups
- **GET /:id**: Get specific startup details
- **PUT /:id**: Update startup information
- **DELETE /:id**: Delete a startup

### **Project Operations** (`/api/v1/projects`)

- **POST /**: Create a new project
- **GET /startup/:startupId**: Get all projects for a startup
- **GET /:id**: Get specific project details
- **PUT /:id**: Update project information
- **DELETE /:id**: Delete a project

### **Task Operations** (`/api/v1/project`)

- **POST /tasks**: Create a new task
- **GET /tasks/project/:projectId**: Get all tasks for a project
- **GET /tasks/:id**: Get specific task details
- **PUT /tasks/:id**: Update task information
- **DELETE /tasks/:id**: Delete a task

## 🛡️ Security Features

### **Authentication Middleware**

- **JWT Verification**: Checks if users are logged in
- **Route Protection**: Protects sensitive endpoints
- **Token Validation**: Ensures tokens are valid and not expired

### **Password Security**

- **Bcrypt Hashing**: Passwords are never stored in plain text
- **Salt Rounds**: Additional security layer for password encryption
- **Password Validation**: Enforces strong password requirements

### **Data Validation**

- **Input Sanitization**: Cleans user input to prevent attacks
- **Schema Validation**: Ensures data matches expected formats
- **Error Handling**: Graceful error responses

## 📊 Database Models

### **User Model**

```javascript
{
  username: String,      // Unique username
  email: String,         // User's email address
  password: String,      // Encrypted password
  fullName: String,      // User's full name
  avatar: String,        // Profile picture URL
  refreshToken: String,  // For session management
  createdAt: Date,       // Account creation date
  updatedAt: Date        // Last update date
}
```

### **Startup Model**

```javascript
{
  name: String,          // Startup name
  description: String,   // Startup description
  industry: String,      // Business industry
  stage: String,         // Development stage
  founder: ObjectId,     // Reference to user
  teamSize: Number,      // Number of team members
  fundingStage: String,  // Current funding stage
  createdAt: Date,       // Creation date
  updatedAt: Date        // Last update date
}
```

### **Project Model**

```javascript
{
  title: String,         // Project title
  description: String,   // Project description
  startup: ObjectId,     // Reference to startup
  status: String,        // Project status
  priority: String,      // Project priority
  startDate: Date,       // Project start date
  endDate: Date,         // Project deadline
  createdAt: Date,       // Creation date
  updatedAt: Date        // Last update date
}
```

### **Task Model**

```javascript
{
  title: String,         // Task title
  description: String,   // Task description
  project: ObjectId,     // Reference to project
  assignedTo: ObjectId,  // Reference to user
  status: String,        // Task status
  priority: String,      // Task priority
  dueDate: Date,         // Task deadline
  createdAt: Date,       // Creation date
  updatedAt: Date        // Last update date
}
```

## 🔄 How It Works

### **Request Flow**

1. **Frontend sends request** → API endpoint receives it
2. **Authentication check** → Middleware verifies user
3. **Route handler** → Controller processes the request
4. **Database operation** → Data is read/written to MongoDB
5. **Response sent** → Result is returned to frontend

### **Data Processing**

1. **Input validation** → Ensure data is correct format
2. **Business logic** → Apply rules and calculations
3. **Database interaction** → Store or retrieve data
4. **Response formatting** → Standardize output format

## 🚀 Development Features

### **Environment Configuration**

- **Environment Variables**: Secure configuration management
- **Database URLs**: Flexible database connection
- **JWT Secrets**: Secure token generation

### **Error Handling**

- **Centralized Errors**: Consistent error responses
- **Async Error Handling**: Proper handling of asynchronous operations
- **Logging**: Track errors for debugging

### **Code Organization**

- **MVC Pattern**: Model-View-Controller architecture
- **Modular Design**: Separate concerns into different files
- **Reusable Utilities**: Common functions shared across modules

## 📈 Performance Features

### **Database Optimization**

- **Mongoose ODM**: Object Document Mapping for easier queries
- **Indexing**: Fast data retrieval
- **Pagination**: Handle large datasets efficiently

### **Middleware**

- **CORS**: Cross-origin resource sharing for frontend communication
- **Body Parsing**: Handle different types of request data
- **Cookie Parsing**: Manage user sessions

### **File Handling**

- **Multer**: Handle file uploads (avatars, documents)
- **Static Files**: Serve uploaded files
- **Temporary Storage**: Clean up unused files

## 🔗 Integration Points

The backend connects with:

- **Frontend**: Provides APIs for all user interactions
- **AI Service**: Communicates for intelligent features
- **Database**: Stores and retrieves all application data
- **File System**: Manages uploaded files and documents

## 💡 Benefits

### **For Developers**

- **Scalable Architecture**: Easy to add new features
- **Clean Code**: Well-organized and maintainable
- **Security**: Built-in protection against common attacks
- **Documentation**: Clear API documentation

### **For Users**

- **Fast Response**: Quick API responses
- **Reliable**: Stable and consistent performance
- **Secure**: Protected personal and business data
- **Available**: 24/7 uptime for global access

This backend provides a robust, secure, and scalable foundation for the FoundX platform, handling all the complex operations behind the scenes while providing a simple, reliable API for the frontend to use.
