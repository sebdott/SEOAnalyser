# base image
FROM node:8.9.1
RUN mkdir /app
WORKDIR /app
ADD . /app
RUN npm install
RUN yarn
#ENV PORT=3000
EXPOSE 8000
CMD yarn start