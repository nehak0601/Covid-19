from sqlalchemy import create_engine
import requests
import pandas as pd
from urllib.parse import urlencode
from requests.exceptions import ConnectionError
import os

script_dir = os.path.dirname(__file__) #<-- absolute dir the script is in

def db_connect():
  API_URL = "https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/stats"
  URL = API_URL
  return URL

def fetch_data():
  URL=""
  headers = {
    'x-rapidapi-host': "covid-19-coronavirus-statistics.p.rapidapi.com",
    'x-rapidapi-key': "b01f036d64msh1d0ff32e4912881p162983jsnbd99ccf2be75"
    }

  r = requests.get(url = db_connect(),headers=headers)
  data1=r.json()
  # df = pd.DataFrame(data1['data'])
  df = pd.DataFrame(data1['data'])
  df=df['covid19Stats'].to_list()
  df1=pd.DataFrame(df)
  # df['lastChecked'] = df['lastChecked'].apply(lambda v: pd.to_datetime(v))
  return df1

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
  result = data.to_sql('covid4', con, index=False, if_exists='replace')
  print(result)


if __name__ == '__main__':
  #Function call:
  db_connect()
  data = fetch_data()
  sql_insert(data)