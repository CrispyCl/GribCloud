import os
import sys


def start_fastapi():
    os.system("python GribTags/server.py")


def main():
    """Run administrative tasks."""
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "GribCloud.settings")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?",
        ) from exc
    try:
        if sys.argv[1] == "runserver":
            # Запуск Django
            execute_from_command_line(sys.argv)
        elif sys.argv[1] == "start_fastapi":
            start_fastapi()
        else:
            execute_from_command_line(sys.argv)
    except IndexError:
        execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
