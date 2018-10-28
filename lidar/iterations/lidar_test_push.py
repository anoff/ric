from rplidar import RPLidar
lidar = RPLidar('/dev/cu.SLAB_USBtoUART')

import boto3

# info = lidar.get_info()
# print(info)

health = lidar.get_health()
print(health)

data = []

try:
    s3client = boto3.client('s3')

    """
    "# Call S3 to list current buckets
    response = s3.list_buckets()

    # Get a list of all bucket names from the response
    buckets = [bucket['Name'] for bucket in response['Buckets']]

    # Print out the bucket list
    print("Bucket List: %s" % buckets)

    for i, scan in enumerate(lidar.iter_scans()):
        print('%d: Got %d measurments' % (i, len(scan)))
        print(scan)
        data.extend(scan)
        if i % 10 == 0:
            #s3.Bucket('ric.game').put_object(Key='data.txt', Body="\n".join([str(line) for line in data]))
            data = []
    """
finally:
    lidar.stop()
    lidar.stop_motor()
    lidar.disconnect()


