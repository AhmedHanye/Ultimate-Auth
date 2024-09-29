# Use an official Python runtime as a parent image
FROM python:3.13.0rc2-slim

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /app

# Create and activate a virtual environment
RUN python3 -m venv /app/myenv

# Install dependencies using the virtual environment
COPY requirements.txt /app/
RUN /app/myenv/bin/pip install --no-cache-dir -r requirements.txt

# Copy the Django project code into the container
COPY . /app/

# Expose the port that Gunicorn will run on
EXPOSE 8000

# Run the Django migrations using the virtual environment's Python
RUN /app/myenv/bin/python3 manage.py makemigrations
RUN /app/myenv/bin/python3 manage.py makemigrations custom_auth
RUN /app/myenv/bin/python3 manage.py migrate

# Command to run the application using Gunicorn within the virtual environment
CMD ["/app/myenv/bin/gunicorn", "--bind", "0.0.0.0:8000", "ultimate_auth.wsgi:application"]
