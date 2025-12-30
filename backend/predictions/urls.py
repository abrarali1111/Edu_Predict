from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views, views_auth, views_support

router = DefaultRouter()
router.register(r'support', views_support.SupportTicketViewSet, basename='support')
router.register(r'notifications', views_support.NotificationViewSet, basename='notifications')

urlpatterns = [
    path('', include(router.urls)),
    path('predict/', views.PredictView.as_view(), name='predict'),
    path('students/', views.StudentListCreateView.as_view(), name='student-list-create'),
    path('students/<int:pk>/', views.StudentDetailView.as_view(), name='student-detail'),
    path('class-average/', views.ClassAverageView.as_view(), name='class-average'),
    path('health/', views.health_check, name='health-check'),
    path('register/', views_auth.RegisterView.as_view(), name='register'),
    path('upload/', views.BatchUploadView.as_view(), name='batch-upload'),
]
