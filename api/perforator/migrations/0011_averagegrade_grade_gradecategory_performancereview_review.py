# Generated by Django 3.2.9 on 2021-11-13 09:12

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('perforator', '0010_auto_20211113_1153'),
    ]

    operations = [
        migrations.CreateModel(
            name='GradeCategory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=60)),
                ('description', models.CharField(max_length=60)),
            ],
        ),
        migrations.CreateModel(
            name='PerformanceReview',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('manager_review_categories', models.ManyToManyField(related_name='manager_review_categories', to='perforator.GradeCategory')),
                ('peers_review_categories', models.ManyToManyField(related_name='peers_review_categories', to='perforator.GradeCategory')),
                ('self_review_categories', models.ManyToManyField(related_name='self_review_categories', to='perforator.GradeCategory')),
                ('team_review_categories', models.ManyToManyField(related_name='team_review_categories', to='perforator.GradeCategory')),
            ],
        ),
        migrations.CreateModel(
            name='Review',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_draft', models.BooleanField(default=True)),
                ('is_not_enough_data', models.BooleanField(default=False)),
                ('appraising_person', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='appraising_person', to='perforator.profile')),
                ('evaluated_person', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='evaluated_person', to='perforator.profile')),
                ('performance_review', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, related_name='performance_review', to='perforator.performancereview')),
            ],
        ),
        migrations.CreateModel(
            name='Grade',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('grade', models.IntegerField(null=True, validators=[django.core.validators.MaxValueValidator(4), django.core.validators.MinValueValidator(1)])),
                ('comment', models.CharField(max_length=120)),
                ('grade_category', models.ForeignKey(default=0, on_delete=django.db.models.deletion.DO_NOTHING, to='perforator.gradecategory')),
                ('review', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='perforator.review')),
            ],
        ),
        migrations.CreateModel(
            name='AverageGrade',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('raw_grade', models.FloatField()),
                ('normalized_grade', models.FloatField()),
                ('evaluated_person', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='perforator.profile')),
                ('grade_category', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='perforator.gradecategory')),
                ('performance_review', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='perforator.performancereview')),
            ],
        ),
    ]
