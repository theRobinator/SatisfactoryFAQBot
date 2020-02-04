FROM node:12.14.1

WORKDIR /srv
COPY package.json auth.json /srv/
RUN npm install --prod-only
COPY dist /srv/dist
ENTRYPOINT node /srv/dist/index.js
