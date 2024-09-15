from django.urls import path, include
from rest_framework.routers import DefaultRouter
# from .views import FilesViewSet, get_csv_data, serve_csv_file
from . import views
router = DefaultRouter()
# router.register('files', FilesViewSet, basename='files')


urlpatterns = [
    path("",views.home)

]
