# Generated by Django 4.2.7 on 2023-12-06 10:40

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('webstore', '0005_basketline_order_text_orderline_amount_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='basketheader',
            name='user',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='orderheader',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='orderline',
            name='material',
            field=models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, to='webstore.material'),
        ),
    ]