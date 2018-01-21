FROM microsoft/aspnetcore-build:2.0.0 AS build-env

WORKDIR /SEOAnalyserAPI

COPY . .

RUN dotnet restore ./SEOAnalyserAPI.sln

RUN dotnet build ./SEOAnalyserAPI.sln

COPY . ./
RUN dotnet publish -c Release -o out

FROM microsoft/aspnetcore:2.0
WORKDIR /SEOAnalyserAPI
EXPOSE 80
COPY --from=build-env /SEOAnalyserAPI/SEOAnalyserAPI/out .
ENTRYPOINT ["dotnet", "SEOAnalyserAPI.dll"]



