# Generated by Django 4.2.7 on 2023-12-01 17:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('webstore', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='basketline',
            name='amount',
            field=models.IntegerField(default=1),
        ),
    ]
