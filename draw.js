function drawCircle(x, y, r, color, w) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = w;
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    //ctx.fill();
    ctx.closePath();
    ctx.stroke();
}

function drawLine(x1, y1, x2, y2, color) {
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = 1
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.closePath()
    ctx.stroke()
}