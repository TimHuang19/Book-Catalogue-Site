# Generated by Django 3.0.4 on 2020-07-10 03:06

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0009_auto_20200705_1445'),
    ]

    operations = [
        migrations.AddField(
            model_name='collections',
            name='count',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='collections',
            name='date_created',
            field=models.DateTimeField(default=datetime.datetime.now),
        ),
    ]
