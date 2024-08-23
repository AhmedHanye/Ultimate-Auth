# Ultimate Auth - BackEnd

The back end of the Ultimate Auth project is a Django application that uses Django Rest Framework.

## Setup

1. Create a Database in PostgreSQL and get the credentials.
2. Get the following credentials:
   - [Google OAuth](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid) Client ID and Secret.
   - [Github OAuth](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authenticating-to-the-rest-api-with-an-oauth-app) Client ID and Secret.
   - [Email Host](https://medium.com/django-unleashed/configuring-smtp-server-in-django-a-comprehensive-guide-91810a2bca3f) User and Password.
3. add the following variables in the `.env` file in the root directory:

   ```
   # * SETTINGS
   SECRET_KEY=[REDACTED]
   DEBUG=True
   SITE_NAME="Ultimate Auth"
   SITE_DOMAIN=localhost
   FRONT_END=http://localhost:3000

   # * DATABASE
   PGHOST=[REDACTED]
   PGDATABASE=[REDACTED]
   PGUSER=[REDACTED]
   PGPASSWORD=[REDACTED]

   # * EMAIL CONFIG
   EMAIL_HOST_USER=[REDACTED]
   EMAIL_HOST_PASSWORD=[REDACTED]

   # * Social Auth
   GOOGLE_KEY=[REDACTED]
   GOOGLE_SECRET=[REDACTED]
   GITHUB_KEY=[REDACTED]
   GITHUB_SECRET=[REDACTED]
   ```

4. Run The following commands to install the dependencies and start the server.

   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   python manage.py runserver
   ```

   - then visit `http://127.0.0.1:8000/` to see the application.

5. Use Docker to run the application for Testing or Production:

   ```
   docker build -t ultimate-auth-backend .
   docker run -p 8000:8000 ultimate-auth-backend
   ```

   - then visit `http://localhost:8000` to see the application.

## API Endpoints

- `POST` `/api/token/` : to get the access token and refresh token.
- `POST` `/api/token/refresh/` : to get the new access token.
- `POST` `/api/token/verify/` : to verify the access token.
- `POST` `/api/token/logout/` : to logout the user.
- `POST` `/auth/users/` : to register the user.
- `POST` `/auth/users/resend_activation/` : to resend the activation link.
- `POST` `/auth/users/activation/` : to activate the email.
- `POST` `/auth/google/` : to login with google.
- `POST` `/auth/github/` : to login with github.
- `GET` `/auth/users/me/` : to get the user details.
- `DELETE` `/auth/users/me/` : to delete the user account.
- `POST` `/auth/users/reset_password/` : to ask for password reset.
- `POST` `/auth/users/reset_password_confirm/` : to reset the password.

## Features

- `Django` : for the backend.
- `Django Rest Framework` : for creating the API.
- `PostgreSQL` : for the database.
- `Djoser` : for the user authentication.
- `Simple JWT` : for the JWT authentication.
- `Google Social Auth` : for the google login.
- `Github Social Auth` : for the github login.
- `Django Cors Headers` : for the CORS headers.
- `Security Features` : for the best security like knowing where the login is coming from, protection from DDOS attack and more.
- `Customization` : for the customization of the user model and the user authentication and making the best out of it.
