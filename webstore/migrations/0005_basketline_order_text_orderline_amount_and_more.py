# Generated by Django 4.2.7 on 2023-12-04 19:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('webstore', '0004_alter_orderheader_user_delete_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='basketline',
            name='order_text',
            field=models.TextField(default=''),
        ),
        migrations.AddField(
            model_name='orderline',
            name='amount',
            field=models.IntegerField(default=1),
        ),
        migrations.AlterField(
            model_name='orderline',
            name='order_text',
            field=models.TextField(default=''),
        ),
    ]
