FROM ubuntu:latest

# Install Nginx and other dependencies
RUN apt-get update \
    && apt-get install -y nginx \
    && rm -rf /var/lib/apt/lists/*

# Create the necessary user
RUN adduser --system --no-create-home --disabled-login --disabled-password --group nginx

# Copy the nginx.conf file
COPY nginx.conf /etc/nginx/nginx.conf

# Create the necessary directories
RUN mkdir -p /usr/share/nginx/html/Backend \
    && mkdir -p /usr/share/nginx/html/Frontend

# Copy the backend code
COPY Backend /usr/share/nginx/html/Backend

# Copy the frontend code
COPY Frontend /usr/share/nginx/html/Frontend

# Expose the necessary ports
EXPOSE 80

# Start NGINX when the container starts
CMD ["nginx", "-g", "daemon off;"]


