from django.shortcuts import render
from .models import Files
from rest_framework import viewsets
from .serializers import FilesSerializer
import pandas as pd
from django.http import JsonResponse, Http404, FileResponse
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from django.core.paginator import Paginator
import os
from io import StringIO
from django.conf import settings
# import magic
import mimetypes
from prophet import Prophet


# Create your views here.

class FilesViewSet(viewsets.ModelViewSet):
    queryset = Files.objects.all()
    serializer_class = FilesSerializer
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        file_path = instance.csv.path  

        if os.path.exists(file_path):
            os.remove(file_path)  
            instance.delete()  
            return Response({"message": "File deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"message": "File not found"}, status=status.HTTP_404_NOT_FOUND)
    
def serve_csv_file(request, file_id):
    # file_path = os.path.join(settings.MEDIA_ROOT, 'store/datasets', f'{file_id}.csv')
    csv_file = get_object_or_404(Files, id=file_id)  

    # Assuming your file is stored on disk and the path is stored in the model
    file_path = csv_file.file.path 

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
    
    
@api_view(['POST'])
def get_data_insights(request, file_id):
    # Fetch the CSV file object from the database
    csv_file = get_object_or_404(Files, id=file_id)
    csv_path = csv_file.csv.path

    try:
        df = pd.read_csv(csv_path)
        # Generate basic statistical insights for each column
        insights = {}
        for column in df.select_dtypes(include=['float64', 'int64']):
            insights[column] = {
                'mean': df[column].mean(),
                'median': df[column].median(),
                'variance': df[column].var(),
                'std_dev': df[column].std(),
                'max': df[column].max(),
                'min': df[column].min(),
            }
        
        return JsonResponse({'insights': insights})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
    

@api_view(['POST'])
def get_predictions(request, file_id):
    # Fetch the CSV file object from the database
    csv_file = get_object_or_404(Files, id=file_id)
    csv_path = csv_file.csv.path

    try:
        df = pd.read_csv(csv_path)
        # Assuming the dataset has a 'date' column and a 'value' column
        df['date'] = pd.to_datetime(df['date'])
        df_prophet = df[['date', 'value']].rename(columns={'date': 'ds', 'value': 'y'})

        # Train the Prophet model
        model = Prophet()
        model.fit(df_prophet)

        # Predict future values
        future = model.make_future_dataframe(periods=365)  # 1 year prediction
        forecast = model.predict(future)

        # Return the forecasted values
        forecast_data = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(30).to_dict(orient='records')
        return JsonResponse({'predictions': forecast_data})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
