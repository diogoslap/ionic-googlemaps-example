import { Component } from "@angular/core";
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  Marker,
  LatLng,
  ILatLng,
  LocationService,
  MyLocation,
  MyLocationOptions
} from "@ionic-native/google-maps";
import { LaunchNavigator } from "@ionic-native/launch-navigator/ngx";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage {
  map: GoogleMap;
  public pinLocation: boolean;
  myLocation: LatLng;
  marker: Marker;

  constructor(private launchNavigator: LaunchNavigator) {
    this.pinLocation = false;
  }

  ionViewDidEnter() {
    this.loadMap();
  }

  loadMap() {
    const location = new LatLng(37.4027209, -122.181181);
    const mapOptions: GoogleMapOptions = {
      controls: {
        zoom: true
      },
      camera: {
        target: location,
        zoom: 12
      }
    };

    this.map = GoogleMaps.create("map", mapOptions);
  }

  changePosition() {
    const options: MyLocationOptions = {
      enableHighAccuracy: true
    };
    LocationService.getMyLocation(options).then((myLocation: MyLocation) => {
      this.myLocation = myLocation.latLng;

      if (this.marker != null) {
        this.marker.remove();
      }
      const cameraPos: CameraPosition<ILatLng> = {
        target: this.myLocation,
        zoom: 14
      };

      this.map.animateCamera(cameraPos);

      this.marker = this.map.addMarkerSync({
        title: "Você está aqui",
        icon: "red",
        animation: "DROP",
        position: this.myLocation
      });
      this.marker.showInfoWindow();
      this.pinLocation = true;

      this.marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
        this.openPosition();
      });
    });
  }

  openPosition() {
    this.launchNavigator.navigate([this.myLocation.lat, this.myLocation.lng]);
  }
}
