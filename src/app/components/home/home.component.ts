import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { ApexAnnotations, ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexGrid, ApexLegend, ApexNonAxisChartSeries, ApexPlotOptions, ApexResponsive, ApexStroke, ApexTitleSubtitle, ApexTooltip, ApexYAxis } from 'ng-apexcharts';
import { GlobalDataSummary } from 'src/app/models/global-data';
import { DataServiceService } from 'src/app/services/data-service.service';


//Pie chart
export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  stroke: ApexStroke;
  fill: ApexFill;
  legend: ApexLegend;
};

//Column chart
export type ChartOptionsCol = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: any; //ApexXAxis;
  annotations: ApexAnnotations;
  fill: ApexFill;
  stroke: ApexStroke;
  grid: ApexGrid;
  tooltip: ApexTooltip;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  globalData: GlobalDataSummary[];
  loading = true;
  
  totalConfirmed: number = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  totalActive = 0;
  
  //Pie chart
  public chartOptions: Partial<ChartOptions> = {};
  
  //Column chart
  public chartOptionsCol: Partial<ChartOptionsCol> = {};
  
  constructor(private dataService: DataServiceService) { }
  
  ngOnInit(): void {
    this.dataService.getGlobalData().subscribe(
      {
        next: result => {
          // console.log(result);
          
          this.globalData = result;
          
          result.forEach(cs => {
            //There's a line where the numbers are NaN
            if (!Number.isNaN(cs.confirmed)) {
              this.totalActive += cs.active;
              this.totalConfirmed += cs.confirmed;
              this.totalDeaths += cs.deaths;
              this.totalRecovered += cs.recovered;
            }
          });
          
          this.initPieChart('c');
          this.initColChart('c');
        },

        complete: () => {
          this.loading = false;
        }
      }
      );
    }
    
    initPieChart(caseType: string) {
      
      this.chartOptions = {
        series: [], //Numbers
        chart: {
          width: 580,
          type: "pie"
          // background: '#ddd'
        },
        labels: [], //Countries
        stroke: {
          // show: true,
          // curve: 'smooth',
          // lineCap: 'butt',
          // colors: undefined,
          width: 2,
          // dashArray: 0,      
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: "bottom"
              }
            }
          }
        ],
        fill: {
          // colors: [],
          type: "gradient",
          gradient: {
            shade: "light",
            type: "horizontal",
            shadeIntensity: 0.25,
            gradientToColors: undefined,
            inverseColors: true,
            opacityFrom: 0.85,
            opacityTo: 0.85,
            stops: [50, 0, 100]
          }
        },
        legend: {
          markers: {
            width: 12,
            height: 12,
            strokeWidth: 0,
            strokeColor: '#fff',
            fillColors: undefined,
            radius: 12,
            customHTML: undefined,
            onClick: undefined,
            offsetX: 0,
            offsetY: 0
        }
        }
      };
      
      this.chartOptions.labels = [];
      this.chartOptions.series = [];
      
      
      
      this.globalData.forEach(el => {

        let value: number = -1;
        if (!Number.isNaN(el.confirmed)) {
          if (caseType == 'c') {
            if (el.confirmed >= 500000) {
              value = el.confirmed;
            }
          }
          else if (caseType == 'd') {
            if (el.deaths >= 10000) {
              value = el.deaths;
            }
          }
          else if (caseType == 'r') {
            if (el.recovered >= 250000) {
              value = el.recovered;
            }
          }
          else if (caseType == 'a') {
            if (el.active >= 200000) {
              value = el.active;
            }
          }

          if (value > -1) {
            this.chartOptions.labels.push(el.country);
            this.chartOptions.series.push(value);
          }

        }
        
      });
      
    }
    
    initColChart(caseType: string) {
      
      this.chartOptionsCol = {
        series: [
        ],
        annotations: {
          // points: [
          //   {
          //     x: "Bananas",
          //     seriesIndex: 0,
          //     label: {
          //       borderColor: "#775DD0",
          //       offsetY: 0,
          //       style: {
          //         color: "#fff",
          //         background: "#775DD0"
          //       },
          //       text: "Bananas are good"
          //     }
          //   }
          // ]
        },
        chart: {
          height: 400,
          type: "bar",
          toolbar: {
            autoSelected: "zoom",
            tools: {
              download: false,
              selection: true,
              zoom: false,
              zoomin: true,
              zoomout: true,
              pan: true,
            }
          }
        },
        plotOptions: {
          bar: {
            columnWidth: "75%",
            endingShape: "rounded"
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: 2
        },
        grid: {
          row: {
            colors: ["#fff", "#d0def2"]
          }
        },
        xaxis: {
          labels: {
            rotate: -45
          },
          categories: [],
          tickPlacement: "on"
        },
        yaxis: {
          title: {
            text: "Confirmed Cases",
            style: {
              fontSize:  '15px',
              fontWeight:  'normal',
              fontFamily:  'Roboto',
              color:  '#263238'
            }
          }
        },
        fill: {
          // colors: [],
          type: "gradient",
          gradient: {
            shade: "light",
            type: "horizontal",
            shadeIntensity: 0.25,
            gradientToColors: undefined,
            inverseColors: true,
            opacityFrom: 0.85,
            opacityTo: 0.85,
            stops: [50, 0, 100]
          }
        },
        tooltip: {
          marker: {
            show: true,
            fillColors: ['#3b3d40']
          }
        }
      };
      
      let typeName = '';
      let dt: number[] = [];
      this.globalData.forEach(el => {

        let value: number = -1;

        if (!Number.isNaN(el.confirmed)){
          if (caseType == 'c') {
            if(el.confirmed >= 500000) {
              value = el.confirmed;
              typeName = 'Confirmed';
              this.chartOptionsCol.fill.colors=['#1070e6'];
              this.chartOptionsCol.stroke.colors=['#0f5ab8'];
            }
          }
          if (caseType == 'd') {
            if(el.deaths >= 10000) {
              value = el.deaths;
              typeName = 'Deaths';
              this.chartOptionsCol.fill.colors=['#7e8287'];
              this.chartOptionsCol.stroke.colors=['#3b3d40'];
            }
          }
          if (caseType == 'r') {
            if(el.recovered >= 250000){
              value = el.recovered;
              typeName = 'Recovered';
              this.chartOptionsCol.fill.colors=['#46c43b'];
              this.chartOptionsCol.stroke.colors=['#2f8727'];
            }
          }
          if (caseType == 'a') {
            if(el.active >= 200000){
              value = el.active;
              typeName = 'Active';
              this.chartOptionsCol.fill.colors=['#e61e10'];
              this.chartOptionsCol.stroke.colors=['#9e1309'];
            }
          }

          if (value > -1) {
            this.chartOptionsCol.xaxis.categories.push(el.country);
            dt.push(value);
          }
          
        }
      });
      this.chartOptionsCol.series.push({name: typeName, data: dt});
      this.chartOptionsCol.yaxis.title.text = typeName;
      
      // console.log(this.chartOptionsCol.xaxis.categories);
    }
    
    updateCharts(radio: HTMLInputElement) {
      // console.log(radio.value);
      this.initPieChart(radio.value);
      this.initColChart(radio.value);
    }
    
  }
