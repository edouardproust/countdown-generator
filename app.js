import Form from './src/Form.js'
import Countdown from './src/Countdown.js'
import CodeExport from './src/CodeExport.js'
import Popup from './components/popup/Popup.js'
    
(function() {

    const form = new Form
    form.setData()
    if(form.data) {
        new Countdown(form.data)
        new CodeExport(form.data)
    }
    form.submitBtn.addEventListener('click', (e) => {
        form.setData(e)
        if(!form.error) {
            new Countdown(form.data, e)
            new CodeExport(form.data)
        } else {
            new Popup(form.error)
        }
    })
    
})()