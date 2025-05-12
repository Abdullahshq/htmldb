// Load environment variables from .env file in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { Connection, Request } = require('tedious');
const app = express();
const port = process.env.PORT || 3000;

// Configure middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));

// Database configuration
const getDbConfig = () => {
  // Parse connection string if available
  if (process.env.DB_CONNECTION_STRING) {
    try {
      const connectionString = process.env.DB_CONNECTION_STRING;
      const regex = /Server=tcp:([^,]+).*?Initial Catalog=([^;]+).*?User ID=([^;]+).*?Password=([^;]+)/;
      const match = connectionString.match(regex);
      
      if (match) {
        return {
          server: match[1],
          authentication: {
            type: 'default',
            options: {
              userName: match[3],
              password: match[4]
            }
          },
          options: {
            database: match[2],
            encrypt: true,
            trustServerCertificate: false
          }
        };
      }
    } catch (error) {
      console.error('Error parsing connection string:', error);
    }
  }
  
  // Fall back to separate config variables if parsing fails
  return {
    server: process.env.DB_SERVER,
    authentication: {
      type: 'default',
      options: {
        userName: process.env.DB_USER,
        password: process.env.DB_PASSWORD
      }
    },
    options: {
      database: process.env.DB_NAME,
      encrypt: true,
      trustServerCertificate: false
    }
  };
};

// POST endpoint for contact form
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  
  // Validate input
  if (!name || !email || !message) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please provide name, email, and message' 
    });
  }

  // Connect to database
  const connection = new Connection(getDbConfig());
  
  connection.on('connect', (err) => {
    if (err) {
      console.error('Database connection error:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Unable to connect to database' 
      });
    }
    
    // SQL query to insert contact data
    const query = `
      INSERT INTO dbo.Contacts (Name, Email, Subject, Message, SubmissionDate)
      VALUES (@Name, @Email, @Subject, @Message, GETDATE())
    `;
    
    const request = new Request(query, (err) => {
      if (err) {
        console.error('SQL error:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to save contact information' 
        });
      }
      
      res.json({ 
        success: true, 
        message: 'Thank you for your message. We will get back to you soon!' 
      });
    });
    
    request.addParameter('Name', require('tedious').TYPES.NVarChar, name);
    request.addParameter('Email', require('tedious').TYPES.NVarChar, email);
    request.addParameter('Subject', require('tedious').TYPES.NVarChar, subject || '');
    request.addParameter('Message', require('tedious').TYPES.NVarChar, message);
    
    connection.execSql(request);
  });
  
  connection.connect();
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 