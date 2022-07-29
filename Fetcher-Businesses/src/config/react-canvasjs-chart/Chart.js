import React, { useEffect } from 'react';
import CanvasJS from 'canvasjs'

const Chart = (props) => {

    useEffect(() => {
      console.warn(CanvasJS.toString())
      var chart = new CanvasJS.Chart("chartContainer"+props.identifier, props.options);
      chart.render();
    })
    return (
      <div id={"chartContainer"+props.identifier} style={props.style}>

      </div>
    );
}

export default Chart;