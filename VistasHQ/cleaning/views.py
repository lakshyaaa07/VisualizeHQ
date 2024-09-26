import requests
from django.shortcuts import render
from .models import Files
from rest_framework import viewsets
from .serializers import FilesSerializer
import pandas as pd
from django.conf import settings
from django.http import JsonResponse, Http404, FileResponse
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from django.core.paginator import Paginator
import os
from io import StringIO
import mimetypes
from prophet import Prophet
from rest_framework.decorators import api_view
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
import seaborn as sns
from django.http import FileResponse, Http404


# proj0id - gen-lang-client-0275147480


# GEMINI_API_KEY should be stored in the environment and loaded via settings.py
GEMINI_API_KEY = settings.GEMINI_API_KEY

# Function to make requests to Gemini AI API
def make_gemini_request(prompt):
    generate_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={GEMINI_API_KEY}"
    headers = {
        "Content-Type": "application/json"
    }
    data = {
        "contents": [{
            "parts": [{
                "text": prompt
            }]
        }]
    }

    try:
        response = requests.post(generate_url, headers=headers, json=data)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return None


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
    
# def serve_csv_file(request, file_id):
#     # file_path = os.path.join(settings.MEDIA_ROOT, 'store/datasets', f'{file_id}.csv')
#     csv_file = get_object_or_404(Files, id=file_id)  

#     # Assuming your file is stored on disk and the path is stored in the model
#     file_path = csv_file.file.path 

#     if os.path.exists(file_path):
#         df=pd.read_csv(file_path)
#         orignal_row_count=len(df)
#         df.dropna(inplace=True)
#         # row_removed=orignal_row_count-len(df)
#         df.drop_duplicates(inplace=True)
#         # row_removed+=orignal_row_count-
#         df.columns=[col.lower for col in df.columns]
#         # row_removed=orignal_row_count-len(df)

#         cleaned_file=StringIO()
#         df.to_csv(cleaned_file,index=False)
#         cleaned_file.seek(0)
#         response = FileResponse(cleaned_file, content_type='text/csv')
#         response['Content-Disposition'] = f'attachment; filename="{file_id}.csv"'
#         return response
#     else:
#         raise Http404("File not found")




    
# def get_csv_data(request, file_id):
#     # Fetch the CSV file object from the database
#     csv_file = get_object_or_404(Files, id=file_id)  

#     # Assuming your file is stored on disk and the path is stored in the model
#     csv_path = csv_file.file.path  # Adjust this line if necessary

#     # Read the CSV using pandas
#     try:
#         df = pd.read_csv(csv_path)
#         # Select the first 10 rows and convert to a dictionary
#         data = df.head(10).to_dict(orient='records')
#     except Exception as e:
#         return JsonResponse({'error': str(e)}, status=500)

#     return JsonResponse({'data': data})


# def view_csv_preview(request, file_id):
#     # file_path = os.path.join(settings.MEDIA_ROOT, 'store/datasets', f'{file_id}.csv')
#     csv_file = get_object_or_404(Files, id=file_id)  

#     # Assuming your file is stored on disk and the path is stored in the model
#     file_path = csv_file.csv.path  # Adjust this line if necessary
#     if os.path.exists(file_path):
#         # Read the CSV file into a pandas DataFrame
#         mime_type , _ = mimetypes.guess_type(file_path)
#         df = pd.read_csv(file_path)
        
#         # Store the original number of rows
#         original_row_count = len(df)
        
#         # Perform data cleaning operations
#         # Example: Remove rows with missing values
#         df.dropna(inplace=True)
#         # rows_removed = original_row_count - len(df_cleaned)
        
#         # Example: Remove duplicates
#         df.drop_duplicates(inplace=True)
#         rows_removed = (original_row_count - len(df))
        
#         # Example: Convert all column names to lowercase
#         df.columns = [col.lower() for col in df.columns]
        
#         # Get the top 5 rows
#         top_rows = df.head(5).to_dict(orient='records')
        
