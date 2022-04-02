import Tooltip from "../components/tooltip/Tooltip.js"
import { config } from "../config.js"

export default class CodeExport {

    constructor(countdownData) {
        this.data = countdownData
        this.textarea = document.querySelector('#code-export')
        this.copyBtn = document.querySelector('.export-copy-btn')
        // DOM update
        this.copyEvent()
        this.getFiles()
    }

    copyEvent() {            
        const copyTooltip = new Tooltip({
            content: 'Copied!', 
            container: document.querySelector('.code-export-container'),
            y: '30px',
            translateY: '-20px',
            delay: 1
        })
        this.copyBtn.addEventListener('click', (e) => {
            e.preventDefault()
            this.textarea.select();
            document.execCommand("copy");
            copyTooltip.show()
        })
    }

    async getFiles() {
        // HTML
            let html = ''
            const htmlFile = config.appPath + 'export/countdown.html'
            html += await fetch(htmlFile)
                .then(resp => resp.text())
                .then(html => html)
        // CSS
            let css = ''
            // main
            const cssMainFile = config.appPath + 'export/css/countdown.css'
            css += await fetch(cssMainFile)
                .then(resp => resp.text())
                .then(css => css)
            // theme
            let cssThemeFile
            ['dark', 'light', 'border'].forEach(theme => {
                if(this.data.theme === theme) cssThemeFile = config.appPath + 'export/css/'+theme+'.css'
            })
            css += await fetch(cssThemeFile)
                .then(resp => resp.text())
                .then(css => css)
            // animations
            if(this.data.animations) {
                const cssAnimFile = config.appPath + 'export/css/animations.css'
                css += await fetch(cssAnimFile)
                    .then(resp => resp.text())
                    .then(css => css)
            }
            // wrap to HTMLs
            html += '<style>' + css + '</style>'
        // JS
        let js = ''
            // vars (enddate)
            // file: evergreen.js, deadline.js or duration.js
            // wrap to HTMLs
            html += '<script>' + js + '</script>'
        // minify
            html = html.replace(/ +/g, ' ')
        // add to page
        this.textarea.innerText = html
    }

}