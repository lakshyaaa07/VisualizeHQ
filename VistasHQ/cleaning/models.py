from django.db import models
# from django.contrib.auth.models import User
# Create your models here.


class Files(models.Model):
    # user = models.ForeignKey(User, on_delete=models.CASCADE)
    csv = models.FileField(upload_to='store/datasets/')

    def __str__(self):
        return self.csv
