function randomColor() {
    var color = '#'
    for (let i = 0; i < 6; i++) {
        color += LETTERS[Math.floor(Math.random() * 16)]
    }
    return color
}

function lerp(start, end, alpha) {
    //console.log(start, end, alpha)
    return start + (end - start) * alpha;
}

function radians_to_degrees(radians) {
    var pi = Math.PI;
    return radians * (180 / pi);
}

function degress_to_radians(degress) {
    return degress * (Math.PI / 180)
}

function newVector(x, y) {
    return {
        x: x,
        y: y,
    }
}

function subVectorByValue(v1, value) {
    return newVector(
        v1.x - value,
        v1.y - value,
    )
}

function distance_to(v1, v2) {
    return Math.sqrt(
        Math.pow(v2.x - v1.x, 2) + Math.pow(v2.y - v1.y, 2)
    )
}

function angle_to(v1, v2) {
    var dx = v2.x - v1.x;
    var dy = v2.y - v1.y;
    return Math.atan2(dy, dx);
}

function angleReflectDegree(incidenceAngle, surfaceAngle) {
    var a = surfaceAngle * 2 - incidenceAngle;
    return a >= 360 ? a - 360 : a < 0 ? a + 360 : a;
}

function rotateVector(vector, angle) {
  //const radians = (Math.PI / 180) * angle;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const newX = vector.x * cos - vector.y * sin;
  const newY = vector.x * sin + vector.y * cos;
  return newVector(newX, newY);
}

function collision(_w1, _w2) {
    var a = _w1.vec.x - _w2.vec.x;
    var b = _w1.vec.y - _w2.vec.y;
    var c = (a * a) + (b * b);
    var radii = _w1.radius + _w2.radius
    return radii * radii >= c;
}

function intersection(_w1, _w2) {
    if(_w1 === undefined) return false
    if(_w2 === undefined) return false
    
    var x0 = _w1.vec.x;
    var y0 = _w1.vec.y;
    var r0 = _w1.radius;
    var x1 = _w2.vec.x;
    var y1 = _w2.vec.y;
    var r1 = _w2.radius;
    var a, dx, dy, d, h, rx, ry;
    var x2, y2;

    /* dx and dy are the vertical and horizontal distances between
     * the circle centers.
     */
    dx = x1 - x0;
    dy = y1 - y0;

    /* Determine the straight-line distance between the centers. */
    d = Math.sqrt((dy * dy) + (dx * dx));

    /* Check for solvability. */
    if (d > (r0 + r1)) {
        /* no solution. circles do not intersect. */
        return false;
    }
    if (d < Math.abs(r0 - r1)) {
        /* no solution. one circle is contained in the other */
        return false;
    }

    return true

    // use below code to get the position

    // /* 'point 2' is the point where the line through the circle
    //  * intersection points crosses the line between the circle
    //  * centers.  
    //  */

    // /* Determine the distance from point 0 to point 2. */
    // a = ((r0 * r0) - (r1 * r1) + (d * d)) / (2.0 * d);

    // /* Determine the coordinates of point 2. */
    // x2 = x0 + (dx * a / d);
    // y2 = y0 + (dy * a / d);

    // /* Determine the distance from point 2 to either of the
    //  * intersection points.
    //  */
    // h = Math.sqrt((r0 * r0) - (a * a));

    // /* Now determine the offsets of the intersection points from
    //  * point 2.
    //  */
    // rx = -dy * (h / d);
    // ry = dx * (h / d);

    // /* Determine the absolute intersection points. */
    // var xi = x2 + rx;
    // var xi_prime = x2 - rx;
    // var yi = y2 + ry;
    // var yi_prime = y2 - ry;

    // return [xi, xi_prime, yi, yi_prime];
}

function inteceptCircleLineSeg(circle, lineStart, lineEnd){
    var a, b, c, d, u1, u2, ret, retP1, retP2, v1, v2;
    v1 = {};
    v2 = {};
    v1.x = lineEnd.x - lineStart.x;
    v1.y = lineEnd.y - lineStart.y;
    v2.x = lineStart.x - circle.vec.x;
    v2.y = lineStart.y - circle.vec.y;
    b = (v1.x * v2.x + v1.y * v2.y);
    c = 2 * (v1.x * v1.x + v1.y * v1.y);
    b *= -2;
    d = Math.sqrt(b * b - 2 * c * (v2.x * v2.x + v2.y * v2.y - circle.radius * circle.radius));
    if(isNaN(d)){ // no intercept
        return [];
    }
    u1 = (b - d) / c;  // these represent the unit distance of point one and two on the line
    u2 = (b + d) / c;    
    retP1 = {};   // return points
    retP2 = {}  
    ret = []; // return array
    if(u1 <= 1 && u1 >= 0){  // add point if on the line segment
        retP1.x = lineStart.x + v1.x * u1;
        retP1.y = lineStart.y + v1.y * u1;
        ret[0] = retP1;
    }
    if(u2 <= 1 && u2 >= 0){  // second add point if on the line segment
        retP2.x = lineStart.x + v1.x * u2;
        retP2.y = lineStart.y + v1.y * u2;
        ret[ret.length] = retP2;
    }       
    return ret;
}
