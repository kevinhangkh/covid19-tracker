import { Component, Input, OnInit } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexGrid, ApexStroke, ApexTitleSubtitle, ApexXAxis } from 'ng-apexcharts';
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateWiseDataSummary } from 'src/app/models/date-wise-data';
import { GlobalDataSummary } from 'src/app/models/global-data';
import { DataServiceService } from 'src/app/services/data-service.service';

//Line chart
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {

  globalData: GlobalDataSummary[];
  countries: string[] = [];
  defaultCountry = 'France';
  loading = true;
  
  totalConfirmed = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  totalActive = 0;

  dateWiseData;
  selectedCountryData: DateWiseDataSummary[];

  //Line chart
  lineChart: Partial<ChartOptions> = {};

  constructor(private dataService: DataServiceService) { }

  ngOnInit(): void {

    //Merging both subscriptions
    merge(
      this.dataService.getGlobalData().pipe(
        map(result => {
          this.globalData = result;
          this.globalData.forEach(el => {
            this.countries.push(el.country);
          });
        })
      ),
      this.dataService.getDateWiseData().pipe(
        map(result => {
          this.dateWiseData = result;
        })
      )
    ).subscribe(
      {
        complete : () => {
          this.updateValue(this.defaultCountry);
          this.initLineChart();
          this.loading = false;
        }
      }
    );

    // this.dataService.getGlobalData().subscribe(result => {
    //   this.globalData = result;
    //   this.globalData.forEach(el => {
    //     this.countries.push(el.country);
    //   });
    // });


    // this.dataService.getDateWiseData().subscribe(
    //   result => {
    //   // console.log(result);
    //   this.dateWiseData = result
    //   // console.log(this.dateWiseData);
      
    // });
    
  }

  updateValue(country: string) {
    console.log(country);
    
    this.globalData.forEach(el => {
      if (el.country == country) {
        this.totalConfirmed = el.confirmed;
        this.totalDeaths = el.deaths;
        this.totalRecovered = el.recovered;
        this.totalActive = el.active;
        
        console.log(el);
      }
      
    });

    // console.log(this.dateWiseData);
    
    this.selectedCountryData = this.dateWiseData[country];
    console.log(this.selectedCountryData);
    
    this.initLineChart();
    // this.totalConfirmed = this.globalData[country].confirmed;
  }

  initLineChart() {

    this.lineChart = {
      series: [
        // {
        //   name: "Cases",
        //   data: []
        //   // [10, 41, 35, 51, 49, 62, 69, 91, 148]
        // }
      ],
      chart: {
        height: 500,
        type: "line",
        zoom: {
          type: "x",
          enabled: true,
          autoScaleYaxis: true
        },
        toolbar: {
          autoSelected: "zoom",
          tools: {
            download: false,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
          }
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth",
        lineCap: 'round',
        width: 3
      },
      title: {
        text: "Cases progression",
        align: "left",
        style: {
          fontSize:  '14px',
          fontWeight:  'normal',
          fontFamily:  'Roboto',
          color:  '#263238'
        }
      },
      grid: {
        row: {
          // colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          colors: ["#fff", "#d0def2"], // takes an array which will be repeated on columns
          // opacity: 0.5
        }
      },
      xaxis: {
        type: 'datetime',
        categories: [
          // "Jan",
          // "Feb",
          // "Mar",
          // "Apr",
          // "May",
          // "Jun",
          // "Jul",
          // "Aug",
          // "Sep"
        ],
        labels: {
          format: 'MMM yyyy'
          // datetimeFormatter: {
          //   year: 'yyyy',
          //   month: 'MMM \'yy',
          //   day: 'dd MMM',
          //   hour: 'HH:mm'
          // }
        }
      }
    };

    let cases: {x:Date, y:number}[] = [];
    this.selectedCountryData.forEach(el => {
      cases.push({x: el.date, y:el.cases});
    });

    this.lineChart.series.push({name: "Cases", data: cases});
    
  }

}
