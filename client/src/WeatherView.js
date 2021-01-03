import React from "react";
import {observer} from "mobx-react";
import moment from "moment";
import {Spinner, Table} from "react-bootstrap";

import {UploadFileComponent} from "./Components/UploadFile";


const renderTableData = (weatherStore) => {
    if (!weatherStore.getSelectedFile) return

    return Object.entries(weatherStore.getSelectedFile).map(cityData => {
        const cityName = cityData[0]
        const {currentTemperature, condition, lastTriggered, status} = cityData[1]
        return (
            <tr key={cityName}>
                <td>{cityName}</td>
                <td>{currentTemperature}</td>
                <td>{condition.operator}{condition.temperature}</td>
                <td>{lastTriggered ? moment(lastTriggered).format('DD/MM/YYYY, HH:mm') : '-'}</td>
                <td><span className={status ? 'danger' : 'success'}>●</span></td>
            </tr>
        )
    })
}
const renderTableHeader = () => {
    return (
        <thead>
        <tr>
            <th>City</th>
            <th>Current Temperature</th>
            <th>Condition</th>
            <th>Last Triggered</th>
            <th>Status</th>
        </tr>
        </thead>

    )
}
export const WeatherView = observer(({weatherStore}) => {
    if(weatherStore.isLoading) {
        return (
            <div className="spinner-container">
                <Spinner animation="grow" variant="secondary">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            </div>

        )
    }
    return (
        <React.Fragment>
            <Table>
                {renderTableHeader()}
                <tbody>
                {renderTableData(weatherStore)}
                </tbody>
            </Table>
            <UploadFileComponent onChangeHandler={weatherStore.onChangeHandler}
                                 onFileUpload={weatherStore.onFileUpload}/>
        </React.Fragment>
    );
})