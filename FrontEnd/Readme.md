# Ultimate Auth - FrontEnd

The front end of the Ultimate Auth project is a React application that uses React.

## Setup

1. Get the google client id from the [google console](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid) and github id [github developer](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authenticating-to-the-rest-api-with-an-oauth-app).
2. Add `.env` file in the root directory and add the following variables:

   ```
   VITE_BACKEND_URL = http://localhost:8000
   VITE_GOOGLE_CLIENT_ID = add_google_client_id_here
   VITE_GITHUB_CLIENT_ID = add_github_client_id_here
   ```

3. To Start you can run the following commands:

   ```
   npm install
   npm run dev
   ```

   - then visit `http://localhost:3000/auth/sign-in` to see the application.

4. Use Docker to run the application for Testing or Production:

   ```
   docker build -t ultimate-auth-frontend .
   docker run -p 3000:3000 ultimate-auth-frontend
   ```

   - then visit `http://localhost:3000/auth/sign-in` to see the application.

## Features

- `React Router` : for routing between pages.
- `Tailwind CSS` : for styling the components.
- `Toastify` : for showing the toast messages.
- `Axios` : for making the http requests.
- `lazy loading and suspense` : for loading the components when needed.
- `Code Splitting` : for splitting the code into chunks.
- `Full Optimized` : for the best performance.
- `Dark Mode` : for changing the theme of the application.
- `Fully Responsive` : for all devices.
