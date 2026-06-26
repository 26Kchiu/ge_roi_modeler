# Use a lightweight Nginx image to serve static content
FROM nginx:stable-alpine

# Copy the static files to the Nginx html directory
COPY . /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
