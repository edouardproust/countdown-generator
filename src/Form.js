import Popup from "../components/popup/Popup.js"

export default class Form {
    
    constructor() {
        this.error = false
        this.data = false // data submited by the user, ordered in an object
        // selectors
        this.type = document.querySelector('#type')
        this.submitBtn = document.querySelector('#submitBtn')
        // local storage
        this.localStorageData = localStorage.getItem('ep-countdown')
        // DOM custom
        this.setVisibleFields() 
        this.type.addEventListener('change', this.setVisibleFields.bind(this))
    }

    setData(event = null) {
        // reset
        this.data = false
        this.error = false
        // local storage on load
        if(!event && this.localStorageData) { // if local storage contains data:
            this.data = JSON.parse(this.localStorageData) // set data from local storage
            this.setValuesOnLoad()
        }
        // form submit event
        if(event) {
            event.preventDefault()
            // get data based on form
            let formData = this.getFormData()
            // check for errors in data
            this.checkErrors(formData) // updates this.error 
            if(!this.error) {
                this.setLocalStorage(formData)
                this.data = formData 
            }
        }
        this.updateFormValues() // Update form values based on data (class)
        this.updatePageElements() // Update page style & hierarchy (retract form, change button text,...)
    }

    getFormData() {
        let formData = {}
        document.querySelector('.form-container').childNodes.forEach((item, index) => {
            let key = item.id ?? index
            if(item.classList !== undefined) {
                if(item.classList.contains('input')) {
                    const inputField = item.querySelector('input')
                    let inputValue = inputField.value
                    if(inputField.getAttribute('type') === 'number') {
                        inputValue = parseInt(inputField.value)
                    }
                    formData[key] = inputValue
                } else if (item.classList.contains('select')) {
                    const select = item.querySelector('select')
                    formData[key] = select.options[select.selectedIndex].value
                } else if (item.classList.contains('checkbox')) {
                    formData[key] = item.querySelector('input').checked
                }
            }
        })
        // Type "End date": compose dealine timestamp (endDate + endTime)
        if(formData.type === 'deadline') {
            formData.deadline = Date.parse(formData.endDate + ' ' + formData.endTime)
            delete formData.endDate
            delete formData.endTime
            delete formData.daysDuration
        }
        // Type "Evergreen": convert daysDuration into deadline timestamp
        if(formData.type === 'evergreen') {
            formData.deadline = Date.now() + (formData.daysDuration * 24 * 60 * 60 * 1000)
        }
        return formData
    }

    /**
     * Add to/update local storage if evergreen option is ON 
     * OR clear it (if set OFF && was previously not empty)
     * @param {Object} formData An object listing all values of the submitted form fields
     */
    setLocalStorage(formData) {
        this.localStorageData = localStorage.getItem('ep-countdown')
        if(formData.type === 'evergreen') {
            var replacer = function(key, value) {
                if (this[key] instanceof Date) {
                   return this[key].toUTCString();
                }
                return value;
            }
            this.localStorageData = localStorage.getItem('ep-countdown')
            localStorage.setItem('ep-countdown', JSON.stringify(formData, replacer))
            new Popup(`Type "Evergreen" selected: The countdown settings have been saved in your cookies.`, 8000)
        } else if (this.localStorageData) {
            this.localStorageData = null
            localStorage.removeItem('ep-countdown')
            new Popup(`Type "Evergreen" unselected: your cookies have been cleared.`, 7000)
        }
    }

    /**
     * Search for errors in data from submitted form
     * Updates this.error
     * @param {Object} formData  An object listing all values of the submitted form fields
     */
    checkErrors(formData) {
        if(formData.deadline !== undefined) {
            if(formData.deadline < Date.now()) {
                this.error = 'The end date can\'t be set in the past. Please select a later date.'
            }
        }
        if (!this.error) {
            this.error = false
        }
    }

    // DOM

    setValuesOnLoad() {
        if(this.localStorageData) {
            document.querySelector('select[name="type"]').value = this.data.type
            document.querySelector('input[name="days-duration"]').value = this.data.daysDuration
            document.querySelector('input[value="animations"]').checked = this.data.animations
            document.querySelector('select[name="theme"]').value = this.data.theme
        }
    }

    setVisibleFields(event = null) {
        this.endDate = document.querySelector('#endDate')
        this.endTime = document.querySelector('#endTime')
        this.durationDays = document.querySelector('#daysDuration')
        this.chosenType = event ? event.target.value : 'evergreen'
        if(this.chosenType === 'deadline') {
            this.endDate.style.display = 'block'
            this.endTime.style.display = 'block'
            this.durationDays.style.display = 'none'   
        } else {
            this.endDate.style.display = 'none'
            this.endTime.style.display = 'none'
            this.durationDays.style.display = 'block' 
        }
    }

    updateFormValues() {
        // TODO
    }

    updatePageElements() {
        // TODO
    }

}