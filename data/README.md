# Data ingestion

This directory holds all of the data ingestion scripts for pulling in live NCAAF data. There are two main scripts:

* populate-rosters.sh - Designed to be run once per season. Pre-popuates our db with all the players for a given year
* run-score-updates.sh - Designed to be run periodically on days/times when college football is being played. In order to limit scope, it takes in a week parameter, so it will only update data for the given week.

## Rando Notes

* All node js scripts are in their own directory, node_scripts. This leaves the door open to use python scripts for other parts of the pipeline. Node is a good choice for html scraping, python will probably be a better choice for our json -> postrgres transformation, since we already have the models and tools defined in python.
* Each step of the process is neatly separated into its own script. Each script generally takes an input file or directory and outputs a file or set of files. This granularity is good for testing, and also helps ensure we keep a cookie-crumb trail of files to help us debug if problems arise in prod.
* After an ingestion is complete, we can zip up all the files and keep them around in case we need them
