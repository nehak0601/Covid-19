from sqlalchemy import create_engine
import requests
import json
import pandas as pd
from urllib.parse import urlencode
from requests.exceptions import ConnectionError
import os

script_dir = os.path.dirname(__file__) #<-- absolute dir the script is in


def db_connect():
  URL = "https://nepalcorona.info/api/v1/faqs"
  return URL

def fetch_data():
  URL=""
  r = requests.get(url = db_connect())
  data = json.loads(r.text)['data']
  df = pd.DataFrame(data)
  result = pd.DataFrame(df, columns = ['question', 'answer'])
  return result
# db connection:
def sql_connection():
    rel_path = "covid19.db"
    abs_file_path = os.path.join(script_dir, rel_path)
    # print(abs_file_path)

    try:
      con = create_engine('sqlite:///' + abs_file_path)
      return con
    except Error:
      print(Error)



#Insert API_Data into table:
def sql_insert(data):
  con = sql_connection()
  result = data.to_sql('covid6', con, index=False, if_exists='replace')
  print(result)


if __name__ == '__main__':
  #Function call:
  db_connect()
  data = fetch_data()
  sql_insert(data)