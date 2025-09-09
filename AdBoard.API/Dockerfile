# Сборка
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY AdBoard.API/AdBoard.API.csproj AdBoard.API/
COPY AdBoard.DAL/AdBoard.DAL.csproj AdBoard.DAL/
COPY AdBoard.Services/AdBoard.Services.csproj AdBoard.Services/
RUN dotnet restore AdBoard.API/AdBoard.API.csproj

COPY . .
WORKDIR /src/AdBoard.API
RUN dotnet publish -c Release -o /app/publish

# Минимальный рантайм
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish ./

EXPOSE 8080

ENV ASPNETCORE_URLS=http://*:8080
ENTRYPOINT ["dotnet", "AdBoard.API.dll"]
