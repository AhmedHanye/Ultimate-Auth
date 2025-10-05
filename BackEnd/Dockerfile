# Use an official Python runtime as a parent image
FROM python:3.13-slim

# Set environment variables to prevent generating .pyc files and to keep Python from buffering stdout and stderr
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /app

# Install system dependencies required for psycopg2 and other packages
RUN apt-get update && apt-get install -y --no-install-recommends gcc libpq-dev && rm -rf /var/lib/apt/lists/*

# Copy the requirements file into the container at /app
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application's code into the container at /app
COPY . .

# The command to run the application will be specified in the docker-compose.yml
# But we can add a default command here as well
CMD ["gunicorn", "ultimate_auth.wsgi:application", "--bind", "0.0.0.0:8000"]