#         # Return the top 5 rows and the number of rows removed as JSON
#         return JsonResponse({
#             'data': top_rows,
#             'rows_removed': rows_removed
#         })
#     else:
#         raise Http404("File not found")
    
    
# @api_view(['GET'])
# def get_data_insights(request, file_id):
#     # Fetch the CSV file object from the database
#     csv_file = get_object_or_404(Files, id=file_id)
#     csv_path = csv_file.csv.path

#     try:
#         print(f"Fetching insights for file: {file_id} at path: {csv_path}")
#         df = pd.read_csv(csv_path)
#         # Generate basic statistical insights for each column
#         insights = {}
#         for column in df.select_dtypes(include=['float64', 'int64']):
#             insights[column] = {
#                 'mean': float(df[column].mean()),  # Convert to float
#                 'median': float(df[column].median()),  # Convert to float
#                 'variance': float(df[column].var()),  # Convert to float
#                 'std_dev': float(df[column].std()),  # Convert to float
#                 'max': float(df[column].max()),  # Convert to float
#                 'min': float(df[column].min()),  # Convert to float
#             }
        
#         return JsonResponse({'insights': insights})

#     except Exception as e:
#         return JsonResponse({'error': str(e)}, status=500)
    
# @api_view(['POST'])
# def get_predictions(request, file_id):
#     csv_file = get_object_or_404(Files, id=file_id)
#     csv_path = csv_file.csv.path

#     try:
#         df = pd.read_csv(csv_path)
#         print(df.columns)  # Check available columns
#         # Ensure the correct column names
#         if 'date' not in df.columns or 'value' not in df.columns:
#             return JsonResponse({'error': 'Missing required columns: date or value'}, status=400)

#         df['date'] = pd.to_datetime(df['date'])  # Convert to datetime
#         df_prophet = df[['date', 'value']].rename(columns={'date': 'ds', 'value': 'y'})

#         # Train the Prophet model
#         model = Prophet()
#         model.fit(df_prophet)

#         # Predict future values
#         future = model.make_future_dataframe(periods=365)  # 1 year prediction
#         forecast = model.predict(future)

#         # Return the forecasted values
#         forecast_data = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(30).to_dict(orient='records')
#         return JsonResponse({'predictions': forecast_data})

#     except Exception as e:
#         return JsonResponse({'error': str(e)}, status=500)



# ------------------------------------------------------------------------------------------------------------------------

