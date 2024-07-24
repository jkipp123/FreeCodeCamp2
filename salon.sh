#! /bin/bash

PSQL="psql -X --username=freecodecamp --dbname=salon --tuples-only -c"

echo -e "\n~~~~ MY SALON ~~~~~\n"

MAIN_MENU() {
  if [[ $1 ]]
  then
    echo -e "\n$1"
  fi

  echo -e "Here are the services we offer:\n"
  # Show services
  SERVICES_RESULT=$($PSQL "SELECT service_id, name FROM services")
  echo "$SERVICES_RESULT" | while read SERVICE_ID BAR SERVICE_NAME
  do
    echo "$SERVICE_ID) $SERVICE_NAME"
  done
  
  echo -e "\nx) Exit"
  read SERVICE_ID_SELECTED

  if [[ $SERVICE_ID_SELECTED == 'x' ]]
  then
    echo -e "\nThank you for visiting My Salon. Goodbye!"
    exit 0
  elif [[ ! $SERVICE_ID_SELECTED =~ ^[0-9]+$ ]]
  then
    MAIN_MENU "That is not a valid service number"
  else
    echo -e "\nWhat's your phone number?"
    read CUSTOMER_PHONE
    
    CUSTOMER_NAME=$($PSQL "SELECT name FROM customers WHERE phone='$CUSTOMER_PHONE'")
    echo "DEBUG: CUSTOMER_NAME='$CUSTOMER_NAME'"  # Debugging statement

    if [[ -z $CUSTOMER_NAME ]]
    then
      echo -e "\nWhat's your name?"
      read CUSTOMER_NAME_INPUT

      INSERT_CUSTOMER_RESULT=$($PSQL "INSERT INTO customers(phone, name) VALUES ('$CUSTOMER_PHONE', '$CUSTOMER_NAME_INPUT')")
      CUSTOMER_NAME=$CUSTOMER_NAME_INPUT  # Set CUSTOMER_NAME to the input value
    fi
    
    CUSTOMER_ID=$($PSQL "SELECT customer_id FROM customers WHERE phone='$CUSTOMER_PHONE'")
    SERVICE_NAME=$($PSQL "SELECT name FROM services WHERE service_id=$SERVICE_ID_SELECTED")
    echo -e "\nWhat time?"
    read SERVICE_TIME

    CUSTOMER_APPOINTMENT_CONFIRMATION=$($PSQL "INSERT INTO appointments (customer_id, service_id, time) VALUES ('$CUSTOMER_ID', $SERVICE_ID_SELECTED, '$SERVICE_TIME')")

    SET_TO_FALSE_RESULT=$($PSQL "UPDATE services SET available = false WHERE service_id = $SERVICE_ID_SELECTED")

    echo -e "\nI have put you down for a $(echo $SERVICE_NAME | sed -r 's/^ *| *$//g') at $(echo $SERVICE_TIME | sed -r 's/^ *| *$//g'), $(echo $CUSTOMER_NAME | sed -r 's/^ *| *$//g')."
  fi
}

MAIN_MENU
