FROM react:18.2.0

WORKDIR /chonky-frontend

COPY package.json /chonky-frontend/package.json
COPY package-lock.json /chonky-frontend//package-lock.json
COPY public/ /chonky-frontend/public/
COPY src/ /chonky-frontend/src/

RUN npm install

CMD ["npm", "start"]

