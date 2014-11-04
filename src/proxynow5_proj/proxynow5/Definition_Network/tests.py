from django.test import TestCase
from models import *
from django.db.backends.sqlite3.base import IntegrityError

class DefNetTest(TestCase):
    fixtures = ['test_data.json']
    
    def setUp(self):
        pass
    
    def test_add_unique_name(self):
        o = DefNet.objects.create(name='custom',
                                  type=0,
                                  comment='')
        self.assertEquals(o.name, 'custom', msg='Failed to create DefNet object.')
        try:
            o1 = DefNet.objects.create(name='custom',
                                       type=1,
                                       comment='')
        except Exception, ex:
            self.assertIn('column name is not unique', ex, 'Wrong exception.')
            
        o2 = DefNet.objects.create(name='data',
                                   type=2,
                                   comment='')
        self.assertEquals(o2.name, 'data', msg='Failed to create DefNet object.')
        