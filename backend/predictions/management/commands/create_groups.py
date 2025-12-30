"""
Management command to create default user groups for RBAC.
"""
from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from predictions.models import Student


class Command(BaseCommand):
    help = 'Creates default user groups: Admin, Teacher, Student'

    def handle(self, *args, **options):
        # Get content type for Student model
        student_ct = ContentType.objects.get_for_model(Student)
        
        # Create Admin group with full permissions
        admin_group, created = Group.objects.get_or_create(name='Admin')
        if created:
            self.stdout.write(self.style.SUCCESS('Created Admin group'))
            # Admin gets all permissions
            all_perms = Permission.objects.filter(content_type=student_ct)
            admin_group.permissions.set(all_perms)
        else:
            self.stdout.write('Admin group already exists')
        
        # Create Teacher group with view and predict permissions
        teacher_group, created = Group.objects.get_or_create(name='Teacher')
        if created:
            self.stdout.write(self.style.SUCCESS('Created Teacher group'))
            # Teacher can view students
            view_perm = Permission.objects.filter(
                content_type=student_ct,
                codename__startswith='view'
            )
            teacher_group.permissions.set(view_perm)
        else:
            self.stdout.write('Teacher group already exists')
        
        # Create Student group with limited permissions
        student_group, created = Group.objects.get_or_create(name='Student')
        if created:
            self.stdout.write(self.style.SUCCESS('Created Student group'))
            # Students can only view their own records (handled at view level)
        else:
            self.stdout.write('Student group already exists')
        
        self.stdout.write(self.style.SUCCESS('Successfully created/verified all groups'))
