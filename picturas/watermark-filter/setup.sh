#!/bin/bash

pip install poetry==1.8

export POETRY_NO_INTERACTION=1
export POETRY_VIRTUALENVS_IN_PROJECT=1
export POETRY_VIRTUALENVS_CREATE=1

poetry install --without dev

cp picturas-watermark-tool-ms/watermark.png picturas-watermark-tool-ms/picturas_watermark_tool_ms
