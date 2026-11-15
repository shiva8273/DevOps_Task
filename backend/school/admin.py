from django.contrib import admin
from .models import Teacher, Student

@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'subject', 'phone', 'created_at')
    search_fields = ('name', 'email', 'subject')
    list_filter = ('subject', 'created_at')


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'roll_number', 'email', 'grade', 'teacher', 'created_at')
    search_fields = ('name', 'roll_number', 'email', 'grade')
    list_filter = ('grade', 'teacher', 'created_at')
