import axios from "axios";
import {toJS, action, makeObservable, observable, autorun} from "mobx";

export class WeatherStore {
    selectedFile = null
    isLoading = false
    isDataLoaded = false
    constructor() {
        makeObservable(this, {
            selectedFile: observable,
            onFileUpload: action,
            isLoading: observable,
            poll: action,
            isDataLoaded: observable,
            finishLoading: action,
            onChangeHandler: action
        })
        autorun(() => {
            if(this.isDataLoaded) {
                this.poll()
            }
        })
    }

    get getSelectedFile() {
        return toJS(this.selectedFile)
    }
    poll = () => {
        setTimeout(async () => {
            console.log('updating data')
            await this.updateData()
            this.poll()
        },10000)
    }
    updateData = async () => {
        const res = await axios.post('http://localhost:8000/api/update', this.getSelectedFile)
        this.selectedFile = res.data
    }
    onFileUpload = async () => {
        this.isLoading = true
        const formData = new FormData();
        formData.append(
            "file",
            this.selectedFile
        );
        const res = await axios.post("http://localhost:8000/api/upload", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        this.selectedFile = res.data
        this.finishLoading()
    }
    finishLoading = () => {
        setTimeout(()=> {
            this.isLoading = false
            this.isDataLoaded = true
        }, 3000)
    }
    onChangeHandler = async (event) => {
        this.selectedFile = event.target.files[0]
        await this.onFileUpload()
    }
}