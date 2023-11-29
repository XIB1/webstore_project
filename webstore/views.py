from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect
from django.http import Http404
from django.urls import reverse
from django.views import generic
from django.utils import timezone

from django.utils.crypto import get_random_string


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