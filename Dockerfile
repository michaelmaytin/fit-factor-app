# Use official Python base image
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install MySQL client dependencies
RUN apt-get update && apt-get install -y default-libmysqlclient-dev gcc

# Copy requirements and install them
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all project files
COPY . .

# Set environment variables
ENV FLASK_APP=fitfactor:create_app
ENV FLASK_ENV=development
ENV PYTHONUNBUFFERED=1

# Expose Flask port
EXPOSE 5000

# Run the Flask app
CMD ["flask", "run", "--host=0.0.0.0"]
