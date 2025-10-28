# FileConverter - PDF & Word Converter

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

A modern, fast, and secure single-page web application for converting documents between PDF and Word formats. It features a clean, responsive, drag-and-drop interface built with React and Tailwind CSS, designed for a seamless user experience. The application is optimized for SEO and includes multiple pages for content like About, Contact, and Privacy.

<!-- Placeholder for a screenshot -->
<!-- ![FileConverter Screenshot](./screenshot.png) -->

## Features

-   **Dual Conversion Modes:** Convert from PDF to Word and Word to PDF.
-   **Drag & Drop Interface:** Easily upload files by dragging them into the browser.
-   **File Validation:** Client-side validation for correct file types (`.pdf`, `.doc`, `.docx`).
-   **Responsive Design:** Fully responsive layout that works on all devices, from mobile to desktop.
-   **Real-time UI Feedback:** Clear loading, success, and error states to guide the user through the conversion process.
-   **Single-Page Application (SPA):** Smooth navigation between the converter, about, contact, and privacy pages without page reloads.
-   **SEO Optimized:** Includes essential meta tags, Open Graph, Twitter Cards, and JSON-LD structured data to improve search engine visibility.
-   **Content-Rich:** Includes dedicated sections for "How It Works," "Why Choose Us," a functional contact form, and a detailed privacy policy.

## Tech Stack

-   **Frontend:** [React](https://reactjs.org/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You will need to have [Node.js](https://nodejs.org/) (v18.x or later) and a package manager like [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) installed.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/file-converter.git
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd file-converter
    ```
3.  **Install dependencies:**
    ```sh
    npm install
    ```

### Environment Variables

Before running the application, you need to set up your environment variables. The application uses an API to handle the file conversion.

1.  Create a new file named `.env` in the root of your project.
2.  Add your API key to this file:
    ```
    # This is a placeholder for your real file conversion API key
    API_KEY=YOUR_CONVERSION_API_KEY_HERE
    ```
    *Note: The current fetch endpoint (`https://api.example.com/convert`) is a placeholder. You will need to replace it with your actual backend service URL in `App.tsx`.*

### Running the Application

1.  **Start the development server:**
    ```sh
    npm start
    ```
2.  Open your browser and navigate to `http://localhost:3000` to see the application in action.

## Project Structure

The project follows a standard React application structure:

```
/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable React components (icons, spinner, etc.)
│   ├── App.tsx          # Main application component with all logic and layout
│   ├── index.tsx        # Entry point of the React application
│   ├── types.ts         # TypeScript type definitions
│   └── ...
├── .env                 # Environment variables (not committed to git)
├── package.json         # Project dependencies and scripts
└── README.md            # This file
```

## License

This project is licensed under the MIT License.

---

Developed by **Hsini Mohamed**.