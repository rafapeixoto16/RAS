#!/bin/bash

# RABBITMQ_HOST	The hostname of the RabbitMQ server.	localhost
# RABBITMQ_PORT	The port number for the RabbitMQ server.	5672
# RABBITMQ_USER	The username for authenticating with RabbitMQ.	guest
# RABBITMQ_PASS	The password for authenticating with RabbitMQ.	guest
# RABBITMQ_REQUESTS_QUEUE_NAME	The RabbitMQ queue name for requests.	watermark-requests
# RABBITMQ_RESULTS_EXCHANGE	The RabbitMQ exchange name to publish results.	picturas.tools
# RABBITMQ_RESULTS_ROUTING_KEY	The RabbitMQ routing key to publish results.	results

export RABBITMQ_USER $RABBITMQ_USERNAME
export RABBITMQ_USER $RABBITMQ_PASSWORD
export RABBITMQ_RESULTS_EXCHANGE $RABBITMQ_FILTER_OUTPUT_QUEUE

cd picturas-watermark-tool-ms
python -m picturas_watermark_tool_ms.main
