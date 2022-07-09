#!/usr/bin/env sh
SET OCM_NEO4J_DB_URI="bolt://localhost:7687"
SET OCM_NEO4J_DB_USERNAME="neo4j"
SET OCM_NEO4J_DB_PASSWORD="password"

"${JAVA_HOME}/java" -jar ./OC-Manager-0.0.1-SNAPSHOT.jar
