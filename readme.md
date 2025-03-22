# My AI Topic Generator

My AI Topic Generator is a full-stack application that leverages AI to generate engaging campaign topics. It consists of a Node.js/Express API (backend) and a React-based UI (frontend). The application also provides endpoints to aggregate campaign data and record user feedback.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Live Demo](#live-demo)
- [Future Improvements](#future-improvements)
- [License](#license)

## Installation

### Prerequisites

- Node.js (v23 or above recommended)
- npm (v10+ recommended)

### Steps to Install Locally

1. **Clone the Repository**

   ```bash
   git clone https://github.com/milaana1988/fb-ai-topic-generator
   cd my-ai-topic-generator

2. **Install And Run Dependencies**

    - Install and run backend:

    ```bash
    cd backend
    npm install
    npm run dev
    
    - Install and run frontend:

    ```bash
    cd ../frontend
    npm install
    npm run dev

## Configuration

    Backend Configuration

    In the backend directory, create an .env file with the following environment variables (update the values as needed):

    ```dotenv
    MONGO_URI=your_mongodb_connection_string
    PORT=8000

    Frontend Configuration

    In the frontend directory, create an .env file with any required variables:

    ```dotenv
    VITE_OPENAI_API_KEY=your_openai_key
    VITE_BACKEND_URL=your_backend_url

## Usage

   - Open your browser and navigate to the frontend URL (e.g., http://localhost:3000).

   -  Use the search, filter, and generate buttons to interact with the AI topic generator.

   - The analytics dashboard displays aggregated data for the generated campaigns.

   - The export buttons allow you to download topics data as CSV or PDF.

## Live Demo

    https://fb-ai-topic-generator-8307c3be0a46.herokuapp.com/

## Future Improvements
    - Scalability:
        Further optimize and refactor the application to handle increased load. Implement redux (for global state handling) 

    - Enhanced Analytics:
        Expand the analytics dashboard with more detailed insights and visualizations.

    - User Authentication:
        Integrate user authentication for personalized topic generation and feedback.

    - (CI/CD):
      Automate testing and deployment pipelines for faster iteration and higher reliability.

    - Testing:
      Implement automated tests for both the frontend and backend to ensure code quality and stability.