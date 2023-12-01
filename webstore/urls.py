from django.urls import path

from . import views

app_name = "webstore"
urlpatterns = [
    path("", views.index, name="index"),
    #path("load/", views.load_data, name="load"),
    path("add_item/<int:material_id>/", views.add_item, name="add_item"),
    #path("place_order/", views.place_order, name="place_order"),
]
