from django.urls import path

from . import views

app_name = "webstore"
urlpatterns = [
    path("", views.index, name="index"),
    #path("load/", views.load_data, name="load"),
    path("get_materials/<int:page_num>/", views.get_materials, name="get_materials"),
    path("get_basket/", views.get_basket, name="get_basket"),
    path("add_item/<int:material_id>/", views.add_item, name="add_item"),
    #path("place_order/", views.place_order, name="place_order"),
    #path("add_user/<str:email>/<str:username>/<str:password>/", views.add_user, name="add_user"),
    path("add_user/", views.add_user, name="add_user"),
    path("login_user/", views.login_user, name="login_user"),
    path("logout_user/", views.logout_user, name="logout_user"),
    path("check_login/", views.check_login, name="check_login"),
    path("place_order/", views.place_order, name="place_order"),
    path("search_type/<str:typed_text>", views.search_type, name="search_type"),
]
