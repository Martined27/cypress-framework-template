FROM cypress/included:13.15.0

WORKDIR /e2e

COPY package.json package-lock.json ./
RUN npm ci

COPY cypress.config.js .eslintrc.cjs parallel-weights.json ./
COPY cypress ./cypress

ENTRYPOINT ["npm", "run"]
CMD ["test:parallel"]
