#!/bin/bash
export $(grep -v '^#' .env | xargs)

DB_NAME="reviewapp"

MYSQL_COMMAND="DROP DATABASE ${DB_NAME};"

mysql -u${DB_ROOT} -p${DB_ROOT_PASSWORD} -e "$MYSQL_COMMAND";