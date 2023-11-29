from django.db import models

class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=255)
    shipping_address = models.CharField(max_length=255)
    #role = models.CharField(max_length=255)
    created_at = models.DateTimeField()
    hash = models.CharField(max_length=255)

class OrderHeader(models.Model):
    order_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=255)
    order_datetime = models.DateTimeField()

class Material(models.Model):
    material_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField()
    #weight = models.FloatField()
    #volume = models.FloatField()
    price = models.FloatField()
    stock = models.IntegerField()
    image = models.CharField(max_length=255)

class OrderLine(models.Model):
    order = models.ForeignKey(OrderHeader, on_delete=models.CASCADE)
    order_item = models.IntegerField()
    #order_key = models.AutoField(primary_key=True)
    material = models.ForeignKey(Material, on_delete=models.CASCADE)
    order_text = models.TextField()
    status = models.CharField(max_length=32)

class BasketHeader(models.Model):
    basket_id = models.CharField(max_length=64, primary_key=True)
    #user = models.ForeignKey(User, on_delete=models.CASCADE)
    basket_saved = models.DateTimeField()
    #cookie = models.CharField(max_length=64)

class BasketLine(models.Model):
    basket_line_id = models.AutoField(primary_key=True)
    basket = models.ForeignKey(BasketHeader, on_delete=models.CASCADE)
    line = models.IntegerField()
    material = models.ForeignKey(Material, on_delete=models.CASCADE)
    #order_key = models.IntegerField()