def serve_csv_file(request, file_id):
    csv_file = get_object_or_404(Files, id=file_id)
    file_path = csv_file.csv.path

    if os.path.exists(file_path):
        df = pd.read_csv(file_path)
        original_row_count = len(df)
        df.dropna(inplace=True)
        df.drop_duplicates(inplace=True)
        df.columns = [col.lower() for col in df.columns]
        
        # AI Cleaning Suggestions
        prompt = f"Suggest improvements for cleaning the following dataset:\n{df.head(10).to_string()}"
        ai_response = make_gemini_request(prompt)

        cleaned_file = StringIO()
        df.to_csv(cleaned_file, index=False)
        cleaned_file.seek(0)

        response = FileResponse(cleaned_file, content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="{file_id}_cleaned.csv"'

        return JsonResponse({
            'message': 'File cleaned and returned',
            'ai_cleaning_suggestions': ai_response['candidates'][0]['content']['parts'][0]['text'] if ai_response else 'No response'
        })
    else:
        raise Http404("File not found")





def view_csv_preview(request, file_id):
    csv_file = get_object_or_404(Files, id=file_id)
    file_path = csv_file.csv.path

    if os.path.exists(file_path):
        # Read the CSV
        df = pd.read_csv(file_path)
        original_row_count = len(df)

        # Send prompt to Gemini AI for cleaning suggestions
        prompt = f"Clean this dataset by fixing or removing incorrect, corrupted, incorrectly formatted, duplicate, or incomplete data:\n{df.head(30).to_string()}"
        ai_response = make_gemini_request(prompt)

        # Check if the AI response is valid
        if ai_response is None or 'candidates' not in ai_response:
            return JsonResponse({'error': 'Failed to get a valid AI response'}, status=500)

        # AI cleaning suggestion
        ai_cleaning_suggestions = ai_response['candidates'][0]['content']['parts'][0]['text']

        # Apply basic cleaning based on common practices
        df.dropna(inplace=True)
        df.drop_duplicates(inplace=True)
        df.columns = [col.lower() for col in df.columns]
        
        # Additional cleaning steps could be dynamically applied using AI's suggestions

        rows_removed = original_row_count - len(df)

        # Prepare cleaned data for preview
        cleaned_data = df.to_dict(orient='records')

        return JsonResponse({
            'data': cleaned_data,
            'rows_removed': rows_removed,
            'ai_cleaning_suggestions': ai_cleaning_suggestions
        })
    else:
        raise Http404("File not found")

    
    
    
    
    
def get_csv_data(request, file_id):
    # Fetch the CSV file object from the database
    csv_file = get_object_or_404(Files, id=file_id)

    # Assuming your file is stored on disk and the path is stored in the model
    csv_path = csv_file.csv.path

    try:
        # Read the CSV using pandas
        df = pd.read_csv(csv_path)
        
        # Select the first 10 rows and convert to a dictionary
        data = df.head(10).to_dict(orient='records')

        # AI Prompt for suggestions on the dataset
        prompt = f"Provide cleaning suggestions or insights for the following dataset:\n{df.head(10).to_string()}"
        ai_response = make_gemini_request(prompt)

        # Check if the AI response is valid
        if ai_response is None or 'candidates' not in ai_response:
            return JsonResponse({'error': 'Failed to get a valid AI response'}, status=500)

        # Extract AI suggestions
        ai_suggestions = ai_response['candidates'][0]['content']['parts'][0]['text']

        # Return the first 10 rows of data and AI suggestions
        return JsonResponse({
            'data': data,
            'ai_suggestions': ai_suggestions
        })

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
    
    
    
    

@api_view(['GET'])
def get_data_insights(request, file_id):
    csv_file = get_object_or_404(Files, id=file_id)
    csv_path = csv_file.csv.path

    try:
        df = pd.read_csv(csv_path)

        # Generate basic statistical insights for numerical columns
        insights = {}
        for column in df.select_dtypes(include=['float64', 'int64']):
            insights[column] = {
                'mean': float(df[column].mean()),
                'median': float(df[column].median()),
                'variance': float(df[column].var()),
                'std_dev': float(df[column].std()),
                'max': float(df[column].max()),
                'min': float(df[column].min()),
            }

        # AI-driven insights based on dataset description
        prompt = f"Provide additional insights or suggestions for improving this dataset:\n{df.describe().to_string()}"
        ai_response = make_gemini_request(prompt)

        # Validate AI response
        if ai_response is None or 'candidates' not in ai_response:
            return JsonResponse({'error': 'Failed to get a valid AI response'}, status=500)

        # Extract AI insights
        ai_insights = ai_response['candidates'][0]['content']['parts'][0]['text']

        return JsonResponse({
            'insights': insights,
            'ai_insights': ai_insights  # Include AI insights in the response
        })

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)






@api_view(['POST'])
def get_predictions(request, file_id):
    csv_file = get_object_or_404(Files, id=file_id)
    csv_path = csv_file.csv.path

    try:
        df = pd.read_csv(csv_path)

        # Ensure 'date' and 'value' columns are present
        if 'date' not in df.columns or 'value' not in df.columns:
            return JsonResponse({'error': 'Missing required columns: date or value'}, status=400)

        # Convert 'date' to datetime and prepare data for Prophet
        df['date'] = pd.to_datetime(df['date'])
        df_prophet = df[['date', 'value']].rename(columns={'date': 'ds', 'value': 'y'})

        # Train the Prophet model
        model = Prophet()
        model.fit(df_prophet)

        # Create future dates for predictions and predict
        future = model.make_future_dataframe(periods=365)
        forecast = model.predict(future)

        # AI-driven predictions for next year
        prompt = f"Based on this dataset, provide predictions for the next year:\n{df.tail(50).to_string()}"
        ai_response = make_gemini_request(prompt)
        
        # Handle AI response
        if ai_response is None or 'candidates' not in ai_response:
            return JsonResponse({'error': 'Failed to get a valid AI response'}, status=500)

        # Prepare Prophet and AI predictions for the response
        forecast_data = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(30).to_dict(orient='records')
        ai_predictions = ai_response['candidates'][0]['content']['parts'][0]['text']

        return JsonResponse({
            'prophet_predictions': forecast_data,
            'ai_predictions': ai_predictions
        })

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)




