from django.contrib import admin
from .models import Student


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'course', 'gender', 'age_at_enrollment', 
        'curricular_units_1st_sem_grade', 'curricular_units_2nd_sem_grade',
        'last_prediction', 'last_dropout_probability', 'created_at'
    ]
    list_filter = [
        'course', 'gender', 'scholarship_holder', 
        'last_prediction', 'created_at'
    ]
    search_fields = ['id', 'course']
    readonly_fields = ['created_at', 'updated_at', 'last_prediction', 'last_dropout_probability']
    
    fieldsets = (
        ('Demographics', {
            'fields': (
                'user', 'marital_status', 'application_mode', 'application_order',
                'course', 'daytime_evening_attendance', 'previous_qualification',
                'nationality', 'gender', 'age_at_enrollment', 'international',
                'displaced', 'educational_special_needs'
            )
        }),
        ('Parental Background', {
            'fields': (
                'mothers_qualification', 'fathers_qualification',
                'mothers_occupation', 'fathers_occupation'
            )
        }),
        ('Socio-economic', {
            'fields': (
                'scholarship_holder', 'debtor', 'tuition_fees_up_to_date',
                'admission_grade'
            )
        }),
        ('1st Semester Academic', {
            'fields': (
                'curricular_units_1st_sem_credited', 'curricular_units_1st_sem_enrolled',
                'curricular_units_1st_sem_evaluations', 'curricular_units_1st_sem_approved',
                'curricular_units_1st_sem_grade', 'curricular_units_1st_sem_without_evaluations'
            )
        }),
        ('2nd Semester Academic', {
            'fields': (
                'curricular_units_2nd_sem_credited', 'curricular_units_2nd_sem_enrolled',
                'curricular_units_2nd_sem_evaluations', 'curricular_units_2nd_sem_approved',
                'curricular_units_2nd_sem_grade', 'curricular_units_2nd_sem_without_evaluations'
            )
        }),
        ('Macro-economic Indicators', {
            'fields': ('unemployment_rate', 'inflation_rate', 'gdp')
        }),
        ('Prediction Results', {
            'fields': ('last_prediction', 'last_dropout_probability'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
