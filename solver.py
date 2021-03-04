def last_blank(l):
    for i in range(LENGTH - 1, -1, -1):
        if l[i] == '.':
            return i

def last_nonblank_before_blank(l):
    for i in range(last_blank(l), -1, -1):
        if l[i] == 'x':
            return i

def transform(l):
    i = last_nonblank_before_blank(l)
    l[i], l[i + 1] = l[i + 1], l[i]
    c = count_nonblank(l, i + 2)
    for j in range(i + 2, LENGTH):
        if j < i + 2 + c:
            l[j] = 'x'
        else:
            l[j] = '.'
    return l

def count_nonblank(l, i):
    count = 0
    for j in range(i, LENGTH):
        if l[j] == 'x':
            count += 1
    return count

f = open('solver.txt', 'a')
LENGTH = 25
l = []
for i in range(LENGTH):
    if i < 12:
        l.append('x')
    else:
        l.append('.')

""" f.write(''.join(l))
for i in range(5200299):
    l = transform(l)
    f.write(''.join(l))
f.close() """

""" def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)

print(factorial(25) / (factorial(13) * factorial(12))) """
l = []
print(l[0])