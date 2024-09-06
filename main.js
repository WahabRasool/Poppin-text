class Popper {
    constructor(element) {
      this.element = element;
      this.originalText = element.innerText;
      this.staticSpans = [];
      this.spans = [];
      this.staticContainer = document.createElement("div");
      this.animationContainer = document.createElement("div");
      this.animationFrames = [];
      this.delays = [];
      this.emojiEntities = [
        // Big smiley
        "&#128512;",
        // Devil
        "&#128520;",
        // Heart eyes
        "&#128525;",
        // Cool guy
        "&#128526;",
        // Cat
        "&#128568;",
        // Rocket
        "&#128640;"
      ];
      this.handleResize = this.handleResize.bind(this);
      window.addEventListener("resize", this.debounce(this.handleResize));
    }
  
    // Pop it like it's hot
    popperify() {
      this.setupContainers();
      this.spanify();
      this.spans.forEach((span, index) => {
        setTimeout(() => {
          this.animateCharacter(span, index);
        }, this.delays[index]);
      });
    }
  
    // Set up
    setupContainers() {
      this.staticContainer.style.position = "relative";
      this.staticContainer.className = "static-text";
      this.staticContainer.textContent = this.element.textContent;
      this.animationContainer.className = "animated-text";
      this.animationContainer.style.position = "absolute";
      this.animationContainer.style.top = "0";
      this.animationContainer.style.left = "0";
      this.animationContainer.style.width = "100%";
      this.element.innerHTML = "";
      this.element.appendChild(this.staticContainer);
      this.element.appendChild(this.animationContainer);
    }
  
    spanify() {
      const chars = this.staticContainer.textContent.split("");
      this.staticContainer.innerHTML = "";
      chars.forEach((char, index) => {
        const wrapper = document.createElement("div");
        wrapper.style.display = "inline-block";
        const span = document.createElement("span");
        span.textContent = char;
        span.style.display = "block";
        span.style.whiteSpace = "pre-wrap";
        const delay = this.random(2000, 10000);
        this.delays.push(delay);
  
        wrapper.appendChild(span);
        this.staticContainer.appendChild(wrapper);
        const clone = span.cloneNode(true);
        clone.className = "pop-char";
        clone.style.position = "absolute";
  
        const rect = span.getBoundingClientRect();
        clone.style.left = `${rect.left}px`;
        clone.style.top = `${rect.top}px`;
  
        this.animationContainer.appendChild(clone);
        this.staticSpans.push(span);
        this.spans.push(clone);
      });
    }
  
    // Animations
    squishDownAnimation(index, callback) {
      let t = 0;
      const maxT = 0.25;
      const animationFrame = () => {
        if (t <= maxT) {
          const scale = 1 - 0.15 * Math.sin(t * Math.PI * 2);
          this.staticSpans[index].style.transform = `scaleX(${scale.toFixed(
            2
          )}) scaleY(${(1 / scale).toFixed(2)})`;
          t += 0.02;
          requestAnimationFrame(animationFrame);
        } else {
          this.staticSpans[index].style.transform = "";
          callback();
        }
      };
      requestAnimationFrame(animationFrame);
    }
  
    animateCharacter(span, index) {
      const squishAndAnimate = () => {
        this.squishDownAnimation(index, () => {
          let t = 0;
          const maxT = 1;
          const initialColor = Math.random() * 360;
          let abs = !!Math.round(Math.random());
  
          let randomX2 = abs ? this.random(0, 90) : this.random(-90, 0);
          let randomX3 = abs ? this.random(90, 150) : this.random(-150, -90);
          let randomX4 = abs ? this.random(150, 200) : this.random(-200, -150);
  
          let randomY2 = this.random(-250, -90);
          let randomY3 = this.random(randomY2 - 90, randomY2);
  
          let randomFontSize = this.random(2, 4).toFixed(2);
          let font = {
            start: randomFontSize,
            end: (randomFontSize * this.random(1, 1.2)).toFixed(2)
          };
          let randomDegree = this.random(0, 360).toFixed(1);
          let randomVelocity = this.random(0.25, 1).toFixed(1);
  
          span.style.fontSize = `${font.start}vh`;
          const originalHtml = span.innerHTML;
  
          if (parseFloat(this.random(1, 12).toFixed(0)) === 4) {
            span.innerHTML = this.emojiEntities[
              parseFloat(this.random(0, 5).toFixed(0))
            ];
          }
  
          const frame = () => {
            if (t <= maxT) {
              const { x, y } = this.bezier(
                t,
                { x: 0, y: 0 },
                { x: randomX2, y: randomY2 },
                { x: randomX3, y: randomY3 },
                { x: randomX4, y: 0 }
              );
              span.style.transform = `translate(${x}px, ${y}px) rotate(${(
                randomDegree *
                (1 - t)
              ).toFixed(0)}deg)`;
              span.style.color = `hsl(${
                (initialColor + t * 360) % 360
              }, 100%, 50%)`;
              span.style.opacity = `${1 - t}`;
              span.style.fontSize = `calc(100% + ${(font.end * (1 - t)).toFixed(
                2
              )}vh)`;
              t += 0.01;
              requestAnimationFrame(frame);
            } else {
              abs = !!Math.round(Math.random());
              randomX2 = abs ? this.random(0, 90) : this.random(-90, 0);
              randomX3 = abs ? this.random(90, 150) : this.random(-150, -90);
              randomX4 = abs ? this.random(150, 200) : this.random(-200, -150);
              randomY2 = this.random(-250, -90);
              randomY3 = this.random(randomY2 - 90, randomY2);
              randomFontSize = this.random(2, 4).toFixed(2);
              font = {
                ...font,
                end: (randomFontSize * this.random(1, 1.2)).toFixed(2)
              };
              randomDegree = this.random(0, 360).toFixed(1);
              randomVelocity = this.random(0.25, 1).toFixed(1);
              span.innerHTML = originalHtml;
              setTimeout(() => {
                squishAndAnimate();
              }, this.random(2000, 10000));
            }
          };
  
          frame();
        });
      };
      squishAndAnimate();
    }
  
    // Utility
    debounce(func) {
      let timer;
      return function (event) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(func, 100, event);
      };
    }
  
    updateSpanPositions() {
      this.spans.forEach((span, index) => {
        const rect = this.staticContainer.children[index].getBoundingClientRect();
        span.style.left = `${rect.left}px`;
        span.style.top = `${rect.top}px`;
      });
    }
  
    bezier(t, p0, p1, p2, p3) {
      const cx = 3 * (p1.x - p0.x),
        bx = 3 * (p2.x - p1.x) - cx,
        ax = p3.x - p0.x - cx - bx,
        cy = 3 * (p1.y - p0.y),
        by = 3 * (p2.y - p1.y) - cy,
        ay = p3.y - p0.y - cy - by;
      const x = ax * Math.pow(t, 3) + bx * Math.pow(t, 2) + cx * t + p0.x;
      const y = ay * Math.pow(t, 3) + by * Math.pow(t, 2) + cy * t + p0.y;
      return { x, y };
    }
  
    random(min, max) {
      return Math.random() * (max - min) + min;
    }
  
    handleResize() {
      this.updateSpanPositions();
    }
  }
  
  // Init
  const p = new Popper(document.querySelector(".popper"));
  p.popperify();