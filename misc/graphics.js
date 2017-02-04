function rgbToHex(r, g, b, a, fill) {
    if (fill)
        return '0x' + ("0" + r.toString(16)).slice(-2) + ("0" + g.toString(16)).slice(-2) + ("0" + b.toString(16)).slice(-2);
    else
        return '#' + ("0" + r.toString(16)).slice(-2) + ("0" + g.toString(16)).slice(-2) + ("0" + b.toString(16)).slice(-2);
}


function drawText(obj, size, col, text, x, y, w, h) {
    obj.fontSize = size;
    obj.fill = col;
    obj.text = text;
    obj.setTextBounds(x, y, w, h)
}