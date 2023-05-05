FROM node:16
WORKDIR /root
COPY . .
RUN npm install --registry https://registry.npm.taobao.org && npm run build


FROM alpine:3.17
WORKDIR /root
COPY --from=0 /root/bin/caddy_2.6.4_linux_amd64.tar.gz .
RUN tar xzf caddy_2.6.4_linux_amd64.tar.gz && chown 755 caddy
COPY --from=0 /root/build/ .
COPY --from=0 /root/Caddyfile .
CMD ["./caddy", "run"]
