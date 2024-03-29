import sys
import os
import gzip
import zipfile
from optparse import make_option
os.environ['DJANGO_SETTINGS_MODULE'] = "proxynow5_proj.settings"
sys.path.append(os.path.dirname(os.path.abspath(__file__)) + '/..')
from django.conf import settings
from django.core import serializers
from django.core.management.base import BaseCommand
from django.core.management.color import no_style
from django.db import connections, router, transaction, DEFAULT_DB_ALIAS
from django.db.models import get_apps
from django.utils.itercompat import product

try:
    import bz2
    has_bz2 = True
except ImportError:
    has_bz2 = False

def detectLineNo(settingFile, substring):
        try:
            isinstance(substring, str)
            substring = filter (lambda a: a != ' ', substring)
            f = open(settingFile, 'r')
            total = f.readlines()
            f.close()
            i = 0
            objName = substring.split('(')[0]
            objPk = substring.split('=')[1].split(')')[0]
            findStr = 'pk="%s" model="%s"' % (objPk, objName)
            for line in total:
                i = i + 1
                if line.lower().find(findStr.lower()) != -1:
                    return str(i)
        except:
            return 'undefined'
        
class Command(BaseCommand):
    help = 'Installs the named fixture(s) in the database.'
    args = "fixture [fixture ...]"

    option_list = BaseCommand.option_list + (
        make_option('--database', action='store', dest='database',
            default=DEFAULT_DB_ALIAS, help='Nominates a specific database to load '
                'fixtures into. Defaults to the "default" database.'),
    )
    
    
    
    

    def handle(self, *fixture_labels, **options):
        ls = []
        using = options.get('database', DEFAULT_DB_ALIAS)

        connection = connections[using]
        self.style = no_style()

        verbosity = int(options.get('verbosity', 1))
        show_traceback = options.get('traceback', False)

        # commit is a stealth option - it isn't really useful as
        # a command line option, but it can be useful when invoking
        # loaddata from within another script.
        # If commit=True, loaddata will use its own transaction;
        # if commit=False, the data load SQL will become part of
        # the transaction in place when loaddata was invoked.
        commit = options.get('commit', True)

        # Keep a count of the installed objects and fixtures
        fixture_count = 0
        loaded_object_count = 0
        fixture_object_count = 0
        models = set()

        humanize = lambda dirname: dirname and "'%s'" % dirname or 'absolute path'

        # Get a cursor (even though we don't need one yet). This has
        # the side effect of initializing the test database (if
        # it isn't already initialized).
        cursor = connection.cursor()

        # Start transaction management. All fixtures are installed in a
        # single transaction to ensure that all references are resolved.
        if commit:
            transaction.commit_unless_managed(using=using)
            transaction.enter_transaction_management(using=using)
            transaction.managed(True, using=using)

        class SingleZipReader(zipfile.ZipFile):
            def __init__(self, *args, **kwargs):
                zipfile.ZipFile.__init__(self, *args, **kwargs)
                if settings.DEBUG:
                    assert len(self.namelist()) == 1, "Zip-compressed fixtures must contain only one file."
            def read(self):
                return zipfile.ZipFile.read(self, self.namelist()[0])
            
     
                      
        compression_types = {
            None:   file,
            'gz':   gzip.GzipFile,
            'zip':  SingleZipReader
        }
        if has_bz2:
            compression_types['bz2'] = bz2.BZ2File

        app_module_paths = []
        for app in get_apps():
            if hasattr(app, '__path__'):
                # It's a 'models/' subpackage
                for path in app.__path__:
                    app_module_paths.append(path)
            else:
                # It's a models.py module
                app_module_paths.append(app.__file__)

        app_fixtures = [os.path.join(os.path.dirname(path), 'fixtures') for path in app_module_paths]
        for fixture_label in fixture_labels:
            parts = fixture_label.split('.')

            if len(parts) > 1 and parts[-1] in compression_types:
                compression_formats = [parts[-1]]
                parts = parts[:-1]
            else:
                compression_formats = compression_types.keys()

            if len(parts) == 1:
                fixture_name = parts[0]
                formats = serializers.get_public_serializer_formats()
            else:
                fixture_name, format = '.'.join(parts[:-1]), parts[-1]
                if format in serializers.get_public_serializer_formats():
                    formats = [format]
                else:
                    formats = []

            if formats:
                if verbosity >= 2:
                    sys.stdout.write("Loading '%s' fixtures...\n" % fixture_name)
            else:
                sys.stderr.write(
                    self.style.ERROR("Problem installing fixture '%s': %s is not a known serialization format.\n" % 
                        (fixture_name, format)))
                ls.append("The file is not recognized by the system. Please check the file.")
                
                if commit:
                    transaction.rollback(using=using)
                    transaction.leave_transaction_management(using=using)
                return ls

            if os.path.isabs(fixture_name):
                fixture_dirs = [fixture_name]
            else:
                fixture_dirs = app_fixtures + list(settings.FIXTURE_DIRS) + ['']

            for fixture_dir in fixture_dirs:
                if verbosity >= 2:
                    sys.stdout.write("Checking %s for fixtures...\n" % humanize(fixture_dir))

                label_found = False
                for combo in product([using, None], formats, compression_formats):
                    database, format, compression_format = combo
                    file_name = '.'.join(
                        p for p in [
                            fixture_name, database, format, compression_format
                        ]
                        if p
                    )

                    if verbosity >= 3:
                        sys.stdout.write("Trying %s for %s fixture '%s'...\n" % \
                            (humanize(fixture_dir), file_name, fixture_name))
                    full_path = os.path.join(fixture_dir, file_name)
                    open_method = compression_types[compression_format]
                    try:
                        fixture = open_method(full_path, 'r')
                        if label_found:
                            fixture.close()
                            sys.stderr.write(self.style.ERROR("Multiple fixtures named '%s' in %s. Aborting.\n" % 
                                (fixture_name, humanize(fixture_dir))))
                            if commit:
                                transaction.rollback(using=using)
                                transaction.leave_transaction_management(using=using)
                            return
                        else:
                            fixture_count += 1
                            objects_in_fixture = 0
                            loaded_objects_in_fixture = 0
                            if verbosity >= 2:
                                sys.stdout.write("Installing %s fixture '%s' from %s.\n" % \
                                    (format, fixture_name, humanize(fixture_dir)))
                            try:
                                objects = serializers.deserialize(format, fixture, using=using)
                                #validating the parsing of xml objects
                                try:
                                    for obj in objects:
                                        break
                                except Exception as err:
                                    ls.append("The file is not recognized by the system. Please check the file.")
                                    return ls
                                
                                for obj in objects:
                                    objects_in_fixture += 1
                                    if router.allow_syncdb(using, obj.object.__class__):
                                        loaded_objects_in_fixture += 1
                                        models.add(obj.object.__class__)
                                        ########################################################
                                        #Added by Mohammad to continue import even if there is an exception in the code.
                                        ########################################################
                                        try:
                                            obj.save(using=using)
                                        except Exception as err:
                                            errorline = str(obj).replace('<DeserializedObject:', '').replace('>', '')
                                            ls.append("Error: line number:%s %s:%s" % (detectLineNo(fixture_labels[0], errorline), err, errorline))
                                            pass
                                        ########################################################
                                loaded_object_count += loaded_objects_in_fixture
                                fixture_object_count += objects_in_fixture
                                label_found = True
                            except (SystemExit, KeyboardInterrupt) as err:
                                ls.append("The file is not recognized by the system. Please check the file.")
                                return ls
                            except Exception as err:
                                
                                ls.append("The file is not recognized by the system. Please check the file.")
                                import traceback
                                fixture.close()
                                if commit:
                                    transaction.rollback(using=using)
                                    transaction.leave_transaction_management(using=using)
                                if show_traceback:
                                    traceback.print_exc()
                                else:
                                    sys.stderr.write(
                                        self.style.ERROR("Problem installing fixture '%s': %s\n" % 
                                             (full_path, ''.join(traceback.format_exception(sys.exc_type,
                                                 sys.exc_value, sys.exc_traceback)))))
                                
                                return ls
                                
                            fixture.close()

                            # If the fixture we loaded contains 0 objects, assume that an
                            # error was encountered during fixture loading.
                            if objects_in_fixture == 0:
                                sys.stderr.write(
                                    self.style.ERROR("No fixture data found for '%s'. (File format may be invalid.)\n" % 
                                        (fixture_name)))
                                ls.append("The file is not recognized by the system. Please check the file.")
                                if commit:
                                    transaction.rollback(using=using)
                                    transaction.leave_transaction_management(using=using)
                                return ls

                    except Exception, e:
                        if verbosity >= 2:
                            sys.stdout.write("No %s fixture '%s' in %s.\n" % \
                                (format, fixture_name, humanize(fixture_dir)))

        # If we found even one object in a fixture, we need to reset the
        # database sequences.
        if loaded_object_count > 0:
            sequence_sql = connection.ops.sequence_reset_sql(self.style, models)
            if sequence_sql:
                if verbosity >= 2:
                    sys.stdout.write("Resetting sequences\n")
                for line in sequence_sql:
                    cursor.execute(line)

        if commit:
            transaction.commit(using=using)
            transaction.leave_transaction_management(using=using)

        if fixture_object_count == 0:
            if verbosity >= 1:
                sys.stdout.write("No fixtures found.\n")
        else:
            if verbosity >= 1:
                if fixture_object_count == loaded_object_count:
                    sys.stdout.write("Installed %d object(s) from %d fixture(s)\n" % (
                        loaded_object_count, fixture_count))
                else:
                    sys.stdout.write("Installed %d object(s) (of %d) from %d fixture(s)\n" % (
                        loaded_object_count, fixture_object_count, fixture_count))

        # Close the DB connection. This is required as a workaround for an
        # edge case in MySQL: if the same connection is used to
        # create tables, load data, and query, the query can return
        # incorrect results. See Django #7572, MySQL #37735.
        if commit:
            connection.close()
            return ls
