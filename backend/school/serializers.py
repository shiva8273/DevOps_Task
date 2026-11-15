from rest_framework import serializers
from .models import Teacher, Student

class TeacherSerializer(serializers.ModelSerializer):
    students_count = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Teacher
        fields = ['id', 'name', 'email', 'subject', 'phone', 'students_count', 'created_at']

    def get_students_count(self, obj):
        return obj.students.count()


class StudentSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source='teacher.name', read_only=True, default='')

    class Meta:
        model = Student
        fields = ['id', 'name', 'email', 'roll_number', 'grade', 'teacher', 'teacher_name', 'created_at']
