import React from "react";

export const UploadFileComponent = props => {
    return(
        <div className="file-upload-container">
            <input type="file" name="file"  onChange={props.onChangeHandler}/>
        </div>
    )
}