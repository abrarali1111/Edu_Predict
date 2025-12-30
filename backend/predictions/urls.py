from django.urls import path
from . import views, views_auth

urlpatterns = [
    path('predict/', views.PredictView.as_view(), name='predict'),
    path('students/', views.StudentListCreateView.as_view(), name='student-list-create'),
    path('students/<int:pk>/', views.StudentDetailView.as_view(), name='student-detail'),
    path('class-average/', views.ClassAverageView.as_view(), name='class-average'),
    path('health/', views.health_check, name='health-check'),
    path('register/', views_auth.RegisterView.as_view(), name='register'),
]
