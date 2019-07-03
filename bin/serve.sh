#!/bin/bash

GSEBD_DIR=`pwd`
TIDDLYWIKI5_DIR=$GSEBD_DIR/node_modules/tiddlywiki

export TIDDLYWIKI_PLUGIN_PATH=$GSEBD_DIR/plugins
export TW_SERVE_EDITION_PATH=$GSEBD_DIR/editions/gsebd-server
( cd $TIDDLYWIKI5_DIR && ./bin/serve.sh )
