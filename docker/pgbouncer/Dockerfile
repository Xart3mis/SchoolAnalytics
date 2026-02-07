FROM alpine:3.21

RUN apk add --no-cache pgbouncer bash
RUN adduser -D -H -s /sbin/nologin pgbouncer

COPY docker/pgbouncer/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 6432
ENTRYPOINT ["/entrypoint.sh"]
