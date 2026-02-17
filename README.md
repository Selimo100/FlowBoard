# Astro Starter Kit: Basics

```sh
npm create astro@latest -- --template basics
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── components
│   │   └── Welcome.astro
│   ├── layouts
│   │   └── Layout.astro
│   └── pages
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Docker + Render Deployment Guide

### 1. Local Development

To run the project locally with a local MongoDB instance:

1.  **Start MongoDB**:
    This project uses Docker Compose to run a local MongoDB instance.

    ```bash
    docker-compose up -d
    ```

2.  **Configure Environment**:
    Create a `.env` file based on `.env.example`.

    ```bash
    cp .env.example .env
    ```

    Ensure your `.env` connects to the local Mongo instance (default creds in `docker-compose.yml`):

    ```dotenv
    MONGODB_URI=mongodb://root:M7r9UsUadPwXYZorpWCG3GY4crtBME5KmM8GHqV46PTwtH2LyYikug3aNgtG9MJQED19bmJDtXQfccbbTJ8R@localhost:27017/flowboard?authSource=admin
    MONGODB_DB=flowboard
    ```

3.  **Run the App**:
    ```bash
    npm install
    npm run dev
    ```

### 2. Verify Docker Build Locally

To verify the production Docker image works on your machine before deploying:

1.  **Build the Image**:

    ```bash
    docker build -t flowboard:local .
    ```

2.  **Run the Container**:
    Connects to your local MongoDB using `host.docker.internal`.

    ```bash
    # Ensure local Mongo is running (docker-compose up -d)

    docker run --rm -p 10000:10000 \
      --name flowboard-app \
      -e HOST=0.0.0.0 \
      -e PORT=10000 \
      -e MONGODB_URI="mongodb://root:M7r9UsUadPwXYZorpWCG3GY4crtBME5KmM8GHqV46PTwtH2LyYikug3aNgtG9MJQED19bmJDtXQfccbbTJ8R@host.docker.internal:27017/flowboard?authSource=admin" \
      -e MONGODB_DB="flowboard" \
      flowboard:local
    ```

3.  **Test Health Endpoint**:
    ```bash
    curl http://localhost:10000/health
    # Output: {"status":"ok"}
    ```

### 3. Deploy to Render

This app is configured to run as a **Web Service** on Render, connecting to an external MongoDB (e.g., MongoDB Atlas).

1.  **Create Service**:
    - Go to Render Dashboard > New > **Web Service**.
    - Connect your GitHub repository.

2.  **Configure Runtime**:
    - Name: `flowboard` (or your choice)
    - Runtime: **Docker**
    - Region: (Choose one close to your database)
    - Branch: `main` (or your production branch)

3.  **Environment Variables**:
    Add the following environment variables in the Render dashboard:

    | Variable      | Value                                                 | Description                              |
    | :------------ | :---------------------------------------------------- | :--------------------------------------- |
    | `MONGODB_URI` | `mongodb+srv://<user>:<pass>@cluster.mongodb.net/...` | Your Atlas connection string             |
    | `MONGODB_DB`  | `flowboard`                                           | Valid database name                      |
    | `PORT`        | `10000`                                               | (Optional) Render usually detects EXPOSE |

4.  **Health Check Path**:
    - Render may ask for a health check path. Use: `/health`

The application will bind to `0.0.0.0:10000` automatically based on the `CMD` in `Dockerfile`.
