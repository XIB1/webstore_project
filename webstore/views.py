from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect
from django.http import Http404
from django.urls import reverse
from django.views import generic
from django.utils import timezone

from django.utils.crypto import get_random_string

def index(request):
    token = get_random_string(64)
    return render(
        request, 
        "webstore/index.html", {
            "token":token,
        }
    )