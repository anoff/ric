const cv = require('opencv4nodejs')

const skinColorUpper = hue => new cv.Vec(hue, 0.8 * 255, 0.6 * 255)
const skinColorLower = hue => new cv.Vec(hue, 0.1 * 255, 0.05 * 255)

const makeHandMask = (img) => {
    // filter by skin color:
    const imgHLS = img.cvtColor(cv.COLOR_BGR2HLS)
    const rangeMask = imgHLS.inRange(skinColorLower(0), skinColorUpper(15))

    // remove noise:
    const blurred = rangeMask.blur(new cv.Size(10, 10))
    const threshold = blurred.threshold(
        200,
        255,
        cv.THRESH_BINARY
    )

    return threshold
}