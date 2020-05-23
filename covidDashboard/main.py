from flask import Flask, render_template, request
from sqlalchemy import create_engine
import pandas as pd
import json
con = create_engine('sqlite:///covid19.db') 

app = Flask(__name__)

@app.route("/")
def home():
    country = request.args.get('country', 'country')
    query = "select * from covid4"
    if country != 'country':
      query = "select * from covid4 where country='{}'".format(country)
    df = pd.read_sql(query, con)
    df_new = df[['country', 'confirmed', 'deaths', 'recovered']].groupby(['country'], as_index=False).sum()
    data_kpis = get_kpis(df_new)
    df_new = df_new.sort_values(['confirmed'], ascending=False).head(50)
    df_new = df_new.to_json(orient='records')
    print(df_new)
    return render_template("home.html", data=df, chart_data=df_new, data_kpis=data_kpis, list1=country_names(), handler={'btn': country_names}, mode=country)

def get_kpis(df):
    title = ["Total Countries","Confirmed Cases", "Case Recovered", "Confirmed Deaths"]
    kpis = {}
    df_titles = {
      'country': 'len',
      'confirmed': 'sum',
      'recovered': 'sum',
      'deaths': 'sum'
      }

    flag = 0
    for key, value in df_titles.items():
      kpis[title[flag]] = eval(value + '(df[key])')
      flag += 1
    return kpis  

def country_names():
    df_country=pd.read_sql('select distinct country from covid4',con)
    list1=df_country.values.tolist()
    return list1

@app.route("/details")
def details():
    return render_template("details.html")    

if __name__ == "__main__":
    app.run(debug=True, port=8080)