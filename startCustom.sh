#!/bin/sh

cd "$(dirname "$0")" || exit 1

print_usage() {
  echo "Usage: $0 [otel|help]"
  echo "  otel [collector endpoint]: Use OpenTelemetry agent to collect metrics. Optionally specify a collector endpoint."
  echo "  help: Show this help message."
}

OTEL_AGENT_JAR=""
JAVA_OPTS=""
OTEL_ENDPOINT="http://localhost:4318"
MAIN_CLASS="com.highbyte.intelligencehub.runtime.Main"
ARGS="start"
NODE=""
DB_ARG=""
DB_ENDPOINT="URI"
NODE_NAME="node1Primary"

echo "VIEW_INPUT: $@"

# Parse arguments manually
while [ $# -gt 0 ]; do
  case "$1" in
    otel)
      OTEL_AGENT_JAR="opentelemetry-javaagent.jar"
      if [ -n "$2" ]; then
        OTEL_ENDPOINT="$2"
        shift
      fi
      ;;
    help)
      print_usage
      exit 0
      ;;
    ha)
      MAIN_CLASS="com.highbyte.intelligencehub.runtime.HAMain"
      if [ "$2" = "start" ] || [ "$2" = "create" ]; then
        ARGS="$2"
        shift
      fi
      if [ "$2" = "-n"]; then
        NODE="-n $3"
        shift 2
      else
        NODE="-n $NODE_NAME"
      fi
      if [ "$2" = "-j"]; then
        DB_ARG="-j $3"
        shift 2
      else
        DB_ARG="-j env:$DB_ENDPOINT"
      fi
      ;;
    *)
      echo "Unknown argument: $1"
      print_usage
      exit 1
      ;;
  esac
  shift
done

OTEL_AGENT_PROPERTIES="-Dotel.exporter.otlp.endpoint=${OTEL_ENDPOINT} \
-Dotel.service.name=HighByteIntelligenceHub \
-Dotel.exporter.otlp.protocol=http/protobuf \
-Dotel.metrics.exporter=otlp \
-Dotel.logs.exporter=otlp \
-Dotel.metrics.exporter.interval=30000 \
-Dotel.traces.sampler=always_off \
-Dotel.instrumentation.enabled=false \
-Dotel.instrumentation.runtime-metrics.enabled=true \
-Dotel.instrumentation.logback-appender.enabled=false \
-Dotel.instrumentation.log4j-appender.enabled=false \
-Dotel.instrumentation.jul-appender.enabled=false \
-Dotel.instrumentation.log4j-context-data.enabled=false \
-Dotel.javaagent.extensions=com.highbyte.intelligencehub.runtime.otel \
-Dotel.javaagent.logging=application"


if [ -n "$OTEL_AGENT_JAR" ]; then
  JAVA_OPTS="$JAVA_OPTS -javaagent:lib/$OTEL_AGENT_JAR $OTEL_AGENT_PROPERTIES"
  echo "Starting HighByte Intelligence Hub with OpenTelemetry agent..."
  echo "JAVA_OPTS: $JAVA_OPTS"
fi

echo "MAIN_CLASS: $MAIN_CLASS"
echo "ARGS: $ARGS"
echo "NODE: $NODE"
echo "DB_ARG: $DB_ARG"

# Launch java
exec java $JAVA_OPTS -cp "intelligencehub-runtime.jar:lib/*" $MAIN_CLASS $ARGS $NODE $DB_ARG
