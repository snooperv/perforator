# Generated by Django 3.1.7 on 2021-11-05 18:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('perforator', '0006_auto_20211105_1908'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='puser',
            name='phone',
        ),
    ]
