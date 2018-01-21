# SEO Analyser

SEO Analyser is a web application that performs a simple SEO analysis of the text.

User submits a text in English or URL, 

- Filters out stop-words (e.g. ‘or’, ‘and’, ‘a’, ‘the’ etc), 
- Calculates number of occurrences of each word, 
- Number of occurrences on the page of each word listed in meta tags, 
- Number of external links in the text

This is a rough idea of the process of this system.
![alt text](https://raw.githubusercontent.com/codedsphere/SEOAnalyser/master/Images/SEO-Analyser-process.JPG)

**Technologies:-**
- **Main** :  
	- **Front End**: React.js with Node.js
	- **API** : .NET Core 2.0 , C# 
- **Container**: Docker (https://www.docker.com/)
- **Log Management** : Graylog (https://www.graylog.org)

**Tools Used:-**
- Visual Studio 2017
- Docker

**Installation Instruction**

These are the few steps required to set up all the environments in your machine.

First of all you need docker to be set up in your machine. 
For me I am running on Windos OS which my docker containers will be running on Linux settings
You can go to (https://www.docker.com/community-edition) to get the latest version of docker downloads

Go to powershell
Run this command to bring up all the applications and environments in docker

```
docker-compose up -d
```

Once the environment is being brought up you will have the list of application running on your machine.

**Local Path/Ports** : -

- **SEO-Analyser-UI** : localhost:3000
- **SEO-Analyser-API** : localhost:801/swagger
- **GrayLog** : localhost:9038
- **Portainer** : localhost:9000


** GrayLog : Log Management : **  
```
link : localhost:9038 
username : admin 
password : admin
```

**Portainer : Docker Managmenet UI :  **
```
link : localhost:9000 
username : seoadmin 
password : seoadmin
```

** Sample Application Pictures : **  

** SEO Analyser UI : **  
![alt text](https://raw.githubusercontent.com/codedsphere/SEOAnalyser/master/Images/SEO-Analyser.JPG)
** SEO Analyser API : **  
![alt text](https://raw.githubusercontent.com/codedsphere/SEOAnalyser/master/Images/SEO-Analyser-API.JPG)

The idea of this architecture is that, when a user click on the **CheckUp Text** button, the application will received the url or a bulk text. The API will then store the input to Redis and return a token ID to the Client side and perform 3 API calls simultaneously from the client to get the necessary info.

