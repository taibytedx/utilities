@echo off
setlocal enabledelayedexpansion

pushd %~dp0

set "JAVA_OPTS=!JAVA_OPTS! -XX:+HeapDumpOnOutOfMemoryError -XX:+CrashOnOutOfMemoryError"

REM Only set defaults if not already defined in environment
if not defined OTEL_AGENT_JAR set "OTEL_AGENT_JAR="
if not defined OTEL_ENDPOINT set "OTEL_ENDPOINT=http://localhost:4318"

:parse_args
for %%A in (%*) do (
    if "%%A"=="otel" (
        set "OTEL_AGENT_JAR=opentelemetry-javaagent.jar"
        set "NEXT_IS_ENDPOINT=true"
    ) else if "%%A"=="help" (
        call :print_usage
        exit /b 0
    ) else if defined NEXT_IS_ENDPOINT (
        set "OTEL_ENDPOINT=%%A"
        set "NEXT_IS_ENDPOINT="
    ) else (
        echo Unknown argument: %%A
        call :print_usage
        exit /b 1
    )
)

goto end_parse_args

:end_parse_args

REM Set OTEL_AGENT_PROPERTIES dynamically based on OTEL_ENDPOINT
set OTEL_AGENT_PROPERTIES=-Dotel.exporter.otlp.endpoint=!OTEL_ENDPOINT! ^
-Dotel.service.name=HighByteIntelligenceHub ^
-Dotel.exporter.otlp.protocol=http/protobuf ^
-Dotel.metrics.exporter=otlp ^
-Dotel.logs.exporter=otlp ^
-Dotel.metrics.exporter.interval=30000 ^
-Dotel.traces.sampler=always_off ^
-Dotel.instrumentation.enabled=false ^
-Dotel.instrumentation.runtime-metrics.enabled=true ^
-Dotel.instrumentation.logback-appender.enabled=false ^
-Dotel.instrumentation.log4j-appender.enabled=false ^
-Dotel.instrumentation.jul-appender.enabled=false ^
-Dotel.instrumentation.log4j-context-data.enabled=false ^
-Dotel.javaagent.extensions=com.highbyte.intelligencehub.runtime.otel ^
-Dotel.javaagent.logging=application

if not "!OTEL_AGENT_JAR!"=="" (
    set "JAVA_OPTS=!JAVA_OPTS! -javaagent:lib\!OTEL_AGENT_JAR! !OTEL_AGENT_PROPERTIES!"
    echo Starting HighByte Intelligence Hub with OpenTelemetry agent...
    echo JAVA_OPTS: !JAVA_OPTS!
)

java !JAVA_OPTS! -cp "intelligencehub-runtime.jar;lib/*" com.highbyte.intelligencehub.runtime.Main start

popd
exit /b 0

:print_usage
echo Usage: %~nx0 ^[otel^|help]
echo   otel [collector endpoint]: Use OpenTelemetry agent to collect metrics. Optionally specify a collector endpoint.
echo   help: Show this help message.
