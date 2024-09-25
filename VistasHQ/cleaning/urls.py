from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from .views import FilesViewSet, get_csv_data, serve_csv_file,view_csv_preview, get_data_insights, get_predictions, debug_gemini_ai, categorize_data, analyze_csv_and_generate_models, download_file, analyze_with_multiple_plots

router = DefaultRouter()
router.register('files', FilesViewSet, basename='files')


urlpatterns = [
    path('api/', include(router.urls)),
    path('api/files/<int:file_id>/', get_csv_data, name='get_csv_data'),
    path('api/files/<str:file_id>/', serve_csv_file, name='serve_csv_file'),
    path('api/view_csv_preview/<int:file_id>/', view_csv_preview, name='view_csv_preview'),
    path('api/files/<int:file_id>/insights/', get_data_insights, name='get_data_insights'),
    path('api/files/<int:file_id>/predictions/', get_predictions, name='get_predictions'),
    path('api/files/<int:file_id>/categorize/', categorize_data, name='categorize_data'),
    path('api/debug_gemini_ai/', debug_gemini_ai, name='debug_gemini_ai'),
    path('api/analyze_csv_and_generate_models/', analyze_csv_and_generate_models, name='analyze_csv_and_generate_models'), 
    
    path('api/download/<str:file_type>/<int:file_id>/', download_file, name='download_file'),  # New endpoint for downloading files
    path('api/analyze_with_multiple_plots/', analyze_with_multiple_plots, name='analyze_with_multiple_plots'),  # New endpoint for generating multiple plots
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

