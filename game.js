class Buffer {
    constructor(ctx, width, height) {
        return ctx.createImageData(width, height);
    }
}

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.buffer = new Buffer(this.ctx, this.canvas.width, this.canvas.height);
    }
    
    flip() {
        this.ctx.putImageData(this.buffer, 0, 0);
        this.buffer = new Buffer(this.ctx, this.canvas.width, this.canvas.height);
    }

    createPixel(x, y, rgba) {
        this.buffer.data[(y-1) * this.canvas.width * 4 + x * 4] = rgba[0];
        this.buffer.data[(y-1) * this.canvas.width * 4 + x * 4 + 1] = rgba[1];
        this.buffer.data[(y-1) * this.canvas.width * 4 + x * 4 + 2] = rgba[2];
        this.buffer.data[(y-1) * this.canvas.width * 4 + x * 4 + 3] = rgba[3];
    }

    createLine(x0, y0, x1, y1, rgba) {
        let dx = Math.abs(x1 - x0);
        let dy = Math.abs(y1 - y0);
        let grad = dy / dx;

        if (grad < 1){
            if (x0 > x1){
                let tmp;
                tmp = x0;
                x0 = x1;
                x1 = tmp;

                tmp = y0;
                y0 = y1;
                y1 = tmp;
            }
            let y = y0;
            let x = x0;
            let error = 0;
            let shift = dy + 1;
            let sign = y1 - y0;
            if (sign >= 0)
                sign = 1;
            else
                sign = -1;
            for (let i = 0; i <= dx; i++){
                this.createPixel(x + i, y, rgba);
                error += shift;
                if (error >= dx + 1){
                    error -= (dx + 1);
                    y += sign;
                }
            }
        }
        else {
            if (y0 > y1){
                let tmp;
                tmp = y0;
                y0 = y1;
                y1 = tmp;

                tmp = x0;
                x0 = x1;
                x1 = tmp;
            }
            let y = y0;
            let x = x0;
            let error = 0;
            let shift = dx + 1;
            let sign = x1 - x0;
            if (sign >= 0)
                sign = 1;
            else
                sign = -1;
            for (let i = 0; i <= dy; i++){
                this.createPixel(x, y + i, rgba);
                error += shift;
                if (error >= dy + 1){
                    error -= (dy + 1);
                    x += sign;
                }
            }
        }
    }

    createTriangle(x0, y0, x1, y1, x2, y2, rgba) {
        // Sorting the vertices
        if (y1 > y2) {
            let tmp;
            tmp = y2;
            y2 = y1;
            y1 = tmp;

            tmp = x2;
            x2 = x1;
            x1 = tmp;            
        }

        if (y0 > y1) {
            let tmp;
            tmp = y1;
            y1 = y0;
            y0 = tmp;

            tmp = x1;
            x1 = x0;
            x0 = tmp;            
        }

        if (y1 > y2) {
            let tmp;
            tmp = y2;
            y2 = y1;
            y1 = tmp;

            tmp = x2;
            x2 = x1;
            x1 = tmp;            
        }

        let dy1 = y1 - y0;
        let dy2 = y2 - y0;
        let dy3 = y2 - y1;
        let dx1 = x1 - x0;
        let dx2 = x2 - x0;
        let dx3 = x2 - x1;
        let cordX1;
        let cordX2;

        for (let i = y0; i <= y1; i++){
            cordX1 = Math.ceil(x0 + dx1 / dy1 * (i - y0));
            cordX2 = Math.ceil(x0 + dx2 / dy2 * (i - y0));
            console.log(cordX1, cordX2, i);
            this.createLine(cordX1, i, cordX2, i, rgba);
        }

        for (let i = y1; i <= y2; i++){
            cordX1 = Math.ceil(x0 + dx2 / dy2 * (i - y0));
            cordX2 = Math.ceil(x1 + dx3 / dy3 * (i - y1));
            console.log(cordX1, cordX2, i);
            this.createLine(cordX1, i, cordX2, i, rgba);
        }
    }
}