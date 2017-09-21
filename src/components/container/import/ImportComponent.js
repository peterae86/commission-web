import React from "react";
import {Uploader} from 'react-file-upload';
class  ImportComponent extends React.Component{
    constructor(props){
        super();
        console.log(Uploader);
    }

    render(){
        return (
            <Uploader url="" />
        )
    }
}

export default ImportComponent;
