import unittest
from common import common

tests = (
    (
        [[1,2,3]],
        3,
    ),
    (
        [[1,2,3], [2,3]],
        2,
    ),
    (
        [[1, 2], [3, 4]],
        0,
    ),
    (
        [],
        0,
    ),
    (
        [[]],
        0,
    ),
)


def check(test):
    A, staff_sol = test
    student_sol = common(A)
    return staff_sol == student_sol

class TestCases(unittest.TestCase):
    def test_01(self): self.assertTrue(check(tests[ 0]))
    def test_02(self): self.assertTrue(check(tests[ 1]))
    def test_03(self): self.assertTrue(check(tests[ 2]))
    def test_04(self): self.assertTrue(check(tests[ 3]))
    def test_05(self): self.assertTrue(check(tests[ 4]))
    
if __name__ == '__main__':
   res = unittest.main(verbosity = 3, exit = False)