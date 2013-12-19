#!/bin/bash
# export.sh: a simple shell script to export data from mongodb 

# define usage function
usage() {
    echo "Usage: $0 data.json"
    exit 1
}

# call usage() function if filename not supplied
[[ $# -eq 0 ]] && usage

# The json file to export 
file=$1
# The mongo database to use
database=test
# The mongo collection to use
collection=`echo $1 | sed s/.json//`

# Exporting from database
mongoexport --db $database --jsonArray --collection $collection | python -mjson.tool >> $1 
