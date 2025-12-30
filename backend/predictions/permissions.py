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
    Custom permission to only allow teachers, analysts, or admins to access view.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        return (
            request.user.is_superuser or
            request.user.groups.filter(name__in=['Admin', 'Teacher', 'Analyst']).exists()
        )


class IsOwnerOrTeacherOrAdmin(permissions.BasePermission):
    """
    Custom permission to allow owners of an object to edit it.
    Teachers, Analysts, and Admins can also access/edit.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        # if request.method in permissions.SAFE_METHODS:
        #     return True

        # Write permissions are only allowed to the owner of the snippet.
        if request.user.is_superuser:
            return True
            
        if request.user.groups.filter(name__in=['Admin', 'Teacher', 'Analyst']).exists():
            return True
            
        return obj.user == request.user
