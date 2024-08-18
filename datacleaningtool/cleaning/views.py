from django.shortcuts import render

from .serializers import CSVFileSerializer
from .forms import UploadFileForm
import pandas as pd
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

def index(request):
    form = UploadFileForm()
    dataframes = []
    merge = False

    if request.method == 'POST':
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            files = request.FILES.getlist('files')
            for file in files:
                df = pd.read_csv(file)
                dataframes.append(df)

            merge = 'merge' in request.POST

            if merge and len(dataframes) > 1:
                keep_first_header_only = request.POST.get("keep_first_header_only")
                remove_duplicate_rows = request.POST.get("remove_duplicate_rows")
                remove_empty_rows = request.POST.get("remove_empty_rows")

                if keep_first_header_only == "Yes":
                    for i, df in enumerate(dataframes[1:]):
                        df.columns = dataframes[0].columns.intersection(df.columns)
                        dataframes[i+1] = df

                merged_df = pd.concat(dataframes, ignore_index=True, join='outer')

                if remove_duplicate_rows == "Yes":
                    merged_df.drop_duplicates(inplace=True)

                if remove_empty_rows == "Yes":
                    merged_df.dropna(how="all", inplace=True)

                dataframes = [merged_df]

            request.session['dataframes'] = [df.to_dict() for df in dataframes]

            return render(request, 'cleaning/index.html', {
                'form': form,
                'dataframes': dataframes,
                'merge': merge,
            })

    return render(request, 'cleaning/index.html', {'form': form})

class CSVUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        serializer = CSVFileSerializer(data=request.data)
        if serializer.is_valid():
            df = pd.read_csv(request.FILES['file'])
            return Response(df.to_dict(orient="records"))
        return Response(serializer.errors, status=400)

def serve_react_frontend(request, *args, **kwargs):
    return render(request, 'index.html')
