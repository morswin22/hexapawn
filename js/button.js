class Button {
    constructor(x,y,w,h,text,action,fontColor,outlineColor,backgroundColor, backgroundColorHovered) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.left = x-w/2;
        this.right = x+w/2;
        this.top = y-h/2;
        this.bottom = y+h/2;
        this.text = text;
        this.action = action;
        this.fontColor = fontColor || color(0);
        this.outlineColor = outlineColor || color(0);
        this.backgroundColor = backgroundColor || color(255);
        this.backgroundColorHovered = backgroundColorHovered || color(210);

        this.hover = 0;
        this.hoverMax = 15;
    }

    render() {
        if (this.isHovering()) {
            this.hover++;
            if (this.hover > this.hoverMax) {
                this.hover = this.hoverMax;
            }
        } else {
            this.hover--;
            if (this.hover < 0) {
                this.hover = 0;
            }
        }

        push();
            stroke(this.outlineColor);
            let r = lerp(this.backgroundColor.levels[0], this.backgroundColorHovered.levels[0], this.hover/this.hoverMax);
            let g = lerp(this.backgroundColor.levels[1], this.backgroundColorHovered.levels[1], this.hover/this.hoverMax);
            let b = lerp(this.backgroundColor.levels[2], this.backgroundColorHovered.levels[2], this.hover/this.hoverMax);
            fill(r,g,b);
            rectMode(CENTER);
            rect(this.x, this.y,this.w,this.h);

            noStroke();
            fill(this.fontColor);
            textSize(16);
            text(this.text, this.x, this.y + textDescent()/2);
        pop();
    }

    check() {
        if (this.isHovering()) {
            this.action();
        } 
    }

    isHovering() {
        return mouseX > this.left && mouseX < this.right && mouseY > this.top && mouseY < this.bottom;
    }
}