@api_view(['POST'])
def categorize_data(request, file_id):
    """Categorize dataset using AI based on the provided data."""
    csv_file = get_object_or_404(Files, id=file_id)
    csv_path = csv_file.csv.path

    try:
        df = pd.read_csv(csv_path)

        # AI Prompt to categorize data
        prompt = f"Please categorize the following dataset. It contains different types of data such as numerical, categorical, or time-series information. Help me classify each column and suggest potential uses for the data:\n{df.head(10).to_string()}"
        ai_response = make_gemini_request(prompt)

        # Handle AI response
        if ai_response is None or 'candidates' not in ai_response:
            return JsonResponse({'error': 'Failed to get a valid AI response'}, status=500)

        # Return AI's categorization as response
        return JsonResponse({
            'categorization': ai_response['candidates'][0]['content']['parts'][0]['text']
        })

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
    
    
    
@api_view(['POST'])
def debug_gemini_ai(request):
    """
    A simple view to test the Gemini AI integration.
    Expects a JSON payload with a 'prompt' key.
    """
    prompt = request.data.get('prompt', None)
    file_id = request.data.get('file_id', None)
    csv_file = get_object_or_404(Files, id=file_id)
    csv_path = csv_file.csv.path

    if not prompt:
        return JsonResponse({'error': 'Prompt is required'}, status=400)

    try:
        df = pd.read_csv(csv_path)
        
        # AI Prompt to categorize data
        prompt = f"{prompt}:\n{df.head(30).to_string()}"
        ai_response = make_gemini_request(prompt)

        if ai_response is None:
            return JsonResponse({'error': 'AI response was None'}, status=500)
        
        print(f"Ai response - {ai_response}")
        # Check if the response contains the expected structure
        # if 'choices' not in ai_response or not ai_response['choices']:
        #     return JsonResponse({'error': 'Unexpected AI response format'}, status=500)
        
        return JsonResponse({
            'prompt': prompt,
            'ai_response': ai_response['candidates'][0]['content']['parts'][0]['text']
        })

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)




