FROM cypress/included:13.15.0

WORKDIR /e2e

COPY package.json package-lock.json ./
RUN npm ci

COPY cypress.config.js .eslintrc.cjs ./
COPY cypress ./cypress

ENTRYPOINT ["npm", "run"]
CMD ["cy:parallel"]
