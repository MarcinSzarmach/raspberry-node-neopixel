const ws2821x = require('@gbkwiatt/node-rpi-ws281x-native');
const { node } = require('./node')

const common = require('./common')
const gpio = 18

const channels = ws2821x.init({
    dma: 10,
    freq: 800000,
    channels: [
        { count: 62, gpio, invert: false, brightness: 100, stripType: 'ws2812' },
    ]
});

class App {
    constructor() {
        this.currentDimmer = 0;
        this.finalNumber = 255;
        this.timer;
        this.direction = 'lightUp';
        this.effect = 'smooth';
        this.effects = ['smooth', 'rainbow'];
        this.animationRunning = false;
        (async () => {
            console.log(`Led controller initialized at ${common.getTimeAndDate()}`)
            console.log(`Starting Animations ${common.getTimeAndDate()}`)
            await this.startAnimations();
        })();
    }
    async stopAnimations() {
        if (!this.animationRunning) {
            return
        }
        clearInterval(this.timer)
        this.animationRunning = false;

    }
    async startAnimations() {
        if (this.animationRunning) {
            return
        }
        this.animationRunning = true;
        this.timer = setInterval(async () => {
            try {
                switch (this.effect) {
                    case 'smooth':
                        await this.lightStartEffectSmooth()
                        break;
                    case 'rainbow':
                        await this.lightStartEffectRainbow()
                        break;
                    case 'xmas':
                        await this.lightStartEffectXmas()
                        break;
                    default:
                        break;
                }
            } catch (error) {
                console.log(error)
            }
        }, 20);
    }
    async lightStartEffectSmooth() {
        const intcrementer = 3
        if (this.currentDimmer > 240 && this.direction === 'lightUp') {
            this.direction = 'lightDown'
        }
        if (this.currentDimmer < 10 && this.direction === 'lightDown') {
            this.direction = 'lightUp'
        }

        if (this.direction === 'lightUp') {
            this.currentDimmer += intcrementer
            this.lightAllUp(common.getFullColorToHex(this.currentDimmer))
            ws2821x.render();
        } else {
            this.currentDimmer -= intcrementer
            this.lightAllUp(common.getFullColorToHex(this.currentDimmer))
            ws2821x.render();
        }
    }

    async lightStartEffectRainbow() {
        for (let index = 0; index < channels[0].array.length; index++) {
            channels[0].array[index] = common.colorWheel((this.currentDimmer + index) % 256);
        }
        this.currentDimmer = (this.currentDimmer + 5) % 256;
        ws2821x.render();
    }

    setColor(color) {
        this.lightAllUp(color)
    }
    lightAllUp(color = 0xffffff) {
        for (let index = 0; index < channels[0].array.length; index++) {
            channels[0].array[index] = color;
        }
        ws2821x.render();
    }
    getStateForAPI() {
        return {
            animationRunning: this.animationRunning,
            effect: this.effect,
            effects: this.effects,
        }
    }
}

let app = new App()

node(app)

process.on('SIGINT', _ => {
    app.sensorDown.unexport();
    console.log(`App is destroyed by force at ${common.getTimeAndDate()}`)
    process.exit();
});
process.on('exit', () => {
    console.log(`App is destroyed at ${common.getTimeAndDate()}`)
    process.exit();
});
