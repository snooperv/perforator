# Generated by Django 3.1.7 on 2021-11-05 18:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('perforator', '0008_puser_phone'),
    ]

    operations = [
        migrations.AlterField(
            model_name='puser',
            name='phone',
            field=models.CharField(max_length=12),
        ),
    ]
