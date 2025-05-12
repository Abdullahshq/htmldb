# Contact Form with Azure SQL Database

This project implements a contact form that stores submissions in an Azure SQL Database, and is deployed via Azure App Service.

## Prerequisites

- Azure account with an active subscription
- GitHub account
- Node.js 14.x or higher (for local development)

## Setup Instructions

### 1. Azure SQL Database Setup

1. Create an Azure SQL Database through the Azure Portal
   - Note down the server name, database name, and admin credentials
   - Make sure to allow Azure services to access the server in the firewall settings

2. Set up the database table using the provided script:
   - Connect to your database using Azure Data Studio, SQL Server Management Studio, or the Query Editor in Azure Portal
   - Run the SQL script in `database-setup.sql` to create the Contacts table

### 2. Azure App Service Setup

1. Create a new Web App in Azure App Service
   - Select Node.js as the runtime stack
   - Choose an appropriate App Service Plan

2. Connect your GitHub repository to the Azure App Service:
   - In the Azure Portal, navigate to your App Service
   - Go to "Deployment Center"
   - Select GitHub as the source
   - Follow the prompts to connect to your GitHub account and select your repository
   - This will automatically set up GitHub Actions for CI/CD

3. Configure environment variables in Azure App Service:
   - In the Azure Portal, navigate to your App Service
   - Go to "Configuration" > "Application settings"
   - Add the following application settings:
     - `DB_SERVER`: Your Azure SQL Server URL (e.g., `yourserver.database.windows.net`)
     - `DB_NAME`: Your database name
     - `DB_USER`: Your database username
     - `DB_PASSWORD`: Your database password
   - These environment variables will be securely stored and accessed by your application

### 3. Deploy Your Application

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit with contact form"
   git push
   ```

2. GitHub Actions will automatically deploy your application to Azure App Service

3. Your application should now be running at `https://your-app-name.azurewebsites.net`

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with your database credentials:
   ```
   DB_SERVER=your-server.database.windows.net
   DB_NAME=your-database-name
   DB_USER=your-username
   DB_PASSWORD=your-password
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Your application will be available at `http://localhost:3000`

## Security Considerations

- Database credentials are stored as environment variables in Azure App Service, not in the code
- The application uses parameterized queries to prevent SQL injection
- User input is validated before being stored in the database
- HTTPS is enforced by Azure App Service by default

## Troubleshooting

- Check the logs in Azure App Service for any errors
- Verify that your database credentials are correct
- Ensure your IP address is allowed in the Azure SQL Database firewall settings
- If you encounter CORS issues, make sure your frontend and backend are on the same domain or configure CORS in the server.js file 