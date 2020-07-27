import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../../../services/api.service";

@Component({
  selector: 'app-beers',
  templateUrl: './beers.component.html',
  styleUrls: ['./beers.component.scss']
})
export class BeersComponent implements OnInit {
  searchName: String = "";
  searchType: String = "";
  codes: any = [];
  selectedCode: String = "";
  randomBeer: any;
  selectedBeers: any = [];
  page: number = 1;
  numberOfPages = 0;
  loadingInProgress = true;

  constructor(private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.getLocations();
    this.getRandomBeer();
  }

  getRandomBeer() {
    this.apiService.getRandomBeer().subscribe((response) => {
      this.randomBeer = response;
      this.loadingInProgress = false;
      this.searchName = "";
      this.searchType = "";
      this.selectedBeers = [];
      console.log('random:',this.randomBeer)
    })

  }

  searchBeersByName() {
    this.apiService.getBeersByName(this.page, this.searchName).subscribe((response) => {
      this.searchType=""
      this.numberOfPages = response[0].numberOfPages;
      this.selectedBeers = response[0].data
        .filter((beer) => {
          return beer.name.toLowerCase().includes(this.searchName.toLowerCase())
        })
        .map((beer) => {
          return beer
        })
    })
  }

  onNameChange(value) {
    this.searchType="";
    value = this.searchName;
    this.searchBeersByName();
  }

  searchBeersByType() {
    this.apiService.getBeersByType(this.page, this.searchType).subscribe((response) => {debugger
      this.searchName=""
      this.numberOfPages = response[0].numberOfPages;
      this.selectedBeers = response[0].data
        .filter((beer) => {
         return beer.style !== undefined && beer.style !== null && beer.style.name.toLowerCase().includes(this.searchType.toLowerCase())})
        .map((beer) => {
          return beer
        })
    })
  }
  onTypeChange(value) {
    this.searchName="";
    value = this.searchType;
    this.searchBeersByType();
  }
  //Repetitive code:Refractor later!
  getLocations() {  //Get all country codes for a dropdown list
    this.apiService.getLocations().subscribe((response) => {
      this.codes = response
        .filter((brewery) => {
          return brewery.countryIsoCode !== undefined && brewery.countryIsoCode !== null
        })
        .map((brewery) => {
          return brewery.countryIsoCode
        })
      this.countryCodes(response)
    })
  }
  countryCodes(response) {
   const codesArray = response.map(item => item.countryIsoCode);
    this.codes = [...new Set(codesArray)]
  }
  //end

  getBeersByCountry() {
    this.apiService.getBeersByCountry(this.page).subscribe((response) => {
      this.numberOfPages = response[0].numberOfPages;
      this.selectedBeers = response[0].data
        .filter((beer) => {
          return beer.breweries[0].locations[0].countryIsoCode.toLowerCase().includes(this.selectedCode.toLowerCase())
        })
        .map((beer) => {
          return beer
        })
      console.log('selectedBeers: ', this.selectedBeers)
    })
  }

  onCountryChange(selectedValue: string) {
    this.searchName = "";
    this.searchType = "";
    this.selectedBeers = [];
    this.getBeersByCountry();

  }
  clearInputFields() {
    this.getRandomBeer();
    this.searchName = "";
    this.searchType = "";
    this.selectedCode = "";
    this.selectedBeers = [];
    this.page = 1;
    this.numberOfPages = 0;
  }
  getNextPage() {
    this.page+=1
    if (this.searchName.length > 0) {
      this.searchBeersByName()
    } else if (this.searchType.length > 0) (
      this.searchBeersByType()
    )
    else if (this.selectedCode) {
      this.getBeersByCountry()
    }
    this.selectedBeers=[];
    this.randomBeer=[];
    console.log('pages',this.page)
    console.log('numberOfPages',this.numberOfPages)
  }
}
