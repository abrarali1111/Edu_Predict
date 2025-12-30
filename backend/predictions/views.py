from rest_framework import status, generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.db.models import Avg

from .models import Student
from .serializers import (
    StudentSerializer,
    StudentCreateSerializer,
    PredictionInputSerializer,
    PredictionOutputSerializer,
)
from .utils import predict_student_status, check_models_available
from .permissions import IsAdminUser, IsTeacherOrAdmin, IsOwnerOrTeacherOrAdmin


class PredictView(APIView):
    """
    POST /api/predict/
    Accepts JSON student data and returns dropout prediction.
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = PredictionInputSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if models are available
        if not check_models_available():
            return Response(
                {'error': 'ML models not found. Please ensure model.pkl, scaler.pkl, and label_encoder.pkl are in the ml_models directory.'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        
        # Convert to model format and predict
        model_data = serializer.to_model_format()
        result = predict_student_status(model_data)
        
        if 'error' in result:
            return Response({'error': result['error']}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
        # Determine if intervention is needed
        dropout_prob = result['dropout_probability']
        high_risk = dropout_prob > 0.7
        
        response_data = {
            'predicted_class': result['predicted_class'],
            'dropout_probability': dropout_prob,
            'all_probabilities': result['all_probabilities'],
            'grade_trend': result['grade_trend'],
            'high_risk': high_risk,
            'intervention_recommended': high_risk and result['predicted_class'] == 'Dropout',
            'saved_record_id': None,
        }
        
        # Optionally save the record
        if serializer.validated_data.get('save_record', False):
            student_data = {k: v for k, v in serializer.validated_data.items() if k != 'save_record'}
            student = Student.objects.create(
                user=request.user if request.user.is_authenticated else None,
                last_prediction=result['predicted_class'],
                last_dropout_probability=dropout_prob,
                **student_data
            )
            response_data['saved_record_id'] = student.id
        
        return Response(response_data, status=status.HTTP_200_OK)


class StudentListCreateView(generics.ListCreateAPIView):
    """
    GET /api/students/ - List student records
    POST /api/students/ - Create new student record
    """
    permission_classes = [permissions.AllowAny]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return StudentCreateSerializer
        return StudentSerializer
    
    def get_queryset(self):
        user = self.request.user
        
        # Admin sees all
        if user.groups.filter(name='Admin').exists() or user.is_superuser:
            return Student.objects.all()
        
        # Teacher sees all
        if user.groups.filter(name='Teacher').exists():
            return Student.objects.all()
        
        # Student sees only their own data
        return Student.objects.filter(user=user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class StudentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET /api/students/<id>/ - Retrieve student record
    PUT /api/students/<id>/ - Update student record
    DELETE /api/students/<id>/ - Delete student record
    """
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrTeacherOrAdmin]


class ClassAverageView(APIView):
    """
    GET /api/class-average/
    Returns class average grades for radar chart comparison.
    """
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        averages = Student.objects.aggregate(
            avg_1st_sem_grade=Avg('curricular_units_1st_sem_grade'),
            avg_2nd_sem_grade=Avg('curricular_units_2nd_sem_grade'),
            avg_1st_sem_approved=Avg('curricular_units_1st_sem_approved'),
            avg_2nd_sem_approved=Avg('curricular_units_2nd_sem_approved'),
            avg_1st_sem_enrolled=Avg('curricular_units_1st_sem_enrolled'),
            avg_2nd_sem_enrolled=Avg('curricular_units_2nd_sem_enrolled'),
            avg_admission_grade=Avg('admission_grade'),
        )
        
        return Response({
            '1st_sem_grade': averages['avg_1st_sem_grade'] or 0,
            '2nd_sem_grade': averages['avg_2nd_sem_grade'] or 0,
            '1st_sem_approved': averages['avg_1st_sem_approved'] or 0,
            '2nd_sem_approved': averages['avg_2nd_sem_approved'] or 0,
            '1st_sem_enrolled': averages['avg_1st_sem_enrolled'] or 0,
            '2nd_sem_enrolled': averages['avg_2nd_sem_enrolled'] or 0,
            'admission_grade': averages['avg_admission_grade'] or 0,
        })


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def health_check(request):
    """Health check endpoint."""
    models_available = check_models_available()
    return Response({
        'status': 'healthy',
        'ml_models_loaded': models_available,
    })
