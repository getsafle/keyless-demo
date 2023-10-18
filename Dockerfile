FROM node:18.14.0
ENV HOME=/home
ENV PATH $HOME/app/node_modules/.bin:$PATH
COPY . $HOME/app/
WORKDIR $HOME/app
RUN rm -rf node_modules/ build/
# RUN npm set unsafe-perm true
RUN npm install --force
RUN npm run build
RUN npm install -g serve
COPY . $HOME/app/
EXPOSE 3005
ENTRYPOINT ["serve", "-s", "build", "-p", "3005"]