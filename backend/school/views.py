from rest_framework import viewsets, filters
from .models import Teacher, Student
from .serializers import TeacherSerializer, StudentSerializer

class TeacherViewSet(viewsets.ModelViewSet):
    """
    CRUD API for School Teachers.
    Provides list, create, retrieve, update, partial_update, and destroy actions.
    """
    queryset = Teacher.objects.all().order_by('-id')
    serializer_class = TeacherSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'subject', 'email', 'phone']


class StudentViewSet(viewsets.ModelViewSet):
    """
    CRUD API for School Students.
    Provides list, create, retrieve, update, partial_update, and destroy actions.
    """
    queryset = Student.objects.select_related('teacher').all().order_by('-id')
    serializer_class = StudentSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'roll_number', 'grade', 'email']
