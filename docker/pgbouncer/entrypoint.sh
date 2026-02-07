#!/usr/bin/env bash
set -euo pipefail

: "${PGBOUNCER_LISTEN_PORT:=6432}"
: "${PGBOUNCER_POOL_MODE:=transaction}"
: "${PGBOUNCER_MAX_CLIENT_CONN:=200}"
: "${PGBOUNCER_DEFAULT_POOL_SIZE:=20}"
: "${PGBOUNCER_DB_HOST:=postgres}"
: "${PGBOUNCER_DB_PORT:=5432}"
: "${PGBOUNCER_DB_NAME:=school_analytics}"
: "${PGBOUNCER_DB_USER:=school}"
: "${PGBOUNCER_DB_PASSWORD:=schoolpass}"

mkdir -p /etc/pgbouncer

cat >/etc/pgbouncer/userlist.txt <<EOF
"${PGBOUNCER_DB_USER}" "${PGBOUNCER_DB_PASSWORD}"
EOF

cat >/etc/pgbouncer/pgbouncer.ini <<EOF
[databases]
${PGBOUNCER_DB_NAME} = host=${PGBOUNCER_DB_HOST} port=${PGBOUNCER_DB_PORT} dbname=${PGBOUNCER_DB_NAME} user=${PGBOUNCER_DB_USER} password=${PGBOUNCER_DB_PASSWORD}

[pgbouncer]
listen_addr = 0.0.0.0
listen_port = ${PGBOUNCER_LISTEN_PORT}
auth_type = md5
auth_file = /etc/pgbouncer/userlist.txt
pool_mode = ${PGBOUNCER_POOL_MODE}
max_client_conn = ${PGBOUNCER_MAX_CLIENT_CONN}
default_pool_size = ${PGBOUNCER_DEFAULT_POOL_SIZE}
ignore_startup_parameters = extra_float_digits,search_path
admin_users = ${PGBOUNCER_DB_USER}
server_reset_query = DISCARD ALL
EOF

exec pgbouncer -u pgbouncer /etc/pgbouncer/pgbouncer.ini
