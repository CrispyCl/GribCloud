from rest_framework import permissions


class IsRedactorOrPublicAndReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            if obj.is_public:
                return True
            if obj.is_redactor(request.user) or obj.is_member(request.user):
                return True
        return obj.author == request.user
