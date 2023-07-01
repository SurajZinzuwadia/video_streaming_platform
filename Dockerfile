# FROM nginx:latest

# # Copy the nginx.conf file
# COPY nginx.conf /etc/nginx/nginx.conf

# # Create a custom user and group
# #RUN groupadd -r your_groupname && useradd -r -g your_groupname your_username

# # Set the user and group for NGINX to use
# #USER your_username

# # Copy the backend code
# COPY Backend /usr/share/nginx/html/Backend

# # Copy the frontend code
# COPY Frontend /usr/share/nginx/html/Frontend

# # Copy the SSL certificates
# COPY SSL_Certificates/liveStream_SSL /etc/nginx/ssl

# # Expose the necessary ports
# EXPOSE 80 443

# # Start NGINX when the container starts
# CMD ["nginx", "-g", "daemon off;"]


FROM nginx:latest

# Copy the nginx.conf file
COPY nginx.conf /etc/nginx/nginx.conf

# Create the necessary directories
RUN mkdir -p /usr/share/nginx/html/Backend \
    && mkdir -p /usr/share/nginx/html/Frontend \
    && mkdir -p /etc/nginx/ssl/SSL_Certificates/liveStream_SSL

# Copy the backend code
COPY Backend /usr/share/nginx/html/Backend

# Copy the frontend code
COPY Frontend /usr/share/nginx/html/Frontend

# Copy the SSL certificates
COPY SSL_Certificates/liveStream_SSL/private.crt /etc/nginx/ssl/SSL_Certificates/liveStream_SSL/private.crt
COPY SSL_Certificates/liveStream_SSL/private.key /etc/nginx/ssl/SSL_Certificates/liveStream_SSL/private.key

# Decrypt the private key
RUN openssl rsa -in /etc/nginx/ssl/SSL_Certificates/liveStream_SSL/private.key -out /etc/nginx/ssl/SSL_Certificates/liveStream_SSL/private_decrypted.key -passin pass:dexter

# Set appropriate permissions for the decrypted private key
RUN chmod 600 /etc/nginx/ssl/SSL_Certificates/liveStream_SSL/private_decrypted.key

# Update the certificate key path in nginx.conf
RUN sed -i 's#/etc/nginx/ssl/SSL_Certificates/liveStream_SSL/private.key#/etc/nginx/ssl/SSL_Certificates/liveStream_SSL/private_decrypted.key#g' /etc/nginx/nginx.conf

# Expose the necessary ports
EXPOSE 8080 8081

# Start NGINX when the container starts
CMD ["nginx", "-g", "daemon off;"]


