FROM node

WORKDIR /seaf-high-command

COPY . /seaf-high-command

RUN npm install

RUN npm install pm2 -g  

CMD ["pm2-runtime", "pm2.config.js"]s