from rplidar import RPLidar
lidar = RPLidar('/dev/cu.SLAB_USBtoUART')

import asyncio
import websockets

def start(websocket, path):
    websocket.send("test")
    print("Testing")

    for i, scan in enumerate(lidar.iter_scans()):
        print('%d: Got %d measurments' % (i, len(scan)))
        print(scan)
        print("Sending Points...")
        for line in scan:
            websockets.send(str(line))
        if i > 10:
            break


try:
    start_server = websockets.serve(start, 'localhost', 8000)
    asyncio.get_event_loop().run_until_complete(start_server)

finally:
    lidar.stop()
    lidar.stop_motor()
    lidar.disconnect()

