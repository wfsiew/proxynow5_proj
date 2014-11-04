@python manage.py dumpdata --format xml --indent 4 --exclude=contenttypes --exclude=sessions --exclude=auth.permission > data.xml
@pause