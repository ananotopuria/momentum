# Momentum - Progress Tracking Software ⏳

**Momentum** is a **Progress Tracking** style application designed for companies like Redberry to manage employees and their assigned tasks effectively.

## Features ✨

The application has the following pages:

### 1. **Task List Page** 📋
- Allows filtering tasks by **Department**, **Employee Name**, and **Priority**.
- Displays tasks in **cards** with the following details:
  - **Task Title**
  - **Task Description** 
  - **Priority** (Icon representation)
  - **Due Date**
  - **Department Name**
  - **Employee Avatar** (Responsible Person)

### 2. **Create Task Page** ➕
- Users can create new tasks and assign them to an employee.
- **Task fields**:
  - **Title**: Required, Minimum 3 characters, Maximum 255 characters.
  - **Description**: Optional, Minimum 4 words if entered, Maximum 255 characters.
  - **Priority**: Required (High, Medium, Low), Default is Medium (Icons displayed in dropdown).
  - **Status**: Required (New, In Progress, Ready for Testing, Completed), Default is New.
  - **Department**: Required, dropdown that shows departments from API.
  - **Employee**: Required, dropdown that shows employees from the selected department.
  - **Due Date**: Required, Default is tomorrow, No past dates allowed.

### 3. **Task Details Page** 🔍
- Full details of the task, including:
  - **Title**
  - **Full Description**
  - **Priority**
  - **Employee** (Name, Avatar, Department)
  - **Due Date**
  - **Status** (Can be changed from here)
  - **Comments Section**:
    - Users can write comments.
    - Comments will be updated in real-time, and new comments will appear at the top.
    - There is a **Reply** option for each comment (1-level depth only).
    - The **Submit Button** is disabled if the comment field is empty.
    - Only one level of replies is allowed (No reply to replies).

### 4. **Employee Creation Modal** 🧑‍💼
- Allows adding a new employee with:
  - **Name**: Required, Minimum 2 characters, Maximum 255 characters, Latin and Georgian letters only.
  - **Surname**: Required, Minimum 2 characters, Maximum 255 characters, Latin and Georgian letters only.
  - **Avatar**: Required, Max size 600KB, image file only.
  - **Department**: Required (Data from API).
  - **Validation**: Real-time validation for the input fields.

---

## Filtering Options 🔎

- **Department Filter**: Multi-select.
- **Priority Filter**: Multi-select.
- **Employee Filter**: Single-select (shows Name, Surname, Avatar).
- If multiple filters are selected, only tasks that match both criteria will be displayed.

---

## Installation

Clone the repository and install dependencies:

```bash
git clone git@github.com:ananotopuria/momentum.git
cd momentum
npm install
```

## Scripts 🖥️

You can use the following commands to work with the project:

- `npm run dev` - Starts the development server using Vite. 🌱
- `npm run build` - Builds the project using TypeScript and Vite. 🏗️
- `npm run lint` - Runs ESLint to check for linting issues in the codebase. 🧹
- `npm run preview` - Previews the built project locally. 👀

## Dependencies 📦

This project uses the following main dependencies:

- `@tailwindcss/vite` - Vite plugin for Tailwind CSS support. 🎨
- `@tanstack/react-query` - Powerful data fetching and caching library for React. 💡
- `axios` - Promise-based HTTP client for the browser and Node.js. 🌍
- `framer-motion` - Animation library for React. 🎬
- `react` - A JavaScript library for building user interfaces. 🖥️
- `react-dom` - React's DOM bindings. 🌐
- `react-dropzone` - React component for drag-and-drop file uploads. 📂
- `react-hook-form` - Library for managing form state in React. 📝
- `react-icons` - Icon library for React. 💎
- `react-router-dom` - Declarative routing for React. 🛣️
- `react-select` - A flexible and customizable select input control for React. 📑

## Development Dependencies 🛠️

For development, the project uses:

- `@eslint/js` - ESLint configuration for JavaScript. 🚨
- `@types/react` - TypeScript type definitions for React. 🔠
- `@types/react-dom` - TypeScript type definitions for React DOM. 🌍
- `@types/react-router-dom` - TypeScript type definitions for React Router DOM. 🔗
- `@vitejs/plugin-react` - Vite plugin for React. ⚙️
- `autoprefixer` - PostCSS plugin for automatically adding vendor prefixes. 🔧
- `eslint` - Linting tool for identifying and fixing problems in JavaScript code. 🧹
- `eslint-plugin-react-hooks` - ESLint plugin for React Hooks rules. ⚙️
- `eslint-plugin-react-refresh` - ESLint plugin for React Fast Refresh. 🔄
- `globals` - Global variables for JavaScript environments. 🌍
- `postcss` - Tool for transforming CSS with JavaScript plugins. 🎨
- `tailwindcss` - Utility-first CSS framework for styling. 🌈
- `typescript` - TypeScript language for adding static typing to JavaScript. 🖋️
- `typescript-eslint` - ESLint plugin for TypeScript. 🧑‍💻
- `vite` - Next-generation, fast development and build tool for React. ⚡
