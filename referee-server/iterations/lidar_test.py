from rplidar import RPLidar
lidar = RPLidar('/dev/cu.SLAB_USBtoUART')

# info = lidar.get_info()
# print(info)

health = lidar.get_health()
print(health)

data = []

try:
    for i, scan in enumerate(lidar.iter_scans()):
        print('%d: Got %d measurments' % (i, len(scan)))
        print(scan)
        data.extend(scan)
        if i > 10:
            break
finally:
    lidar.stop()
    lidar.stop_motor()
    lidar.disconnect()
    with open('./data/data.txt', 'w+') as file:
        for line in data:
            file.write(str(line) + '\n')

