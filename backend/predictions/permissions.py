from rest_framework import permissions


class IsAdminUser(permissions.BasePermission):
    """
    Permission class for Admin group members only.
    """
    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            (request.user.groups.filter(name='Admin').exists() or request.user.is_superuser)
        )


class IsTeacherOrAdmin(permissions.BasePermission):
    """
    Permission class for Teacher or Admin group members.
    Allows view and predict access.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        return (
            request.user.is_superuser or
            request.user.groups.filter(name__in=['Admin', 'Teacher']).exists()
        )


class IsOwnerOrTeacherOrAdmin(permissions.BasePermission):
    """
    Permission class that allows:
    - Admin/Teacher: Full access
    - Student: Access only their own records
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        # Admin and Teacher have full access
        if request.user.is_superuser:
            return True
        
        if request.user.groups.filter(name__in=['Admin', 'Teacher']).exists():
            return True
        
        # Students can only access their own data
        # For safe methods (GET, HEAD, OPTIONS), students can view their own data
        if request.method in permissions.SAFE_METHODS:
            return obj.user == request.user
        
        # For unsafe methods, only owner can modify (but typically we'd restrict this)
        return obj.user == request.user
