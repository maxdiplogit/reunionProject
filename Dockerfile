FROM node:18.0.0


WORKDIR /app


COPY package.json package.json
COPY package-lock.json package-lock.json


# Installing app dependencies
RUN npm install

COPY . .


# Seed the local database for testing purposes
CMD [ "node", "seeds.js" ]

# Run tests
CMD [ "npm", "run", "test" ]