from rest_framework import serializers
from .models import Student


class StudentSerializer(serializers.ModelSerializer):
    """Serializer for the Student model."""
    
    class Meta:
        model = Student
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'last_prediction', 'last_dropout_probability', 'user']


class StudentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new student records."""
    
    class Meta:
        model = Student
        exclude = ['user', 'created_at', 'updated_at', 'last_prediction', 'last_dropout_probability']


class PredictionInputSerializer(serializers.Serializer):
    """Serializer for prediction input data."""
    
    # Demographic Features
    marital_status = serializers.IntegerField(required=True)
    application_mode = serializers.IntegerField(required=True)
    application_order = serializers.IntegerField(required=True)
    course = serializers.IntegerField(required=True)
    daytime_evening_attendance = serializers.IntegerField(required=True)
    previous_qualification = serializers.IntegerField(required=True)
    nationality = serializers.IntegerField(required=True)
    gender = serializers.IntegerField(required=True)
    age_at_enrollment = serializers.IntegerField(required=True)
    international = serializers.IntegerField(required=True)
    displaced = serializers.IntegerField(required=True)
    educational_special_needs = serializers.IntegerField(required=True)
    
    # Parental Background
    mothers_qualification = serializers.IntegerField(required=True)
    fathers_qualification = serializers.IntegerField(required=True)
    mothers_occupation = serializers.IntegerField(required=True)
    fathers_occupation = serializers.IntegerField(required=True)
    
    # Socio-economic
    scholarship_holder = serializers.IntegerField(required=True)
    debtor = serializers.IntegerField(required=True)
    tuition_fees_up_to_date = serializers.IntegerField(required=True)
    admission_grade = serializers.FloatField(required=True)
    
    # 1st Semester Academic Data
    curricular_units_1st_sem_credited = serializers.IntegerField(required=True)
    curricular_units_1st_sem_enrolled = serializers.IntegerField(required=True)
    curricular_units_1st_sem_evaluations = serializers.IntegerField(required=True)
    curricular_units_1st_sem_approved = serializers.IntegerField(required=True)
    curricular_units_1st_sem_grade = serializers.FloatField(required=True)
    curricular_units_1st_sem_without_evaluations = serializers.IntegerField(required=True)
    
    # 2nd Semester Academic Data
    curricular_units_2nd_sem_credited = serializers.IntegerField(required=True)
    curricular_units_2nd_sem_enrolled = serializers.IntegerField(required=True)
    curricular_units_2nd_sem_evaluations = serializers.IntegerField(required=True)
    curricular_units_2nd_sem_approved = serializers.IntegerField(required=True)
    curricular_units_2nd_sem_grade = serializers.FloatField(required=True)
    curricular_units_2nd_sem_without_evaluations = serializers.IntegerField(required=True)
    
    # Macro-economic Indicators
    unemployment_rate = serializers.FloatField(required=True)
    inflation_rate = serializers.FloatField(required=True)
    gdp = serializers.FloatField(required=True)
    
    # Optional: save the record after prediction
    save_record = serializers.BooleanField(default=False, required=False)
    
    def to_model_format(self):
        """Convert serializer data to format expected by the ML model."""
        data = self.validated_data
        return {
            'Marital status': data['marital_status'],
            'Application mode': data['application_mode'],
            'Application order': data['application_order'],
            'Course': data['course'],
            'Daytime/evening attendance': data['daytime_evening_attendance'],
            'Previous qualification': data['previous_qualification'],
            'Nacionality': data['nationality'],
            "Mother's qualification": data['mothers_qualification'],
            "Father's qualification": data['fathers_qualification'],
            "Mother's occupation": data['mothers_occupation'],
            "Father's occupation": data['fathers_occupation'],
            'Admission grade': data['admission_grade'],
            'Displaced': data['displaced'],
            'Educational special needs': data['educational_special_needs'],
            'Debtor': data['debtor'],
            'Tuition fees up to date': data['tuition_fees_up_to_date'],
            'Gender': data['gender'],
            'Scholarship holder': data['scholarship_holder'],
            'Age at enrollment': data['age_at_enrollment'],
            'International': data['international'],
            'Curricular units 1st sem (credited)': data['curricular_units_1st_sem_credited'],
            'Curricular units 1st sem (enrolled)': data['curricular_units_1st_sem_enrolled'],
            'Curricular units 1st sem (evaluations)': data['curricular_units_1st_sem_evaluations'],
            'Curricular units 1st sem (approved)': data['curricular_units_1st_sem_approved'],
            'Curricular units 1st sem (grade)': data['curricular_units_1st_sem_grade'],
            'Curricular units 1st sem (without evaluations)': data['curricular_units_1st_sem_without_evaluations'],
            'Curricular units 2nd sem (credited)': data['curricular_units_2nd_sem_credited'],
            'Curricular units 2nd sem (enrolled)': data['curricular_units_2nd_sem_enrolled'],
            'Curricular units 2nd sem (evaluations)': data['curricular_units_2nd_sem_evaluations'],
            'Curricular units 2nd sem (approved)': data['curricular_units_2nd_sem_approved'],
            'Curricular units 2nd sem (grade)': data['curricular_units_2nd_sem_grade'],
            'Curricular units 2nd sem (without evaluations)': data['curricular_units_2nd_sem_without_evaluations'],
            'Unemployment rate': data['unemployment_rate'],
            'Inflation rate': data['inflation_rate'],
            'GDP': data['gdp'],
        }


class PredictionOutputSerializer(serializers.Serializer):
    """Serializer for prediction output."""
    
    predicted_class = serializers.CharField()
    dropout_probability = serializers.FloatField()
    all_probabilities = serializers.DictField(child=serializers.FloatField())
    grade_trend = serializers.FloatField()
    high_risk = serializers.BooleanField()
    intervention_recommended = serializers.BooleanField()
    saved_record_id = serializers.IntegerField(allow_null=True, required=False)