@api_view(['POST'])
def analyze_csv_and_generate_models(request):
    prompt = request.data.get('prompt', None)
    file_id = request.data.get('file_id', None)
    csv_file = get_object_or_404(Files, id=file_id)
    csv_path = csv_file.csv.path

    if not prompt:
        return JsonResponse({'error': 'Prompt is required'}, status=400)

    try:
        # Load CSV data into a DataFrame
        df = pd.read_csv(csv_path)

        # Step 1: Generate Graphs and Identify Outliers
        graph_dir = os.path.join(settings.MEDIA_ROOT, 'graphs')
        if not os.path.exists(graph_dir):
            os.makedirs(graph_dir)
        
        # Update the graph filename to include the file_id
        graph_path = os.path.join(graph_dir, f'boxplot_{file_id}.png')

        plt.figure(figsize=(10, 6))
        sns.boxplot(data=df)  # Example for outliers detection with boxplot
        plt.title("Outliers in Dataset")
        plt.savefig(graph_path)  # Save plot to file system
        plt.close()  # Close the figure to free up memory

        # Step 2: Build a Simple Machine Learning Model (Example: Linear Regression)
        if 'value' in df.columns and 'date' in df.columns:
            X = df[['value']]  # Example feature column
            y = pd.to_datetime(df['date']).values.astype(float)  # Example target column

            model = LinearRegression()
            model.fit(X, y)

            # Generate prediction example
            predictions = model.predict(X)

            # Add predictions to the DataFrame
            df['predictions'] = predictions

        # Step 3: Use AI (Gemini) for further analysis
        prompt = f"Provide insights and suggestions for improving the analysis of the following dataset:\n{df.head(10).to_string()}"
        ai_response = make_gemini_request(prompt)

        # Check if AI responded properly
        if ai_response is None or 'candidates' not in ai_response:
            return JsonResponse({'error': 'Failed to get a valid AI response'}, status=500)

        # Return CSV data, graphs, and AI response
        cleaned_file = StringIO()
        df.to_csv(cleaned_file, index=False)
        cleaned_file.seek(0)

        # Save cleaned CSV file to media directory
        cleaned_csv_path = os.path.join(settings.MEDIA_ROOT, f'cleaned_{file_id}.csv')
        with open(cleaned_csv_path, 'w') as f:
            f.write(cleaned_file.getvalue())

        response = FileResponse(cleaned_file, content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="{file_id}_cleaned.csv"'

        # Update the graph URL and cleaned CSV URL
        graph_url = f'{settings.MEDIA_URL}graphs/boxplot_{file_id}.png'
        cleaned_csv_url = f'{settings.MEDIA_URL}cleaned_{file_id}.csv'

        return JsonResponse({
            'message': 'CSV file processed and analyzed',
            'ai_insights': ai_response['candidates'][0]['content']['parts'][0]['text'],
            'graph_url': graph_url,  # Graph URL accessible via Django's media system
            'cleaned_csv_url': cleaned_csv_url  # URL for the cleaned CSV file
        })

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@api_view(['POST'])
def analyze_with_multiple_plots(request):
    file_id = request.data.get('file_id', None)
    plot_types = request.data.get('plot_types', [])  # Expecting a list of plot types
    csv_file = get_object_or_404(Files, id=file_id)
    csv_path = csv_file.csv.path

    try:
        # Load CSV data into a DataFrame
        df = pd.read_csv(csv_path)

        # Create a directory for plots if it doesn't exist
        plot_dir = os.path.join(settings.MEDIA_ROOT, 'plots')
        if not os.path.exists(plot_dir):
            os.makedirs(plot_dir)

        plot_urls = []

        for plot_type in plot_types:
            plot_path = os.path.join(plot_dir, f'{plot_type}_{file_id}.png')
            plt.figure(figsize=(10, 6))

            if plot_type == 'histogram':
                sns.histplot(df, kde=True)  # Histogram with KDE
                plt.title("Histogram of Features")
            elif plot_type == 'scatter':
                x_col = request.data.get('x_column')
                y_col = request.data.get('y_column')
                sns.scatterplot(data=df, x=x_col, y=y_col)
                plt.title(f"Scatter Plot of {x_col} vs {y_col}")
            elif plot_type == 'heatmap':
                correlation = df.corr()
                sns.heatmap(correlation, annot=True, cmap='coolwarm')
                plt.title("Correlation Heatmap")
            elif plot_type == 'pairplot':
                sns.pairplot(df)
                plt.title("Pair Plot of Features")
            elif plot_type == 'bar':
                category_col = request.data.get('category_column')
                value_col = request.data.get('value_column')
                sns.barplot(data=df, x=category_col, y=value_col)
                plt.title(f"Bar Plot of {value_col} by {category_col}")
            elif plot_type == 'violin':
                category_col = request.data.get('category_column')
                value_col = request.data.get('value_column')
                sns.violinplot(data=df, x=category_col, y=value_col)
                plt.title(f"Violin Plot of {value_col} by {category_col}")

            # Save the plot
            plt.savefig(plot_path)
            plt.close()

            plot_url = f'{settings.MEDIA_URL}plots/{plot_type}_{file_id}.png'
            plot_urls.append(plot_url)

        return JsonResponse({
            'message': 'Plots generated successfully',
            'plot_urls': plot_urls
        })

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    

@api_view(['GET'])
def download_file(request, file_type, file_id):
    file_map = {
        'csv': f'cleaned_{file_id}.csv',
        'plot': f'boxplot_{file_id}.png',  # This can change based on the plot type.
    }

    file_name = file_map.get(file_type)
    if not file_name:
        raise Http404('File not found')

    file_path = os.path.join(settings.MEDIA_ROOT, 'graphs' if file_type == 'plot' else '', file_name)
    try:
        response = FileResponse(open(file_path, 'rb'))
        return response
    except FileNotFoundError:
        raise Http404('File not found')
