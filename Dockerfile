# base image
FROM node:8

# create and set working directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# copy current directory to working directory
COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app

# install dependencies
RUN yarn install

COPY . /usr/src/app

EXPOSE 3001

CMD ["yarn", "start"]
