from django.shortcuts import render
from .models import Files
from rest_framework import viewsets
from .serializers import FilesSerializer
import pandas as pd
from django.http import JsonResponse, Http404, FileResponse
from django.shortcuts import get_object_or_404
from .models import Files 
from django.core.paginator import Paginator
import os
from io import StringIO
from django.conf import settings
# import magic
import mimetypes


# Create your views here.

class FilesViewSet(viewsets.ModelViewSet):
    queryset = Files.objects.all()
    serializer_class = FilesSerializer
    
def serve_csv_file(request, file_id):
    # file_path = os.path.join(settings.MEDIA_ROOT, 'store/datasets', f'{file_id}.csv')
    csv_file = get_object_or_404(Files, id=file_id)  

    # Assuming your file is stored on disk and the path is stored in the model
    file_path = csv_file.file.path  # Adjust this line if necessary

    if os.path.exists(file_path):
        df=pd.read_csv(file_path)
        orignal_row_count=len(df)
        df.dropna(inplace=True)
        # row_removed=orignal_row_count-len(df)
        df.drop_duplicates(inplace=True)
        # row_removed+=orignal_row_count-
        df.columns=[col.lower for col in df.columns]
        # row_removed=orignal_row_count-len(df)

        cleaned_file=StringIO()
        df.to_csv(cleaned_file,index=False)
        cleaned_file.seek(0)
        response = FileResponse(cleaned_file, content_type='text/csv')
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
def view_csv_preview(request, file_id):
    # file_path = os.path.join(settings.MEDIA_ROOT, 'store/datasets', f'{file_id}.csv')
    csv_file = get_object_or_404(Files, id=file_id)  

    # Assuming your file is stored on disk and the path is stored in the model
    file_path = csv_file.csv.path  # Adjust this line if necessary
    if os.path.exists(file_path):
        # Read the CSV file into a pandas DataFrame
        mime_type , _ = mimetypes.guess_type(file_path)

        # file_type = mime.from_file(file_path)
        # if mime_type == "application/vnd.ms-excel" or mime_type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        #     temp = pd.read_excel(file_path, sheet_name=file_path+"csv")
        #     temp.to_csv(file_path+"csv")
        #     df=temp
        # else :
        df = pd.read_csv(file_path)
        
        # Store the original number of rows
        original_row_count = len(df)
        
        # Perform data cleaning operations
        # Example: Remove rows with missing values
        df.dropna(inplace=True)
        # rows_removed = original_row_count - len(df_cleaned)
        
        # Example: Remove duplicates
        df.drop_duplicates(inplace=True)
        rows_removed = (original_row_count - len(df))
        
        # Example: Convert all column names to lowercase
        df.columns = [col.lower() for col in df.columns]
        
        # Get the top 5 rows
        top_rows = df.head(5).to_dict(orient='records')
        
        # Return the top 5 rows and the number of rows removed as JSON
        return JsonResponse({
            'data': top_rows,
            'rows_removed': rows_removed
        })
    else:
        raise Http404("File not found")