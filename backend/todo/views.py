from django.http.response import JsonResponse
from django.shortcuts import render
from rest_framework import viewsets
from rest_framework import status
from datetime import datetime, timedelta
from dateutil import relativedelta
import requests
import pandas as pd
import json
import os
import csv

from .serializers import TodoSerializer
from .models import Todo

# Create your views here.


class TodoView(viewsets.ModelViewSet):
    serializer_class = TodoSerializer
    queryset = Todo.objects.all()


def listTEST(request):
    # GET list of tutorials, POST a new tutorial, DELETE all tutorials
    today = datetime.now()
    i = 0
    while True:
        latest_date = today - timedelta(i)
        response = requests.get("http://www.kamis.or.kr/service/price/xml.do?action=dailyPriceByCategoryList&p_cert_key=e61f2afa-61ce-4cfd-9233-8f7b23f18575&p_cert_id=2256&p_returntype=json&p_product_cls_code=01&p_item_category_code=100&p_country_code=1101&p_regday=" +
                                datetime.strftime(latest_date, '%Y-%m-%d') + "&p_convert_kg_yn=N")
        i = i + 1
        if response.json()['data']['item'][0]['dpr1'] != '-':
            return JsonResponse(response.json(), status=status.HTTP_200_OK)


def processResponse(response, itemcategorycode, p_regday):
    # print(response.json())

    # for i in range(len(response.json()['data']['item'])):
    #    item = response.json()['data']['item'][i]
    #    print(item)
    # print("***************************************")
    # for item in response.json()['data']['item']:
    json = response.json()
    for i in range(len(response.json()['data']['item'])):
        item = response.json()['data']['item'][i]
        # print(item['item_name'], item['item_code'],  item['kind_code'],  item['rank_code'])
        # tmp_res = requests.get("http://www.kamis.or.kr/service/price/xml.do?action=periodProductList&p_cert_key=e61f2afa-61ce-4cfd-9233-8f7b23f18575&p_cert_id=2256&p_returntype=json&p_startday=" + p_regday + "&p_endday=" + p_regday + "&p_productclscode=01&p_itemcategorycode=" + itemcategorycode + "&p_itemcode=" + item['item_code'] + "&p_kindcode=" + item['kind_code'] + "&p_productrankcode=" + item['rank_code'] + "&p_countrycode=&p_convert_kg_yn=N")
        # print(tmp_res.json()['data']['item'][0]['price'])
        # print(tmp_res.json()['data']['item'][0])
        # print(item['dpr1'], item['dpr2'])
        if(item['dpr1'] == '-' or item['dpr2'] == '-' or item['dpr1'] == item['dpr2']):
            rateOfChange = '-'
        else:
            rateOfChange = (float(item['dpr1'].replace(
                ',', '')) / float(item['dpr2'].replace(',', '')) - 1) * 100
            rateOfChange = round(rateOfChange, 2)
        json['data']['item'][i]['rateOfChange'] = rateOfChange
        '''
        if(item['dpr1'] == '-' or item['dpr2'] == '-' or item['dpr1'] == item['dpr2']):
            json['data']['item'][i]['rateOfChange'] = '-'
        else:
            rateOfChange = (float(item['dpr1'].replace(
                ',', '')) / float(item['dpr2'].replace(',', '')) - 1) * 100
            if(rateOfChange > 0):
                rateOfChange = "▲" + str(abs(round(rateOfChange, 2))) + "%"
            else:
                rateOfChange = "▼" + str(abs(round(rateOfChange, 2))) + "%"
            json['data']['item'][i]['rateOfChange'] = rateOfChange
        '''

    # print("***************************************")
    return json


def price(request, pk):
    # find tutorial by pk (id)
    today = datetime.now()
    i = 0
    while True:
        latest_date = today - timedelta(i)
        response = requests.get("http://www.kamis.or.kr/service/price/xml.do?action=dailyPriceByCategoryList&p_cert_key=e61f2afa-61ce-4cfd-9233-8f7b23f18575&p_cert_id=2256&p_returntype=json&p_product_cls_code=01&p_item_category_code=" +
                                pk + "&p_country_code=&p_regday=" + datetime.strftime(latest_date, '%Y-%m-%d') + "&p_convert_kg_yn=N")
        i = i + 1

        if isinstance(response.json()['data'], list):
            continue
        else:
            # print(type(response.json()['data']))
            if response.json()['data']['item'][0]['dpr1'] == "-":
                continue
            json = processResponse(response, pk, response.json()[
                                   'condition'][0]['p_regday'])
            return JsonResponse(json, status=status.HTTP_200_OK)


