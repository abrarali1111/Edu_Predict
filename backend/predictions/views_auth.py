from rest_framework import generics, status, permissions
from rest_framework.response import Response
from django.contrib.auth.models import User, Group
from .serializers_auth import UserSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Assign Role (Group)
        role = request.data.get('role', 'Student')
        if role not in ['Student', 'Teacher', 'Analyst']:
            role = 'Student'
        
        group, _ = Group.objects.get_or_create(name=role)
        user.groups.add(group)

        headers = self.get_success_headers(serializer.data)
        return Response({
            "user": serializer.data,
            "role": role,
            "message": "User created successfully"
        }, status=status.HTTP_201_CREATED, headers=headers)
