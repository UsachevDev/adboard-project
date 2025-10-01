# -------- Build stage --------
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Копируем проекты целиком (надёжнее на разных CI)
COPY AdBoard.API/ AdBoard.API/
COPY AdBoard.DAL/ AdBoard.DAL/
COPY AdBoard.Services/ AdBoard.Services/

# Restore
RUN dotnet restore AdBoard.API/AdBoard.API.csproj

# Publish
WORKDIR /src/AdBoard.API
RUN dotnet publish -c Release -o /app/publish

# -------- Runtime stage --------
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish ./

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "AdBoard.API.dll"]