p_item_category_code = ['100', '200', '300', '400', '500', '600']


def chart_days(request, category_code):
    # GET all published tutorials
    string = category_code.split('-')
    p_itemcategorycode = string[0]
    p_itemcode = string[1]
    p_kindcode = string[2]
    rank_code = string[3]
    start_date = datetime.today()
    str_date_list1 = []
    while len(str_date_list1) <= 4:
        if(start_date.weekday() < 4):
            if(len(str_date_list1) == 0):
                str_date_list1.append(start_date.strftime('%Y-%m-%d'))
                start_date -= timedelta(days=10)
            else:
                str_date_list1.append(start_date.strftime('%Y-%m-%d'))
                start_date -= timedelta(days=10)
        else:
            start_date -= timedelta(days=1)
    str_date_list = list(reversed(str_date_list1))
    print(str_date_list[0])

    url = ''
    df = pd.DataFrame()
    for i in range(0, len(str_date_list), 1):
        url = 'http://www.kamis.or.kr/service/price/xml.do?action=dailyPriceByCategoryList&p_product_cls_code=01&p_country_code=1101&p_item_category_code=' + \
            p_itemcategorycode+'&p_regday=' + str_date_list[i] + \
            '&p_convert_kg_yn=Y&p_cert_key=e61f2afa-61ce-4cfd-9233-8f7b23f18575&p_cert_id=2256&p_returntype=json'

        response = requests.get(url)
        contents = response.text
        info = json.loads(contents)
        if(len(info['data']) > 1):
            data100 = info['data']['item']
            data = pd.DataFrame(data100)
            name = str((4-i)*10)+'일전'

            data['dpr1'][data['dpr1'] == '-'] = data['dpr2'][data['dpr1'] == '-']
            if(i == 4):
                toD = []
                for k in range(0, len(data), 1):
                    toD.append('당일')
                data['day1'] = toD
            else:
                toD = []
                for k in range(0, len(data), 1):
                    toD.append(name)
                data['day1'] = toD
            df = df.append(data, ignore_index=True)

    rowName = ['item_name', 'item_code',
               'kind_name', 'kind_code', 'rank_code', 'day1', 'rank',  'dpr1']
    df['dpr1'] = df['dpr1'].str.replace(',', '')
    df['dpr1'] = df['dpr1'].str.replace('-', '0')
    df['dpr2'] = df['dpr2'].str.replace(',', '')
    df['dpr2'] = df['dpr2'].str.replace('-', '0')
    df['dpr5'] = df['dpr5'].str.replace(',', '')
    df['dpr5'] = df['dpr5'].str.replace('-', '0')
    df['dpr6'] = df['dpr6'].str.replace(',', '')
    df['dpr6'] = df['dpr6'].str.replace('-', '0')
    df = df.astype({'dpr1': 'int'})
    df = df.astype({'dpr2': 'int'})
    df = df.astype({'dpr5': 'int'})
    df = df.astype({'dpr6': 'int'})
    df = df[df['item_code'] == p_itemcode]
    df = df[df['kind_code'] == p_kindcode]
    df = df[df['rank_code'] == rank_code]
    df = df[rowName]
    df.rename(columns={"day1": "div"}, inplace=True)
    df.rename(columns={"dpr1": "avg_data"}, inplace=True)

    result = df.to_dict('records')
    # p_graderank = "1" if string[3] == "04" else "2"

    return JsonResponse(result, safe=False)


rcode = pd.read_csv('./todo/rank.csv')
rcode.columns = ['p_productrankcode', 'p_graderank', 'rank_name']
rcode['p_graderank'] = rcode['p_graderank'].astype(str)


