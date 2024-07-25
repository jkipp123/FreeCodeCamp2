#!/bin/bash

if [ -z "$1" ]; then
    echo "Please provide an element as an argument."
    exit
fi

ELEMENT=$1

QUERY_RESULT=$(psql --username=freecodecamp --dbname=periodic_table -t --no-align -c "
    SELECT e.atomic_number, e.name, e.symbol, t.type, p.atomic_mass, p.melting_point_celsius, p.boiling_point_celsius
    FROM elements e
    JOIN properties p ON e.atomic_number = p.atomic_number
    JOIN types t ON p.type_id = t.type_id
    WHERE e.atomic_number::text = '$ELEMENT'
    OR e.symbol = '$ELEMENT'
    OR e.name = '$ELEMENT';
")

if [ -z "$QUERY_RESULT" ]; then
    echo "I could not find that element in the database."
else
    IFS='|' read -r ATOMIC_NUMBER NAME SYMBOL TYPE ATOMIC_MASS MELTING_POINT BOILING_POINT <<< "$QUERY_RESULT"
    echo "The element with atomic number $ATOMIC_NUMBER is $NAME ($SYMBOL). It's a $TYPE, with a mass of $ATOMIC_MASS amu. $NAME has a melting point of $MELTING_POINT celsius and a boiling point of $BOILING_POINT celsius."
fi
