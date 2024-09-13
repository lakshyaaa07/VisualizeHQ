from django.shortcuts import render
from .models import Files
from rest_framework import viewsets
from .serializers import FilesSerializer
import pandas as pd
from django.http import JsonResponse, Http404, FileResponse
from django.shortcuts import get_object_or_404
from .models import Files 
import os
from django.conf import settings

# Create your views here.

class FilesViewSet(viewsets.ModelViewSet):
    queryset = Files.objects.all()
    serializer_class = FilesSerializer
    
def serve_csv_file(request, file_id):
    file_path = os.path.join(settings.MEDIA_ROOT, 'store/datasets', f'{file_id}.csv')
    if os.path.exists(file_path):
        response = FileResponse(open(file_path, 'rb'), content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="{file_id}.csv"'
        return response
    else:
        raise Http404("File not found")
    
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
