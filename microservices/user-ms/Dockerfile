FROM node:16-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.build.json ./
COPY tsconfig.json ./

RUN npm install

RUN npm run build

EXPOSE 4002

################
## PRODUCTION ##
################

FROM node:16-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Set work dir
WORKDIR /usr/src/app

COPY --from=development /usr/src/app/ .

EXPOSE 4002

# run app
CMD [ "node", "dist/main"]