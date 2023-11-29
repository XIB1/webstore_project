from django.urls import path

from . import views

app_name = "webstore"
urlpatterns = [
    path("", views.index, name="index"),
    path("load/", views.load_data, name="index")
]
