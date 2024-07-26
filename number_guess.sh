#!/bin/bash

PSQL="psql --username=freecodecamp --dbname=number_guess -t --no-align -c"

echo "Enter your username:"
read USERNAME

# Query to get username
USER_ID=$($PSQL "SELECT user_id FROM users WHERE username='$USERNAME'")

# Generate random number
SECRET_NUMBER=$(( (RANDOM % 1000) + 1 ))

# If username not found
if [[ -z $USER_ID ]]
then
  echo "Welcome, $USERNAME! It looks like this is your first time here."
  INSERT_NAME=$($PSQL "INSERT INTO users(username) VALUES('$USERNAME')")
  USER_ID=$($PSQL "SELECT user_id FROM users WHERE username='$USERNAME'")
  GAMES_PLAYED=0
  BEST_GAME=0
else
  GAMES_PLAYED=$($PSQL "SELECT COUNT(game_id) FROM games WHERE user_id='$USER_ID'")
  BEST_GAME=$($PSQL "SELECT MIN(attempts) FROM games WHERE user_id='$USER_ID'")
  echo "Welcome back, $USERNAME! You have played $GAMES_PLAYED games, and your best game took $BEST_GAME guesses."
fi

echo "Guess the secret number between 1 and 1000:"

# Looping over the input until user guesses the secret number
TRIES=0
while read GUESS
do
  if [[ ! $GUESS =~ ^[0-9]+$ ]]
  then
    echo "That is not an integer, guess again:"
  else
    ((TRIES++))
    if [[ $GUESS -gt $SECRET_NUMBER ]]
    then
      echo "It's lower than that, guess again:"
    elif [[ $GUESS -lt $SECRET_NUMBER ]]
    then
      echo "It's higher than that, guess again:"
    else
      echo "You guessed it in $TRIES tries. The secret number was $SECRET_NUMBER. Nice job!"
      INSERT_GAME=$($PSQL "INSERT INTO games(user_id, attempts) VALUES($USER_ID, $TRIES)")
      if [[ -z $BEST_GAME ]] || [[ $TRIES -lt $BEST_GAME ]]
      then
        UPDATE_BEST_GAME=$($PSQL "UPDATE users SET best_game=$TRIES WHERE user_id='$USER_ID'")
      fi
      exit
    fi
  fi
done
