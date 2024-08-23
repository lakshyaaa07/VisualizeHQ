from django.db import models

# Create your models here.


class Files(models.Model):
    csv = models.FileField(upload_to='store/datasets/')

    def __str__(self):
        return self.csv
