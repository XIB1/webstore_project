from django.db import models

from django.contrib.auth.models import User

class OrderHeader(models.Model):
    order_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.RESTRICT)
    status = models.CharField(max_length=255)
    order_datetime = models.DateTimeField()

class Material(models.Model):
    material_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.FloatField()
    date_added = models.DateField()
    image = models.CharField(max_length=255)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=255)

    def __str__(self):
        return str(self.name)
    def __int__(self):
        return self.material_id

class OrderLine(models.Model):
    order = models.ForeignKey(OrderHeader, on_delete=models.CASCADE)
    order_item = models.IntegerField()
    material = models.ForeignKey(Material, on_delete=models.RESTRICT)
    status = models.CharField(max_length=32)

class BasketHeader(models.Model):
    basket_id = models.CharField(max_length=64, primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    basket_saved = models.DateTimeField()

class BasketLine(models.Model):
    basket_line_id = models.AutoField(primary_key=True)
    basket = models.ForeignKey(BasketHeader, on_delete=models.CASCADE)
    line = models.IntegerField()
    material = models.ForeignKey(Material, on_delete=models.CASCADE)