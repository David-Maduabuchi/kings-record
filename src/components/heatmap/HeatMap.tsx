import ReactApexChart from "react-apexcharts";

//All graphs share the same CSS file, for clarity, Ctrl + P, search barChart.scss and hit enter

interface Props {
  title: string;
  date: string;
  membershipData: ApexAxisChartSeries;
}

const HeatmapChart = (props: Props) => {
  const options: ApexCharts.ApexOptions = {
    chart: {
      height: 350,
      type: "heatmap",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        radius: 0,
        useFillColorAsStroke: true,
        colorScale: {
          ranges: [
            {
              from: -30,
              to: 5,
              name: "low",
              color: "#00A100",
            },
            {
              from: 6,
              to: 20,
              name: "medium",
              color: "#128FD9",
            },
            {
              from: 21,
              to: 45,
              name: "high",
              color: "#FFB200",
            },
            {
              from: 46,
              to: 55,
              name: "extreme",
              color: "#FF0000",
            },
          ],
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 1,
    },
    xaxis: {
      labels: {
        show: false,
      },
    },
  };

  return (
    <div className="barChartBox">
      <div className="graphHeader">
        <div className="Barheader">
          <span className="headerText">{props.title}</span>
          <div className="graphHeaderIcon">
            <img src="/svg/info.svg" alt="" />
          </div>
        </div>
        <div className="date">{props.date}</div>
      </div>
      <ReactApexChart
        options={options}
        series={props.membershipData}
        type="heatmap"
        width="100%"
      />
    </div>
  );
};

export default HeatmapChart;
