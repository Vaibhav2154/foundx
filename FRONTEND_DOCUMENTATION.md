# FoundX Frontend Documentation

## 🎨 What is the Frontend?

The frontend is the part of the FoundX application that users see and interact with. Think of it as the "face" of your startup platform - it's the website that entrepreneurs will visit to build their businesses, create legal documents, and get AI assistance.

## 🛠️ Technology Stack (The Tools We Use)

### **Next.js 15.3.3** - The Main Framework
- **What it is**: A powerful React framework for building modern websites
- **Why we use it**: Makes our website fast, SEO-friendly, and easy to deploy
- **Think of it as**: The foundation of our house - everything else is built on top of it

### **React 19** - The User Interface Library
- **What it is**: A library for creating interactive user interfaces
- **Why we use it**: Allows us to build dynamic, responsive web pages
- **Think of it as**: The interior design tools that make our website beautiful and functional

### **TypeScript** - Enhanced JavaScript
- **What it is**: JavaScript with extra safety features
- **Why we use it**: Helps prevent bugs and makes code more reliable
- **Think of it as**: A spell-checker for our code

### **Tailwind CSS** - Styling Framework
- **What it is**: A utility-first CSS framework for styling
- **Why we use it**: Makes styling consistent and development faster
- **Think of it as**: A pre-made color palette and design system

### **Framer Motion** - Animations
- **What it is**: A library for creating smooth animations
- **Why we use it**: Makes the website feel modern and engaging
- **Think of it as**: The special effects that make our website come alive

## 📁 Project Structure

```
frontend/
├── app/                    # Main application pages
│   ├── page.tsx           # Home page (what users see first)
│   ├── layout.tsx         # Overall site layout and navigation
│   ├── globals.css        # Global styles for the entire site
│   ├── assistant/         # AI Assistant chat interface
│   ├── build-startup/     # Startup building tools and wizards
│   ├── dashboard/         # User dashboard after login
│   │   ├── projects/      # Project management section
│   │   ├── startup/       # Startup profile management
│   │   ├── tasks/         # Task tracking and management
│   │   └── team/          # Team collaboration features
│   ├── legal/             # Legal document generation
│   ├── options/           # User preferences and settings
│   ├── sign-in/           # User login page
│   └── sign-up/           # User registration page
├── components/            # Reusable UI components
│   ├── landing/           # Landing page components
│   │   ├── Navbar.tsx     # Top navigation bar
│   │   ├── Intro.tsx      # Hero section with main message
│   │   ├── Features.tsx   # Features showcase
│   │   ├── HowItWorks.tsx # Step-by-step process
│   │   ├── Testimonial.tsx# Customer testimonials
│   │   ├── CTASection.tsx # Call-to-action buttons
│   │   └── Footer.tsx     # Bottom page footer
│   ├── MarkdownRenderer.tsx # For displaying formatted text
│   └── theme-provider.tsx # Dark/light mode switching
├── config/                # Configuration files
│   ├── api.ts             # API connection settings
│   └── apiservice.ts      # API service functions
├── api/                   # API integration files
│   ├── project.ts         # Project-related API calls
│   ├── startup.ts         # Startup-related API calls
│   ├── task.ts            # Task-related API calls
│   └── user.ts            # User-related API calls
└── public/                # Static files (images, icons)
    ├── logo.png           # Company logo
    └── logo2.png          # Alternative logo
```

## 🌟 Key Features

### **Landing Page**
- **Purpose**: First impression for new visitors
- **What it includes**:
  - Hero section explaining what FoundX does
  - Feature highlights
  - How the platform works
  - Customer testimonials
  - Call-to-action buttons to get started

### **User Authentication**
- **Sign Up**: New users can create accounts
- **Sign In**: Existing users can log in
- **Secure**: Uses JWT tokens for security

### **Dashboard**
- **Projects**: Users can manage multiple startup projects
- **Startup Profile**: Build and edit startup information
- **Tasks**: Track progress with to-do lists
- **Team**: Collaborate with team members

### **AI Assistant**
- **Chat Interface**: Talk to AI for startup advice
- **Intelligent Responses**: Get personalized recommendations
- **Context Awareness**: AI remembers your startup details

### **Legal Document Generator**
- **Document Types**: NDAs, employment agreements, founder agreements
- **AI-Powered**: Automatically generates legal documents
- **Customizable**: Tailored to your specific needs

### **Startup Builder**
- **Guided Process**: Step-by-step startup creation
- **Templates**: Pre-built structures for different business types
- **Progress Tracking**: See how far along you are

## 🎨 Design Philosophy

### **User-Friendly**
- Clean, modern interface
- Intuitive navigation
- Clear call-to-action buttons

### **Responsive Design**
- Works on desktop computers
- Optimized for tablets
- Mobile-friendly

### **Accessibility**
- Dark and light mode support
- Keyboard navigation
- Screen reader friendly

### **Performance**
- Fast loading times
- Smooth animations
- Optimized images

## 🔧 Development Features

### **Modern Development Tools**
- **ESLint**: Keeps code clean and consistent
- **TypeScript**: Prevents bugs and improves code quality
- **Next.js**: Provides built-in optimization and routing

### **API Integration**
- **Axios**: Handles communication with backend
- **Error Handling**: Graceful error messages for users
- **Loading States**: Shows progress during operations

### **Styling System**
- **Tailwind CSS**: Consistent design system
- **Component-based**: Reusable UI elements
- **Theme Support**: Easy customization

## 🚀 How It Works

1. **User visits the website** → Sees the landing page
2. **Signs up/logs in** → Gets access to dashboard
3. **Creates a startup project** → Uses the startup builder
4. **Gets AI assistance** → Chats with the AI assistant
5. **Generates documents** → Creates legal documents
6. **Manages progress** → Tracks tasks and milestones
7. **Collaborates** → Invites team members

## 📱 User Experience

### **For Entrepreneurs**
- Simple onboarding process
- Clear guidance at every step
- Instant AI help when needed
- Professional document generation

### **For Teams**
- Collaborative workspace
- Shared project management
- Real-time updates
- Team communication tools

## 🔗 Integration Points

The frontend connects with:
- **Backend API**: For user data, projects, and tasks
- **AI Service**: For intelligent assistance and document generation
- **Authentication**: Secure user management
- **File Storage**: Document and image uploads

## 💡 Benefits for Users

1. **Professional Appearance**: Builds trust with investors and customers
2. **Time Saving**: Automated document generation and AI assistance
3. **Guidance**: Step-by-step help for new entrepreneurs
4. **Collaboration**: Easy team management and sharing
5. **Mobile Access**: Work from anywhere on any device

This frontend creates a professional, user-friendly experience that makes starting and managing a business accessible to everyone, regardless of their technical background.
