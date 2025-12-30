from django.db import models
from django.contrib.auth.models import User


class Student(models.Model):
    """Model representing a student with all 36 features for dropout prediction."""
    
    # Foreign key to Django's built-in User model (optional, for linking student data to user accounts)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='student_records')
    
    # Demographic Features
    marital_status = models.IntegerField(verbose_name="Marital Status")
    application_mode = models.IntegerField(verbose_name="Application Mode")
    application_order = models.IntegerField(verbose_name="Application Order")
    course = models.IntegerField(verbose_name="Course")
    daytime_evening_attendance = models.IntegerField(verbose_name="Daytime/Evening Attendance")
    previous_qualification = models.IntegerField(verbose_name="Previous Qualification")
    nationality = models.IntegerField(verbose_name="Nationality")
    gender = models.IntegerField(verbose_name="Gender")
    age_at_enrollment = models.IntegerField(verbose_name="Age at Enrollment")
    international = models.IntegerField(verbose_name="International")
    displaced = models.IntegerField(verbose_name="Displaced")
    educational_special_needs = models.IntegerField(verbose_name="Educational Special Needs")
    
    # Parental Background
    mothers_qualification = models.IntegerField(verbose_name="Mother's Qualification")
    fathers_qualification = models.IntegerField(verbose_name="Father's Qualification")
    mothers_occupation = models.IntegerField(verbose_name="Mother's Occupation")
    fathers_occupation = models.IntegerField(verbose_name="Father's Occupation")
    
    # Socio-economic
    scholarship_holder = models.IntegerField(verbose_name="Scholarship Holder")
    debtor = models.IntegerField(verbose_name="Debtor")
    tuition_fees_up_to_date = models.IntegerField(verbose_name="Tuition Fees Up to Date")
    admission_grade = models.FloatField(verbose_name="Admission Grade")
    
    # 1st Semester Academic Data
    curricular_units_1st_sem_credited = models.IntegerField(verbose_name="1st Sem Units Credited")
    curricular_units_1st_sem_enrolled = models.IntegerField(verbose_name="1st Sem Units Enrolled")
    curricular_units_1st_sem_evaluations = models.IntegerField(verbose_name="1st Sem Units Evaluations")
    curricular_units_1st_sem_approved = models.IntegerField(verbose_name="1st Sem Units Approved")
    curricular_units_1st_sem_grade = models.FloatField(verbose_name="1st Sem Grade")
    curricular_units_1st_sem_without_evaluations = models.IntegerField(verbose_name="1st Sem Units Without Evaluations")
    
    # 2nd Semester Academic Data
    curricular_units_2nd_sem_credited = models.IntegerField(verbose_name="2nd Sem Units Credited")
    curricular_units_2nd_sem_enrolled = models.IntegerField(verbose_name="2nd Sem Units Enrolled")
    curricular_units_2nd_sem_evaluations = models.IntegerField(verbose_name="2nd Sem Units Evaluations")
    curricular_units_2nd_sem_approved = models.IntegerField(verbose_name="2nd Sem Units Approved")
    curricular_units_2nd_sem_grade = models.FloatField(verbose_name="2nd Sem Grade")
    curricular_units_2nd_sem_without_evaluations = models.IntegerField(verbose_name="2nd Sem Units Without Evaluations")
    
    # Macro-economic Indicators
    unemployment_rate = models.FloatField(verbose_name="Unemployment Rate")
    inflation_rate = models.FloatField(verbose_name="Inflation Rate")
    gdp = models.FloatField(verbose_name="GDP")
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Prediction result (optional, to store latest prediction)
    last_prediction = models.CharField(max_length=20, blank=True, null=True)
    last_dropout_probability = models.FloatField(blank=True, null=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Student Record"
        verbose_name_plural = "Student Records"
    
    def __str__(self):
        return f"Student {self.id} - Course {self.course}"
    
    def get_feature_dict(self):
        """Returns a dictionary of all 36 features for prediction."""
        return {
            'Marital status': self.marital_status,
            'Application mode': self.application_mode,
            'Application order': self.application_order,
            'Course': self.course,
            'Daytime/evening attendance': self.daytime_evening_attendance,
            'Previous qualification': self.previous_qualification,
            'Nacionality': self.nationality,
            "Mother's qualification": self.mothers_qualification,
            "Father's qualification": self.fathers_qualification,
            "Mother's occupation": self.mothers_occupation,
            "Father's occupation": self.fathers_occupation,
            'Admission grade': self.admission_grade,
            'Displaced': self.displaced,
            'Educational special needs': self.educational_special_needs,
            'Debtor': self.debtor,
            'Tuition fees up to date': self.tuition_fees_up_to_date,
            'Gender': self.gender,
            'Scholarship holder': self.scholarship_holder,
            'Age at enrollment': self.age_at_enrollment,
            'International': self.international,
            'Curricular units 1st sem (credited)': self.curricular_units_1st_sem_credited,
            'Curricular units 1st sem (enrolled)': self.curricular_units_1st_sem_enrolled,
            'Curricular units 1st sem (evaluations)': self.curricular_units_1st_sem_evaluations,
            'Curricular units 1st sem (approved)': self.curricular_units_1st_sem_approved,
            'Curricular units 1st sem (grade)': self.curricular_units_1st_sem_grade,
            'Curricular units 1st sem (without evaluations)': self.curricular_units_1st_sem_without_evaluations,
            'Curricular units 2nd sem (credited)': self.curricular_units_2nd_sem_credited,
            'Curricular units 2nd sem (enrolled)': self.curricular_units_2nd_sem_enrolled,
            'Curricular units 2nd sem (evaluations)': self.curricular_units_2nd_sem_evaluations,
            'Curricular units 2nd sem (approved)': self.curricular_units_2nd_sem_approved,
            'Curricular units 2nd sem (grade)': self.curricular_units_2nd_sem_grade,
            'Curricular units 2nd sem (without evaluations)': self.curricular_units_2nd_sem_without_evaluations,
            'Unemployment rate': self.unemployment_rate,
            'Inflation rate': self.inflation_rate,
            'GDP': self.gdp,
        }
