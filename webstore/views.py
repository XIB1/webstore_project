from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import authenticate, login

from django.utils.crypto import get_random_string

from datetime import datetime

from .models import *
from django.contrib.auth.models import User


def index(request):

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

    return HttpResponse(status=200)


def add_user(request): #, email, username, password):

    if request.method == "POST":

        email = request.POST['email']
        username = request.POST['username']
        password = request.POST['password']
    
        try:
            try:
                user = User.objects.get(email=email)
            except ObjectDoesNotExist:
                user = User.objects.create_user(
                    email=email,
                    username=username,
                    password=password
                )
                print(user)
                user.save()
            response = HttpResponse(status=200)
        except:
            response = HttpResponse(status=400)

    return response


def login_user(request):

    if request.method == "POST":

        session_key = get_random_string(64)

        username = request.POST['username']
        password = request.POST['password']

        print(username, password)

        user = authenticate(request, username=username, password=password)

        print(user)

        if user != None:
            login(request, user)

            request.session['session_key'] = session_key

            response = HttpResponse(status=200)
        else:
            response = HttpResponse(status=204)
    
    return response


def check_login(request):
    if request.user.is_authenticated:
        return HttpResponse("User ok")
    else:
        return HttpResponse("Not ok")


'''
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

'''