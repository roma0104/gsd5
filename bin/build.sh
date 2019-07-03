#!/bin/bash

GSD5_DIR=`pwd`
TIDDLYWIKI5_DIR=$GSD5_DIR/node_modules/tiddlywiki

OUTPUT_DIR=$GSD5_DIR/output
OUTPUT_FILE=gsd5-empty.html
mkdir -p $OUTPUT_DIR


pwd
ls -la


export TIDDLYWIKI_PLUGIN_PATH=$GSD5_DIR/plugins

( cd $TIDDLYWIKI5_DIR && node ./tiddlywiki.js \
	$GSD5_DIR/editions/gsd5 \
	--verbose \
	--output $GSD5_DIR/output \
	--rendertiddler $:/core/save/all $OUTPUT_FILE text/plain )

echo Wrote $OUTPUT_DIR/$OUTPUT_FILE maybe
