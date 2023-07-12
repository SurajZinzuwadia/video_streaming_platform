# # FROM ubuntu:latest

# # # Install Nginx and other dependencies
# # RUN apt-get update \
# #     && apt-get install -y nginx \
# #     && rm -rf /var/lib/apt/lists/*

# # # Create the necessary user
# # RUN adduser --system --no-create-home --disabled-login --disabled-password --group nginx

# # # Copy the nginx.conf file
# # COPY nginx.conf /etc/nginx/nginx.conf

# # # Create the necessary directories
# # RUN mkdir -p /usr/share/nginx/html/Backend \
# #     && mkdir -p /usr/share/nginx/html/Frontend

# # # Copy the backend code
# # COPY Backend /usr/share/nginx/html/Backend

# # # Copy the frontend code
# # COPY Frontend /usr/share/nginx/html/Frontend

# # # Expose the necessary ports
# # EXPOSE 8081

# # # Start NGINX when the container starts
# # CMD ["nginx", "-g", "daemon off;"]

# FROM ubuntu:latest

# # Install Nginx and other dependencies
# RUN apt-get update \
#     && apt-get install -y nginx \
#     && apt-get install -y nodejs \
#     && rm -rf /var/lib/apt/lists/*

# # Create the necessary user
# RUN adduser --system --no-create-home --disabled-login --disabled-password --group nginx

# # Copy the modified nginx.conf file
# COPY nginx.conf /etc/nginx/nginx.conf

# # Create the necessary directories
# # RUN mkdir -p /usr/share/nginx/html/Backend \
# #     && mkdir -p /usr/share/nginx/html/Frontend/Consumer \
# #     && mkdir -p /usr/share/nginx/html/Frontend/Producer


# # Copy the backend code
# # COPY Backend /usr/share/nginx/html/Backend

# # CMD ["npm", "install"]

# # # # Expose the necessary ports
# # EXPOSE 3000

# # CMD ["node", "index.js"]

# # Copy the consumer frontend code
# COPY Frontend/Producer/producer-ui /usr/share/nginx/html/Frontend/Producer/producer-ui

# CMD ["npm", "install"]

# # Expose the necessary ports
# EXPOSE 8082

# CMD ["npm", "start", "dev"]

# # Copy the producer frontend code
# COPY Frontend/Producer/ /usr/share/nginx/html/Frontend/Producer

# # Expose the necessary ports
# EXPOSE 8081

# # Start NGINX when the container starts
# CMD nginx && node /usr/share/nginx/html/Backend/node-server/index.js


FROM ubuntu:latest

# Install Nginx and other dependencies
RUN apt-get update \
    && apt-get install -y nginx \
    && apt-get install -y gnupg2 \
    && rm -rf /var/lib/apt/lists/*

# Create the necessary user
RUN adduser --system --no-create-home --disabled-login --disabled-password --group nginx

# Copy the custom NGINX configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf


# Copy the static assets of the vanilla JavaScript application
COPY Frontend/Producer/index.html /usr/share/nginx/html
COPY Frontend/Producer/index.js /usr/share/nginx/html

# Expose port 80
EXPOSE 8081

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]