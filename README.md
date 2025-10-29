# HNG Stage 2 API

This is a RESTful API that fetches country data and exchange rates from from external APIs, stores them in a database, and provides CRUD operations.

## Features

- Provides 3 GET endpoints that:

  - retrieves a single country by its name
  - retrieves countries' status and refresh timestamps
  - retrieves all countries based on specific filters

- Provides a POST endpoint that fetches country data and exchange rates from external APIs, then cache them in the database

- Provides a DELETE endpoint that deletes a single country by its name

- Returns responses in JSON format
- Handles CORS for cross-origin requests

## Tech Stack

- Node.js
- Express.js

## Local setup instructions

1. Clone the repository

```bash
git clone https://github.com/njaumatilda/HNG13_Stage2.git
```

2. Navigate to the project directory

```bash
cd HNG13_Stage2
```

3. Install dependencies

```bash
npm install
```

| The dependancies used in this task are: `dotenv`, `express`, `cors`, `mysql2` and `sequelize` |

4. Configure environment variables

To run this project, you will need to create a `.env` file in the project directory and make sure it is included in the `.gitignore` file. Configure the following environment variables:

```env
PORT = your-port
DB_URL = your DB_URL
```

> Replace `your-port` with your specified port and `your DB_URL` with your specified DB_URL

5. Start the server

```bash
npm run dev
```

## API Documentation

Here is the reference on the usage of the API:
[API Documentation](https://documenter.getpostman.com/view/38132076/2sB3QQJTMG)

## Deployment

The API has been deployed to a publicly accessible endpoint on Railway:
[Live URL]()

## Author

[Matilda Njau](https://github.com/njaumatilda)
