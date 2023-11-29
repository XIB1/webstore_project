from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect
from django.http import Http404
from django.urls import reverse
from django.views import generic
from django.utils import timezone

from django.utils.crypto import get_random_string

import pandas as pd

from .models import Material

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


def index(request):

    cookie = request.COOKIES.get("basket_id")

    token = get_random_string(64)

    response = render(
        request, 
        "webstore/index.html", {
            "token":token,
        }
    )

    if cookie == None:
        response.set_cookie("basket_id", token, max_age=3600)

    return response