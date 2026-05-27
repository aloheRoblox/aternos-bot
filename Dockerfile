FROM node:18-slim
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH
WORKDIR /app
COPY --chown=user package.json /app/
RUN npm install
COPY --chown=user . /app
CMD ["npm", "start"]
