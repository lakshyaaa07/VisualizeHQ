from django.urls import path
from cleaning import views

urlpatterns = [
    path('', views.serve_react_frontend, name='react_frontend'),  # Serve React app on root URL
    path('csv/', views.index, name='csv_upload'),  # Your existing view for CSV upload and processing
    path('<path:path>', views.serve_react_frontend),  # Catch-all for React Router
]
