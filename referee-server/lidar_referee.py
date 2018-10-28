from math import floor
from rplidar import RPLidar
import requests
import numpy as np
import time

lidar = RPLidar('/dev/cu.SLAB_USBtoUART')

def aggregate (mean_lists):
    output = {}

    for key in mean_lists:
        output[key] = np.mean(mean_lists[key]) if len(mean_lists[key]) else 0

    return output


def isDeltaUnbreach (breach_mean_val, idle_mean_val, diff, breach_index):
    for (index, _) in enumerate(breach_mean_val):
        difference = abs(breach_mean_val[index] - idle_mean_val[index])

        if index == breach_index and difference < diff:
            # print(breach_mean_val[index], idle_mean_val[index])
            print(abs(breach_mean_val[index] - idle_mean_val[index]))
            return True
    return False


def isDeltaBreach (breach_mean_val, idle_mean_val, diff):
    for (index, _) in enumerate(breach_mean_val):
        difference = abs(breach_mean_val[index] - idle_mean_val[index])

        if difference > diff and not breached:
            # print(breach_mean_val[index], idle_mean_val[index])
            print(abs(breach_mean_val[index] - idle_mean_val[index]))
            return True, index
    return False, -1


idle_means = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: []
}

idle_mean_val = {}

breach_data = {
        0: [],
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: []
    }

breach_mean_val = {}

idle_len = 20
aggregation_size = 1

try:
    idle_data = []
    data_vals = []
    breached = False
    breach_index = -1
    breach_time = 0

    time.sleep(5)
    print("Ready")
    for i, scan in enumerate(lidar.iter_scans()):
        # print('%d: Got %d measurments' % (i, len(scan)))

        # collecting the idle state vals
        if i < idle_len:
            idle_data.extend(scan)

        if i == idle_len:
            for line in idle_data:
                angle = line[1]
                distance = line[2]

                sector = floor(angle / 45)
                idle_means[sector].append(distance)

            idle_mean_val = aggregate(idle_means)
            # print(idle_mean_val)

        # data from here is only compared
        if i > idle_len:
            data_vals.extend(scan)

        if i > idle_len and i % aggregation_size == 0:
            for line in data_vals:
                angle = line[1]
                distance = line[2]

                sector = floor(angle / 45)
                breach_data[sector].append(distance)

            breach_mean_val = aggregate(breach_data)
            # print(breach_mean_val)

            data_vals = []
            breach_data = {
                0: [],
                1: [],
                2: [],
                3: [],
                4: [],
                5: [],
                6: [],
                7: []
            }

            is_breached, index = isDeltaBreach(breach_mean_val, idle_mean_val, 2000)

            if is_breached and not breached:
                print("Breached")
                breach_index = index
                breached = True
                breach_time = time.time()

                # send breached
                requests.post("http://c4c9b78a.ngrok.io/safetynet",
                                  data={ 'state': 'entered' })
            elif breached \
                and isDeltaUnbreach(breach_mean_val, idle_mean_val, 500, breach_index):
                    elapsed_time = time.time() - breach_time
                    print("Unbreached, reaction time was", elapsed_time, 'sec')
                    breached = False

                    # send breach exit
                    requests.post("http://c4c9b78a.ngrok.io/safetynet",
                                  data={ 'state': 'exited' })


finally:
    lidar.stop()
    lidar.stop_motor()
    lidar.disconnect()

