{
  const digitalMap = {
    0: "零",
    1: "一",
    2: "二",
    3: "三",
    4: "四",
    5: "五",
    6: "六",
    7: "七",
    8: "八",
    9: "九",
    10: "十",
    11: "十一",
    12: "十二",
    13: "十三",
    14: "十四",
    15: "十五",
    16: "十六",
    17: "十七",
    18: "十八",
    19: "十九",
    20: "二十",
    21: "二十一",
    22: "二十二",
    23: "二十三",
    24: "二十四",
    25: "二十五",
    26: "二十六",
    27: "二十七",
    28: "二十八",
    29: "二十九",
    30: "三十",
    31: "三十一",
    32: "三十二",
    33: "三十三",
    34: "三十四",
    35: "三十五",
    36: "三十六",
    37: "三十七",
    38: "三十八",
    39: "三十九",
    40: "四十",
    41: "四十一",
    42: "四十二",
    43: "四十三",
    44: "四十四",
    45: "四十五",
    46: "四十六",
    47: "四十七",
    48: "四十八",
    49: "四十九",
    50: "五十",
    51: "五十一",
    52: "五十二",
    53: "五十三",
    54: "五十四",
    55: "五十五",
    56: "五十六",
    57: "五十七",
    58: "五十八",
    59: "五十九",
    60: "六十",
  };

  const YEARS = [`${new Date().getFullYear()}年`];
  const MONTHS = Array(12)
    .fill(0)
    .map((_, i) => `${digitalMap[i+1]}月`);
  const DAYS = Array(31)
    .fill(0)
    .map((_, i) => `${digitalMap[i+1]}日`);
  const HOURS = Array(24)
    .fill(0)
    .map((_, i) => `${digitalMap[i]}时`);
  const MINUTES = Array(60)
    .fill(0)
    .map((_, i) => `${digitalMap[i]}分`);
  const SECENDS = Array(60)
    .fill(0)
    .map((_, i) => `${digitalMap[i]}秒`);

  const getMonthDay = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  }

  class TimeAnimation {
    constructor({ el, currentTime }) {
      const parentInfo = el.getBoundingClientRect();
      this.canvas = document.createElement("canvas");
      this.canvas.width = parentInfo.width;
      this.canvas.height = parentInfo.height;
      this.ctx = this.canvas.getContext("2d");
      this.currentTime = currentTime;
      this.year = this.createAnimationObj({
        radius: -15,
        data: Array(1).fill(0),
      });
      this.month = this.createAnimationObj({
        radius: 40,
        data: Array(12).fill(0),
      });
      this.day = this.createAnimationObj({
        radius: 90,
        data: Array(getMonthDay(new Date().getFullYear(), new Date().getMonth())).fill(0),
      });
      this.hour = this.createAnimationObj({
        radius: 140,
        data: Array(24).fill(0),
      });
      this.minute = this.createAnimationObj({
        radius: 190,
        data: Array(60).fill(0),
      })
      this.second = this.createAnimationObj({
        radius: 240,
        data: Array(60).fill(0),
      });
      el.appendChild(this.canvas);
    }

    start() {
      this.initData(new Date(new Date().setSeconds(new Date().getSeconds() + 3)));
      const list = [...this.year, ...this.month, ...this.day, ...this.hour, ...this.minute, ...this.second];
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      let interval = 100;
      let p = Promise.resolve();
      list.forEach(item => {
        p = p.then(() => {
          return new Promise((resolve, _) => {
            setTimeout(() => {
              this.drawText({
                textObj: item,
                center: { x: this.canvas.width / 2, y: this.canvas.height / 2 },
              });
              resolve();
            }, interval-=0.5);
          })
        })
      })
      p.then(() => setInterval(() => {this.play()}, 1000))
    }

    play() {
      this.initData(new Date());
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawArray(this.year);
      this.drawArray(this.month);
      this.drawArray(this.day);
      this.drawArray(this.hour);
      this.drawArray(this.minute);
      this.drawArray(this.second);
    }

    initData(current) {
      this.setData(YEARS, this.year, 0);
      this.setData(MONTHS, this.month, current.getMonth() ? current.getMonth() : 7);
      this.setData(DAYS, this.day, current.getDay());
      this.setData(HOURS, this.hour, current.getHours());
      this.setData(MINUTES, this.minute, current.getMinutes());
      this.setData(SECENDS, this.second, current.getSeconds());
    }

    setData(sourceArr, dstArr, index) {
      let j = 0;
      for (let i = index; i < sourceArr.length; i++, j++) {
        dstArr[j].text = sourceArr[i];
      }
      for (let i = 0; i < index; i++, j++) {
        dstArr[j].text = sourceArr[i];
      }
    }

    drawArray(arr) {
      arr.forEach((item) => {
        this.drawText({
          textObj: item,
          center: { x: this.canvas.width / 2, y: this.canvas.height / 2 },
        })
      })
    }

    drawText({
      textObj = {},
      center = { x: 0, y: 0 },
      textBaseline = "middle",
    }) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.textBaseline = textBaseline;
      this.ctx.translate(center.x, center.y);
      this.ctx.rotate(textObj.angle);
      this.ctx.fillStyle = textObj.color;
      this.ctx.fillText(textObj.text, textObj.radius, 0);
      this.ctx.closePath();
      this.ctx.restore();
    }

    createAnimationObj({ radius = 0, data = [] }) {
      const len = data.length;
      const avgAngle = (360 / len) * (Math.PI / 180);
      return data.map((item, index) => ({
        radius,
        text: null,
        angle: index * avgAngle,
        color: index === 0 ? 'red' : 'black',
      }));
    }
  }
  window.TimeAnimation = TimeAnimation;
}
