from django.urls import path

from . import views

app_name = "webstore"
urlpatterns = [
    path("", views.index, name="index"),
    #path("load/", views.load_data, name="load"),
    path("add_item/<int:material_id>/", views.add_item, name="add_item"),
    #path("place_order/", views.place_order, name="place_order"),
    #path("add_user/<str:email>/<str:username>/<str:password>/", views.add_user, name="add_user"),
    path("add_user/", views.add_user, name="add_user"),
    path("login_user/", views.login_user, name="login_user"),
    path("check_login/", views.check_login, name="check_login"),
    path("place_order/", views.place_order, name="place_order"),
]
