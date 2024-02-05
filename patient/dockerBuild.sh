docker build -t uniteqlab.azurecr.io/medicity/medicity-fe:latest .
az acr login --name uniteqlab
docker push uniteqlab.azurecr.io/medicity/medicity-fe:latest