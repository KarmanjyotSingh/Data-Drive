FROM react:18.2.0

WORKDIR /frontend

COPY package.json /frontend/package.json
COPY package-lock.json /frontend/package-lock.json
COPY public/ /frontend/public/
COPY src/ /frontend/src/

RUN npm install

CMD ["npm", "start"]
