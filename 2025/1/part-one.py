rotations = open('rotations.txt', 'r').readlines()
cleaned_rotations = [rotation.strip() for rotation in rotations]
 
current_position = 50
times_at_zero = 0

for rotation in cleaned_rotations:
    direction = rotation[0] 
    distance = int(rotation[1:])
    # print(direction, distance, current_position)

    if current_position == 0:
        times_at_zero += 1

    if (direction == "L"): 
        distance *= -1

    current_position += distance 
    current_position %= 100

print(times_at_zero)

     


        

    

