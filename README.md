# EduAI Web Application

This is a full-stack web application designed to help users with an AI-powered learning assistant, featuring robust user authentication and profile management. The frontend is built with Next.js, and the backend is powered by Azure Functions, utilizing MongoDB Atlas for data storage.

## Features

This web application provides the following key functionalities:

*   **User Authentication:**
    *   **Registration:** Allows new users to sign up securely with their email, full name, and password. Passwords are hashed before storage.
    *   **Login:** Authenticates users via email and password, issuing an authentication token upon successful login.
    *   **Email Verification:** Implements a two-step verification process where users receive a 6-digit code via email (powered by the Resend service) to confirm their email address. This includes mechanisms for resending codes and code expiry.
    *   **Forgot Password:** Provides a recovery flow for users who have forgotten their password, integrated with the email verification process.
    *   **Profile Management:** Authenticated users can view and update their personal information, such as full name and email address.
    *   **Security:** Incorporates industry-standard practices like password hashing and token-based authentication to ensure data security.

*   **User Interface:**
    *   Developed using Next.js for a modern, performant, and server-rendered frontend.
    *   Styled with Material-UI to provide a consistent, responsive, and aesthetically pleasing user experience.
    *   Features dedicated and intuitive pages for user login, registration, and password recovery.
    *   Includes essential UI elements such as password visibility toggles, loading indicators, and custom error pages (e.g., 404 Not Found) for improved user feedback.

*   **Backend (Azure Functions):**
    *   Implemented as serverless Azure Functions, providing a scalable and cost-effective API layer.
    *   Connects to MongoDB Atlas for secure and efficient storage of user data.
    *   Includes a utility API endpoint (`/api/test-db`) to quickly verify the database connection status.

## Prerequisites

Before you begin, ensure you have the following installed:

*   [Node.js](https://nodejs.org/en/) (LTS version recommended)
*   [pnpm](https://pnpm.io/installation)
*   [Azure Static Web Apps CLI (SWA CLI)](https://azure.github.io/static-web-apps-cli/docs/installation/) - Install globally:
    ```bash
    npm install -g @azure/static-web-apps-cli
    ```

## Getting Started

Follow these steps to set up and run the project locally using the Azure Static Web Apps CLI.

1.  **Install Dependencies:**
    Navigate to the project root and install the dependencies for both the frontend and the API:

    ```bash
    pnpm install
    pnpm install --prefix api
    ```

2.  **Configure Environment Variables:**
    The application requires certain environment variables for the backend (Azure Functions) to function correctly, particularly for MongoDB connection and email service.

    Create a `.env` file in the `api` directory with the following content (replace placeholders with your actual values):

    ```
    MONGODB_URI="your_mongodb_connection_string"
    RESEND_API_KEY="your_resend_api_key"
    APP_NAME="EduAI"
    ```

    *   `MONGODB_URI`: Your connection string for MongoDB Atlas.
    *   `RESEND_API_KEY`: Your API key from Resend for sending emails.
    *   `APP_NAME`: (Optional) The name of your application, used in email templates.

3.  **Run the Application Locally with SWA CLI (Recommended for full stack development):**
    The SWA CLI will serve both the frontend and the backend API, simulating the Azure Static Web Apps environment.

    From the project root, run:

    ```bash
    swa start
    ```

    This command will:
    *   Build the frontend application (Next.js).
    *   Build the Azure Functions API.
    *   Start a local development server for the frontend.
    *   Start a local server for the Azure Functions API.
    *   Proxy requests between the frontend and the API.

    The application will typically be accessible at `http://localhost:4280`. Open your browser and navigate to this address to see the result. The root URL automatically redirects to the login page.

4.  **Run Frontend and Backend Separately (Advanced):**
    For more granular control or debugging, you can run the frontend and backend in separate terminal windows.

    **Terminal 1 (Frontend):**
    Navigate to the project root and run the Next.js development server:

    ```bash
    pnpm dev
    ```
    This will start the frontend on `http://localhost:3000`.

    **Terminal 2 (Backend - Azure Functions):**
    Navigate to the `api` directory and start the Azure Functions host:

    ```bash
    cd api
    npm run build # Ensure the API is built
    npm start
    ```
    The Azure Functions API will typically run on `http://localhost:7071`.

    When running separately, you will need to configure your frontend to correctly proxy API requests to the Azure Functions endpoint. For local development, `swa start` handles this automatically.

## Deployment to Azure

This project is configured for continuous deployment to Azure Static Web Apps via GitHub Actions. The deployment workflow is defined in `.github/workflows/azure-static-web-apps-zealous-bay-0308c7d00.yml`.

To deploy your changes:

1.  Ensure your code is pushed to the `jason/test` branch (as configured in the workflow).
2.  The GitHub Actions workflow will automatically trigger, build the frontend and backend, and deploy them to your Azure Static Web App instance.
3.  Ensure your Azure Static Web App is configured with the necessary application settings (e.g., `MONGODB_URI`, `RESEND_API_KEY`) under "Configuration" in the Azure Portal.

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
