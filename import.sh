#!/bin/bash
# import.sh: a simple shell script to import data into mongodb 

# define usage function
usage() {
    echo "Usage: $0 data.json"
    exit 1
}

# define file not found function
not_found() {
    echo "File Not Found."
    exit 1
}

# call usage() function if filename not supplied
[[ $# -eq 0 ]] && usage
# call not_found() function if file does not exist 
[[ ! -f $1 ]] && not_found

# The json file to import
file=$1
# The mongo database to use
database=test
# The mongo collection to use
collection=`echo $1 | sed s/.json//`

# Importing into database
cat $file | tr -d ' ' | mongoimport --jsonArray --db $database --collection $collection -
