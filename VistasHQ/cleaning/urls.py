from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FilesViewSet, get_csv_data, serve_csv_file

router = DefaultRouter()
router.register('files', FilesViewSet, basename='files')


urlpatterns = [
    path('api/', include(router.urls)),
    path('api/files/<int:file_id>/', get_csv_data, name='get_csv_data'),
    path('api/files/<str:file_id>/', serve_csv_file, name='serve_csv_file'),
]
