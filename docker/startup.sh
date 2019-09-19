echo "Starting application..."
echo "API_URL = ${API_URL}"
envsubst < "/usr/share/nginx/html/assets/appConfig.json" > "/usr/share/nginx/html/assets/appConfig.json"
nginx -g 'daemon off;'
