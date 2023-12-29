from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import authenticate, login, logout
from django.urls import reverse
from django.utils.html import escape
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt

from django.utils.crypto import get_random_string

from datetime import datetime
from django.utils import timezone
import random

from .models import *
from django.contrib.auth.models import User


def index(request):

    basket_cookie = request.COOKIES.get("basket_id")
    count = 0

    if basket_cookie != None:
        try:
            basket = BasketHeader.objects.get(pk=basket_cookie)
            count = basket.basketline_set.count()
        except:
            pass
    
    users = User.objects.all()

    response = render(
        request, 
        "webstore/index.html", {
            "token":"ok",
            "basket_count":count,
            "users":users
        }
    )

    if basket_cookie == None:
        token = get_random_string(64)
        response.set_cookie("basket_id", token, max_age=3600)
    
    return response


def get_materials(request, page_num, search_term, material_id):

    basket_cookie = request.COOKIES.get("basket_id")

    csrf_cookie = request.COOKIES.get("csrftoken")

    if csrf_cookie == None:
        get_token(request)

    if material_id != None and material_id != 0:
        mats = Material.objects.filter(material_id=material_id)
    elif search_term != None and search_term != 'null':
        mats = Material.objects.filter(name__contains=search_term)
    else:
        mats = Material.objects.all()[20*(page_num - 1):20*page_num]

    mat_data = []
    for m in mats:
        d = {
            'id': m.material_id,
            'name': m.name,
            'desc': m.description,
            'price': m.price,
            #'stock': m.stock,
            'date': m.date_added,
            'image':m.image,
        }
        mat_data.append(d)

    response = JsonResponse({"items":mat_data})

    if basket_cookie == None:
        token = get_random_string(64)
        response.set_cookie("basket_id", token, max_age=3600)
    
    return response

@csrf_exempt
def create_item(request):

    print(request.user.is_authenticated)

    if request.method != "POST":
        return JsonResponse({"error": "invalid request"}, status=400)
    
    if request.user.is_authenticated:

        title = request.POST.get('title')
        description = request.POST.get('description')
        price = request.POST.get('price')

        print(title, description, price)

        try:
            item = Material.objects.create(
                name=title,
                description=description,
                price=price,
                date_added=datetime.today(),
                owner=request.user,
            )
            item.save()
            response = JsonResponse({"status":"ok"}, status=200)
        except:
            response = JsonResponse({"error": "bad input"}, status=400)
    else:
        response = JsonResponse({"error":"not authenticated"}, status=401)


    
    return response


def get_basket(request):

    basket_cookie = request.COOKIES.get("basket_id")

    try:
        basket = BasketHeader.objects.get(pk=basket_cookie)
        print(basket)
        lines = basket.basketline_set.all()
        lines_data = []
        
        for line in lines:
            line_data = {
                'line': line.line,
                'material': int(line.material),
                'amount': line.amount,
                'order_text': line.order_text,
            }
            lines_data.append(line_data)

        response = JsonResponse({"items":lines_data})
    except ObjectDoesNotExist:
        response = JsonResponse({"error": "Basket not found"}, status=404)
    except Exception as e:
        response = JsonResponse({"error": str(e)}, status=500)
    
    return response
    

def add_item(request, material_id):

    basket_cookie = request.COOKIES.get("basket_id")

    response = HttpResponse()
    
    if basket_cookie == None:
        basket_cookie = get_random_string(64)
        response.set_cookie("basket_id", basket_cookie, max_age=3600)

    
    try:
        basket = BasketHeader.objects.get(pk=basket_cookie)
    except:
        basket = BasketHeader(basket_id=basket_cookie, basket_saved=timezone.now())
    
    basket.basket_saved = timezone.now()
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
        
        basket.basket_saved = timezone.now()
    
    except:
        print("mat not found")

    return response


def add_user(request):

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

@csrf_exempt
def login_user(request):

    if request.method == "POST":

        
        print(request)


        session_key = get_random_string(64)
        
        username = request.POST.get('username')
        password = request.POST.get('password')


        user = authenticate(request, username=username, password=password)


        if user != None:
            login(request, user)

            request.session['session_key'] = session_key

            response = JsonResponse({"status":"user logged in successfully"})

            
            basket_cookie = request.COOKIES.get("basket_id")

            if basket_cookie == None:
                basket_cookie = get_random_string(64)
                response.set_cookie("basket_id", basket_cookie, max_age=3600)
            
            try:
                basket = BasketHeader.objects.get(pk=basket_cookie)
            except ObjectDoesNotExist:
                try:
                    basket = BasketHeader.objects.get(user=user)
                    response.set_cookie("basket_id", basket.basket_id, max_age=3600)
                except ObjectDoesNotExist:
                    basket = BasketHeader(basket_id=basket_cookie)
            
            basket.user = user
            basket.basket_saved = timezone.now()
            basket.save()

        else:
            response = JsonResponse({"status":"username or password incorrect"}, status=400)

    return response


def logout_user(request):
    logout(request)
    response = JsonResponse({"status":"user successfully logged out"})
    return response


@csrf_exempt
def change_password(request):

    if request.method == "POST" and request.user.is_authenticated:

        oldpass = request.POST.get('oldpass')
        conf_oldpass = request.POST.get('conf_oldpass')
        newpass = request.POST.get('newpass')

        if oldpass != conf_oldpass:
            return JsonResponse({"status":"passwords not matching"}, status=400)

        user = authenticate(request, username=request.user.username, password=oldpass)

        if user != None:
            user.set_password(newpass)
            user.save()
            return JsonResponse({"status":"password changed"})
        else:
            return JsonResponse({"status":"password incorrect"}, status=400)




def check_login(request):
    if request.user.is_authenticated:
        return JsonResponse({"loggedIn":True})
    else:
        return JsonResponse({"loggedIn":False})


def place_order(request):

    if request.user.id == None:
        return HttpResponse(status=401)
    
    user = request.user

    basket_cookie = request.COOKIES.get("basket_id")

    try:
        basket = BasketHeader.objects.get(basket_id=basket_cookie)
    except ObjectDoesNotExist:
        return HttpResponse(status=204)
    
    try:
        new_order = OrderHeader(
            user=user,
            status="Order Received",
            order_datetime=timezone.now()
        )

        new_order.save()
    except:
        return HttpResponse("Could not create order")
    
    try:
        for item in basket.basketline_set.all():
            order_line = new_order.orderline_set.create(
                order_item=item.line,
                material=item.material,
                amount=item.amount,
                order_text="",
                status="Not processed"
            )
            order_line.save()
    except:
        return HttpResponse("Issue creating order lines")
    
    basket.delete()

    return HttpResponse("Success")


def search_type(request, typed_text):

    sanitized_text = escape(typed_text)

    results = Material.objects.filter(name__contains=sanitized_text)

    lines_data = []
    for line in results[:3]:
        line_data = {
            'name': line.name, 
            'description': line.description,
            'price': line.price,
            'id': line.material_id,
        }
        lines_data.append(line_data)
    
    response = JsonResponse({"items":lines_data})

    return response


def populate_db(request):

    User.objects.all().delete()

    for i in range(6):
        x = random.randint(100, 999)
        user = User.objects.create_user(
            email='test' + str(x) + '@test.com',
            username='test' + str(x),
            password='pass' + str(x),
        )
        user.save()
    
    return HttpResponse()
    


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