def chart_months(request, category_code):
    # GET all published tutorials
    string = category_code.split('-')
    p_itemcategorycode = string[0]
    p_itemcode = string[1]
    p_kindcode = string[2]

    p_rank = rcode[rcode['p_productrankcode'] == int(string[3])]
    p_grade = p_rank['p_graderank'].to_string(index=False)
    p_graderank = p_grade.replace(" ", "")

    response = requests.get("http://www.kamis.or.kr/service/price/xml.do?action=monthlySalesList&p_cert_key=e61f2afa-61ce-4cfd-9233-8f7b23f18575&p_cert_id=2256&p_returntype=json&p_yyyy=2022&p_period=1&p_itemcategorycode=" +
                            p_itemcategorycode + "&p_kindcode=" + p_kindcode + "&p_graderank=" + p_graderank + "&p_countycode=&p_convert_kg_yn=N&p_itemcode=" + p_itemcode)
    json = response.json()
    # 딕셔너리로 오는 경우와 리스트로 오는 경우 구분하여 필터하여 하나만 들어있는 리스트로 가공
    # filter(lambda item: item['productclscode'] == "01", json['price'])
    filtered = []
    if type(json['price']) == dict:
        filtered.append(json['price'])
    else:
        for item in json['price']:
            if item['productclscode'] == "01":
                filtered.append(item)

    json['price'] = filtered
    # print(filtered)

    # df = pd.DataFrame()
    # print(df)
    result = []
    time = datetime.today() + relativedelta.relativedelta(years=-1)
    # print(time.strftime("%Y"), time.strftime("%#m"))
    for i in range(12):
        # 최근 12개월을 계산
        time = time + relativedelta.relativedelta(months=1)
        year = time.strftime("%Y")
        month = time.strftime("%#m")

        for j in range(len(json['price'][0]['item'])):
            if (json['price'][0]['item'][j]['yyyy'] == year):

                avg_data = json['price'][0]['item'][j]["m" + month]
                if(avg_data == '-'):
                    avg_data = "0"
                # print(year, month, avg_data)
                # df = df.append({"div":month +"월", "avg_data":int(avg_data.replace(",", ""))}, ignore_index=True)
                result.append(
                    {"div": month + "월", "avg_data": int(avg_data.replace(",", ""))})
                break
    # print(result)
    return JsonResponse(result, safe=False)


def chart_years(request, category_code):
    # GET all published tutorials
    string = category_code.split('-')
    p_itemcategorycode = string[0]
    p_itemcode = string[1]
    p_kindcode = string[2]
    p_rank = rcode[rcode['p_productrankcode'] == int(string[3])]
    p_grade = p_rank['p_graderank'].to_string(index=False)
    p_graderank = p_grade.replace(" ", "")
   # p_graderank = "1" if str[3] == "04" else "2"
    response = requests.get("http://www.kamis.or.kr/service/price/xml.do?action=yearlySalesList&p_cert_key=e61f2afa-61ce-4cfd-9233-8f7b23f18575&p_cert_id=2256&p_returntype=json&p_yyyy=2022&p_itemcategorycode=" +
                            p_itemcategorycode + "&p_itemcode=" + p_itemcode + "&p_kindcode=" + p_kindcode + "&p_graderank=" + p_graderank + "&p_countycode=&p_convert_kg_yn=N")

    json = response.json()
    # print(json['price'][1]['item'])
    # print(json['price'])

    # 딕셔너리로 오는 경우와 리스트로 오는 경우 구분하여 필터하여 하나만 들어있는 리스트로 가공
    # filter(lambda item: item['productclscode'] == "01", json['price'])
    filtered = []
    if type(json['price']) == dict:
        filtered.append(json['price'])
    else:
        for item in json['price']:
            if item['productclscode'] == "01":
                filtered.append(item)

    json['price'] = filtered
    # print(filtered)

    for i in range(len(json['price'][0]['item'])):
        if json['price'][0]['item'][i]['avg_data'] == "-":
            json['price'][0]['item'][i]['avg_data'] == "0"
        json['price'][0]['item'][i]['avg_data'] = int(
            json['price'][0]['item'][i]['avg_data'].replace(",", ""))
        json['price'][0]['item'][i]['max_data'] = int(
            json['price'][0]['item'][i]['max_data'].replace(",", ""))
        json['price'][0]['item'][i]['min_data'] = int(
            json['price'][0]['item'][i]['min_data'].replace(",", ""))

    # 평년 제거
    json['price'][0]['item'].pop(len(json['price'][0]['item'])-1)
    return JsonResponse(json['price'][0]['item'], safe=False)
