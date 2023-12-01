from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect
from django.http import Http404
from django.urls import reverse
from django.views import generic
from django.utils import timezone

from django.utils.crypto import get_random_string

import pandas as pd
from datetime import datetime

from .models import Material, BasketHeader, BasketLine

def index_get(request):
    basket_cookie = request.COOKIES.get("basket_id")

    token = get_random_string(64)

    response = render(
        request, 
        "webstore/index.html", {
            "token":token,
        }
    )

    if basket_cookie == None:
        response.set_cookie("basket_id", token, max_age=3600)
    
    return response

def index(request):

    if request.method == "GET":
        response = index_get(request)
    elif request.method == "POST":
        add_item(request)

    return response


def add_item(request, material_id):

    basket_cookie = request.COOKIES.get("basket_id")
    try:
        basket = BasketHeader.objects.get(pk=basket_cookie)
    except:
        basket = BasketHeader(basket_id=basket_cookie, basket_saved=datetime.now())
    
    basket.save()


    item_count = basket.basketline_set.count()

    try:
        mat = Material.objects.get(pk=material_id)

        try:
            line = BasketLine.objects.get(material_id=material_id, basket_id=basket_cookie)
            line.amount = line.amount + 1
            line.save()
        except:
            line = BasketLine(line=item_count + 1, material=mat, amount=1, basket=basket)
            line.save()
    
    except:
        print("mat not found")



    return HttpResponseRedirect(reverse("webstore:index"))



def load_data(request):
    df = pd.read_excel("C:\\repos\\webstore_project\\resources\\material.xlsx", sheet_name="material")

    for row in df.iterrows():
        name = row[1].iloc[0]
        desc = row[1].iloc[1]
        price = row[1].iloc[2]
        stock = row[1].iloc[3]
        image = row[1].iloc[4]

        mat = Material(
            name=name,
            description=desc,
            price=price,
            stock=stock,
            image=image
        )

        mat.save()

    return HttpResponse(df)

