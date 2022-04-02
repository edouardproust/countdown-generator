import { config } from "../config.js"

export default class Countdown {

    constructor(data, event) {
        // vars
        this.data = Object.assign({}, {
            type: 'evergreen',
            daysDuration: null,
            deadline: null, // timestamp
            animations: false,
            theme: "dark"
        }, data)
        this.event = event ?? null
        // run
        this.start()
        this.setStyle()
        this.animatedTriggers = {days: null, hours: null, minutes: null, seconds: null}
    }

    start() {
        let ti = this.getTimeInterval()
        if(window.intervalId != undefined){
            window.clearInterval(window.intervalId)
        }
        // calculate every seconds
        window.intervalId = setInterval(() => {
            this.count(ti)
            ti--
        }, 1000)
    }

    setStyle() {
        function addCss(filename) {
            const previousLinkTag = document.head.querySelector('#countdown-theme')
            if(previousLinkTag) previousLinkTag.remove()
            const linkTag = document.createElement('link')
            linkTag.setAttribute('rel', 'stylesheet')
            linkTag.setAttribute('id', 'countdown-theme')
            linkTag.setAttribute('href', config.appPath + 'export/css/' + filename + '.css')
            document.head.appendChild(linkTag)
        }
        ['light', 'dark', 'border'] // add or remove styles here (html options names must be changed too)
            .forEach(theme => {
                if(this.data.theme === theme) {
                    addCss(this.data.theme)
                }
            })
    }
    
    /**
     * Returns time interval based on form data
     * (Note: Stores intervalId in window object)
     * @returns {number} Time interval (in seconds)
     */
    getTimeInterval() {
        if(this.data.deadline) {
            return Math.floor((this.data.deadline - Date.now()) / 1000)
        } else {
            return this.data.daysDuration * 24 * 60 * 60
        }
    }

    /**
     * Calculates each period of the countdown (number of days, hours, minutes & seconds) based on time interval
     * Then shows it throught he DOM
     * @param {number} ti 
     */
    count(ti) {
        const periods = ['days', 'hours', 'minutes', 'seconds']
        let text = {}
        let before = {}
        periods.forEach(period => {
            text[period] = document.querySelector('.epc-digits.'+period)
            before[period] = text[period].innerText // prepare animation
        })
        // set periods in milliseconds
        const day = 60 * 60 * 24
        const hour = 60 * 60
        const minute = 60
        // calculate & update DOM
        text.days.innerText = this.zeroBefore(Math.floor(ti / day))
        text.hours.innerText = this.zeroBefore(Math.floor(ti % day / hour))
        text.minutes.innerText = this.zeroBefore(Math.floor(ti % day % hour / minute))
        text.seconds.innerText = this.zeroBefore(Math.floor(ti % day % hour % minute))
        // animations (process)
        if(this.data.animations) {
            periods.forEach(period => {
                if(before[period] !== text[period].innerText) {
                    this.animate(text[period])
                } else if (this.animatedTriggers[period] !== null) {
                    this.animateBack(this.animatedTriggers[period])
                    this.animatedTriggers[period] = null
                }
            })
        }
    }

    zeroBefore(number) {
        let str = number.toString()
        if(str.length < 2) {
            return '0'+str
        }
        return str
    }

    animate(trigger) {
        gsap.timeline()
            .fromTo(trigger, 0.15, {y: '-100%'}, {y: 0})
            .to(trigger, 0.15, {y: '100%', delay: 0.7})
        let period = trigger.classList[1]
        this.animatedTriggers[period] = trigger
    }
    animateBack(trigger) {
        gsap.fromTo(trigger, 0.15, {y: '-100%'}, {y: 0})
    }

}