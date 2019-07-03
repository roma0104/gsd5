#!/bin/bash

GSEBD_DIR=`pwd`
TIDDLYWIKI5_DIR=$GSEBD_DIR/node_modules/tiddlywiki

OUTPUT_DIR=$GSEBD_DIR/output
OUTPUT_FILE=gsebd-empty.html
mkdir -p $OUTPUT_DIR

export TIDDLYWIKI_PLUGIN_PATH=$GSEBD_DIR/plugins

( cd $TIDDLYWIKI5_DIR && node ./tiddlywiki.js \
	$GSEBD_DIR/editions/gsebd \
	--verbose \
	--output $GSEBD_DIR/output \
	--rendertiddler $:/core/save/all $OUTPUT_FILE text/plain )

echo Wrote $OUTPUT_DIR/$OUTPUT_FILE maybe
