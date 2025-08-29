# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/0574139f-1ef9-43f5-b8eb-20167696515a

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/0574139f-1ef9-43f5-b8eb-20167696515a) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps to run the frontend:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

### Full-Stack Development

This project now includes a backend server and a database connection. To run the full application locally, follow these steps:

**1. Prerequisites**
- Make sure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
- You will need a running [MySQL](https://www.mysql.com/) server.

**2. Database Setup**
- Create a new database in your MySQL server.
- Rename the `server/.env.example` file to `server/.env`.
- Open `server/.env` and fill in your MySQL database credentials:
  ```
  DB_HOST=your_db_host
  DB_USER=your_db_user
  DB_PASSWORD=your_db_password
  DB_DATABASE=your_db_name
  ```

**3. Backend Setup**
In a new terminal, navigate to the `server` directory and run the following commands:
```sh
# Navigate to the server directory
cd server

# Install backend dependencies
npm i

# Start the backend server
npm run dev
```
The backend server will start on `http://localhost:3001`.

**4. Frontend Setup**
In a separate terminal, run the frontend development server from the root directory:
```sh
# Install frontend dependencies (if you haven't already)
npm i

# Start the frontend development server
npm run dev
```
The frontend will be available at `http://localhost:5173` (or another port if 5173 is busy). The application will now be able to communicate with your local backend server.

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/0574139f-1ef9-43f5-b8eb-20167696515a) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
