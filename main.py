from flask import Flask, render_template, request
from sqlalchemy import create_engine
import pandas as pd
import json
import os


script_dir = os.path.dirname(__file__)
rel_path = "covid_data/covid19.db"
abs_file_path = os.path.join(script_dir, rel_path)
con = create_engine('sqlite:///' + abs_file_path) 


app = Flask(__name__)

@app.route('/')
def home():
    country = request.args.get('country', 'country')
    query = "select * from covid4"
    if country != 'country':
      query = "select * from covid4 where country='{}'".format(country)
      update  ="select lastUpdate from covid4 where country='India'"
    df_update=pd.read_sql(query, con)
    # df_update["lastUpdate"] = pd.to_datetime(df_update["lastUpdate"]).dt.strftime('%Y-%m-%d')
    df = pd.read_sql(query, con)
    df_new = df[['country', 'confirmed', 'deaths', 'recovered']].groupby(['country'], as_index=False).sum()
    data_kpis = get_kpis(df_new)
    df_new = df_new.sort_values(['confirmed'], ascending=False).head(50)
    df_new = df_new.to_json(orient='records')
    return render_template("home.html", data=df, chart_data=df_new, data_kpis=data_kpis, country_list=country_names(), mode=country, update=df_update, handler=request)

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
    country_list=df_country.values.tolist()
    return country_list

@app.route("/details")
def details():
    return render_template("details.html",handler=request) 

@app.route("/faq")
def FAQs():
    query = "select * from covid6"
    df=pd.read_sql(query, con)
    return render_template("faq.html", data=df, handler=request)       


if __name__ == "__main__":
   app.run(host='0.0.0.0', debug=True, port=8888)
