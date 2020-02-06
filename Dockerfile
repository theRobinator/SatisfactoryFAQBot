FROM node:12.14.1

WORKDIR /srv
COPY package.json /srv/
RUN npm install --prod-only
COPY container-startup.sh /srv/container-startup.sh
COPY dist /srv/dist
ENTRYPOINT bash container-startup.sh
