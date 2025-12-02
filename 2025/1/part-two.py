def myModClean(c, m):
    div, mod = divmod(c + m, 100)
    # why'd I go this far
    return mod, abs(div) + (m < 0) * ((mod == 0) - (c == 0))

def myMod(c, m):
    full_rotations = abs(m) // 100
    remaining = (abs(m) % 100) * (abs(m) // m)
    new_c = c + remaining

    if (c and remaining and (new_c > 99 or new_c <= 0)):
        full_rotations += 1

    new_c = new_c % 100

    return (new_c, full_rotations)

def decreaseWheel(c):
    c = c - 1
    if (c == -1):
        c = 99

    return c

def increaseWheel(c):
    c = c + 1
    if (c == 100):
        c = 0

    return c

def myModExplicit(c, m):
    # the fact I have to do this (I'm actually cooked)
    ticked_zero = 0

    if (m < 0):
        while (abs(m) > 0):
            c = decreaseWheel(c)
            if (c == 0):
                ticked_zero += 1
            m += 1

    if (m > 0):
        while (abs(m) > 0):
            c = increaseWheel(c)
            if (c == 0):
                ticked_zero += 1

            m -= 1

    return (c, ticked_zero)


rotations = open('rotations.txt', 'r').readlines()

# rotations = """L68
# L30
# R48
# L5
# R60
# L55
# L1
# L99
# R14
# L82""".split("\n")

cleaned_rotations = [rotation.strip() for rotation in rotations]

current_position = 50
times_passed_zero = 0

for rotation in cleaned_rotations:
    direction = rotation[0] 
    distance = int(rotation[1:])

    if (direction == "L"): 
        distance *= -1
        
    current_position, passed = myModClean(current_position, distance)
    times_passed_zero += passed


print(times_passed_zero)
