from django.shortcuts import render
from .models import Files
from rest_framework import viewsets
from .serializers import FilesSerializer
import pandas as pd
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .models import Files 

# Create your views here.

class FilesViewSet(viewsets.ModelViewSet):
    queryset = Files.objects.all()
    serializer_class = FilesSerializer
    
def get_csv_data(request, file_id):
    # Fetch the CSV file object from the database
    csv_file = get_object_or_404(Files, id=file_id)  

    # Assuming your file is stored on disk and the path is stored in the model
    csv_path = csv_file.file.path  # Adjust this line if necessary

    # Read the CSV using pandas
    try:
        df = pd.read_csv(csv_path)
        # Select the first 10 rows and convert to a dictionary
        data = df.head(10).to_dict(orient='records')
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'data': data})
