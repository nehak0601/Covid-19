from sqlalchemy import create_engine
import requests
import json
import pandas as pd
from urllib.parse import urlencode
from requests.exceptions import ConnectionError

def db_connect():
  URL = "https://nepalcorona.info/api/v1/data/world"
  return URL

def fetch_data():
  URL=""
  r = requests.get(url = db_connect())
  data = json.loads(r.text)
  df = pd.DataFrame(data)
  result = pd.DataFrame(df)
  return result

# db connection:
def sql_connection():
    try:
      con = create_engine('sqlite:///covid19.db')
      return con
    except Error:
      print(Error)

#Insert API_Data into table:
def sql_insert(data):
  con = sql_connection()
  result = data.to_sql('covid7', con, index=False, if_exists='replace')
  print(result)


if __name__ == '__main__':
  #Function call:
  db_connect()
  data = fetch_data()
  sql_insert(data)