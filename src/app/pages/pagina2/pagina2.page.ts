import { Component, OnInit } from '@angular/core';
import { Printer, PrintOptions } from '@ionic-native/printer/ngx';
import { ToastController, LoadingController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

import { NFC, Ndef } from '@ionic-native/nfc/ngx';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MyserviceService } from 'src/app/service/myservice.service';
import * as moment from 'moment';
import { IntegradorService } from 'src/app/service/integrador.service';

@Component({
  selector: 'app-pagina2',
  templateUrl: './pagina2.page.html',
  styleUrls: ['./pagina2.page.scss'],
})
export class Pagina2Page implements OnInit {
  tagId;
  pantalla;
  myoptions;
  contenido;

  totalGeneral = 0;
  btnValores = [];
  // btnValores = [1000, 2000, 5000, 10000];

  ventaRuta;
  idServicio;
  loading = false;

  constructor(
    private printer: Printer,
    public toastcontroller: ToastController,
    public loadingCtrl: LoadingController,
    private splashScreen: SplashScreen,
    private nfc: NFC,
    private ndef: Ndef,
    public platform: Platform,
    private toastCtrl: ToastController,
    private router: Router,
    public mys: MyserviceService,
    private integrador: IntegradorService
  ) { }

  ngOnInit() {

    // this.ventaRuta = { caratula: '0120C013824', rut: '10978437-0', boleto: 'SVE0000023793' }
    // this.totalGeneral = 5000;

    // setTimeout(() => {
    //   this.Imprimir2();
    // }, 7000);

    this.loading = true;
    this.ventaRuta = this.mys.ventaRuta;

    this.integrador.VRgetCaratula({ rut: this.ventaRuta.rut, caratula: this.ventaRuta.caratula }
    ).subscribe((resp: any) => {
      console.log('respGetCaratula', resp);

      if (resp && resp.servicio && resp.servicio.idServicio) {
        this.idServicio = resp.servicio.idServicio;
        this.mys.ventaRuta['idServicio'] = this.idServicio;
        // alert('idServicio: ' + this.idServicio)
        this.integrador.VRgetTarifa({ idServicio: this.idServicio }).subscribe(resp2 => {
          console.log('respGetTarifa', resp2);

          if (resp2 && resp2.length > 0) {
            this.btnValores = resp2.map(x => parseInt(x.valor));
            // alert('btn0: ' + this.btnValores[0])

          } else {
            alert('No tenemos tarifas diponibles..')
            this.router.navigateByUrl('/caratula');

          }

          this.loading = false;

        });

      } else {
        this.loading = false;
        alert('Servicio no encontrado..');
        this.router.navigateByUrl('/caratula');

      }



    });


  }



  volver() {
    this.router.navigateByUrl('/home');
  }

  async toast_mostrar(
    message: string,
    duration: number,
    color?: string,
    position?: any
  ) {
    const toast = await this.toastcontroller.create({
      message,
      animated: true,
      duration,
      color,
      position,
    });
    toast.present();
  }

  limpiar() {
    // this.mys.valores.caratula = null;
    // this.mys.valores.servicio = "";
    // this.mys.valores.total = 0;
    // this.mys.valores.totalMostrar = "";
    // this.mys.valores.fecha = null;
  }

  // Imprimir2(myItem: any) {
  //     console.log('this.ImprimirAcumuladoDsdIII2', this.mys.acumulado);
  //     this.myoptions = {
  //       name: 'pullman_001',
  //     }
  //     this.contenido = `<div style="display: table;">
  //     <div style="display: table-row;text-align:center"><img
  //     src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAL4AAAARAQAAAABLRSsLAAAC3mlDQ1BEb3QgR2FpbiAyMCUAAHicY2BgnsAABEwCDAwFRSVF7kGOkRGRUQrsNxnYGJgYeBgsGNgSk4sLfIPdQhhwgm/XGBhB9GVd3GpwAtZkoMVA+gAQG6WkFicD6S9AnF5eUgAUZ4wBskWSssHsAhA7OyTIGchuAbqapyS1AqSXwTm/oLIoMz2jREEjWVPByMDAUsE5vyg1B0QW5BcllmTm58EshNoBArwu+SUK7omZeUAtqmS4HS8AhSOEhQgfhBgCJJcWlUFYYEUCDAoMBgwODAEMiQz1DAsYjjK8YRRndGEsZVzBeI9JjCmIaQLTBWZh5kjmhcxvWCxZOlhuseqxtrLeY7Nkm8b2jT2cfTeHEkcXxxfORM4LXI5cW7g1uRfwSPFM5RXincQnzDeNX4Z/sYCOwA5BV8ErQqlCP4R7RVRE9oqGi34RmyRuJH5FokJSTvKYVL60tPQJmTJZddlbcn3yLvJ/FLYqFirpKb1VXqtSoGqi+lPtoHqXRqimkuYHrQPak3RSda30BPVe6R8xWGBYaxRjbGsib8ps+tLsgvlOiyWWE6zqrHNt4mwD7VztrR2MHXWc1JyVXBRc5d0U3JU91D11vUy8bXzcfYP9EvzzA+oDJwYtDd4VcjH0ZThThFykVVREdEXMzNg9cQ8S2BJ1k8KSG1LWpN5M58iwyMzMmpt9MZc9zz6/omBT4bti7ZKs0lVlbyr0K0uqdtUw1nrVTa1/2KjXVNN8tlWurbD9aKd0V1H36V7Vvsb+uxNtJs2e/Hdq/LTDMzRm9s/6Pidh7un55guWLhJZ3Lrk27LM5fdWhqw6vcZl7b71lhu2bTLZvGWrybbtO6x27t/tuufsvrD9Dw7mHPp5pP2Y+PEVJ61PnTuTfPbX+UkXtS8dvZJ49d/1OTdtbt29U39P+f6Jh3mPxZ7sf5b5QuTlwdf5b+XfXfjQ9Mn086uvC76H/xT4depP6z/H//8BrvkJNtP5UDIAAAAJcEhZcwAACxIAAAsSAdLdfvwAAAE5SURBVHicbVA9S8NQFD1JLk3A0tatg2h+QnByzOifEIKTmx0t+JG3KTh27NCf4Ojma3Xo2F9QIwiWUuVZo6bNS58vsRUK3uG8y+Gec989pAxLItuYL7Asw040ZqSgKWnLFa8wL17K2/+KCoukMlsRK0uCqZh/A0V02rRf3eOzyke3M7xPSVLK0OiLJD0/WAjBm5ufPLjtgZKSNJi/F8UwIhVp150Rw8mVtorN9a296hxiFyRgmuANjrfs0eD8TqAaM7+cf7c+Xs4Gh3+yASjy9lsp871BnD6ZDGG30bb0pgdCNWwtxzoFXrYBDz5xP9GB8KAz+r62wC66XnlCjj2j/O7Sb0q1cYF1aWktheodlRlDMJg8l3V+IdyRc7T1lStq64fwmoIryIAT9KeSwRvGTpwqWOS9THvbP1+Jg6eGxblOAAAAAElFTkSuQmCC"></div>
  //   <div style="display: table-row;text-align:center">www.pullmanbus.cl</div>
  //   <br><div style="display: table-row;text-align:center"><small>Caratula: <strong>123345</strong></small></div>
  //   <br><div style="display: table-row;text-align:center"><small>RUT: <strong>13.969.123-5</strong></small></div>
  //   <br><div style="display: table-row;text-align:center"><small>Pos: <strong>4</strong></small></div>
  //   <br><div style="display: table-row;text-align:center"><small>Fecha:<strong> ${ moment(myItem.fecha2).format('DD/MM/YYYY')}</strong></small></div>
  //   <br><div style="display: table-row;text-align:center"><small>Hora: <strong>${ moment(myItem.fecha2).format('HH:mm')}</strong></small></div>
  //   <br><div style="display: table-row;text-align:center">Valor: <strong>${myItem.totalMostrar}</strong></div>
  //   <br><br><br><br><br></div>`;
  //     this.printer.print(this.contenido, this.myoptions)
  //       .then(succes => {
  //         console.log('acumuladoDsdI2', this.mys.acumulado);
  //         this.router.navigateByUrl('/pagina3')
  //       }, error => {
  //         this.toast_mostrar('Hubo un error, intente nuevamente..', 4000, "primary", "top");
  //         this.router.navigateByUrl('/home')
  //       });
  //   }
  // }

  // Imprimir2() {
  //   let fechaActual = moment().format('DD/MM/YYY');
  //   let horaActual = moment().format('HH:mm:ss');
  //   if (this.totalGeneral !== 0) {

  //     this.myoptions = {
  //       name: 'pullman_001',
  //     };
  //     this.contenido = `<div style="display: table;">
  //     <div style="display: table-row;text-align:center"><img
  //     src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAL4AAAARAQAAAABLRSsLAAAC3mlDQ1BEb3QgR2FpbiAyMCUAAHicY2BgnsAABEwCDAwFRSVF7kGOkRGRUQrsNxnYGJgYeBgsGNgSk4sLfIPdQhhwgm/XGBhB9GVd3GpwAtZkoMVA+gAQG6WkFicD6S9AnF5eUgAUZ4wBskWSssHsAhA7OyTIGchuAbqapyS1AqSXwTm/oLIoMz2jREEjWVPByMDAUsE5vyg1B0QW5BcllmTm58EshNoBArwu+SUK7omZeUAtqmS4HS8AhSOEhQgfhBgCJJcWlUFYYEUCDAoMBgwODAEMiQz1DAsYjjK8YRRndGEsZVzBeI9JjCmIaQLTBWZh5kjmhcxvWCxZOlhuseqxtrLeY7Nkm8b2jT2cfTeHEkcXxxfORM4LXI5cW7g1uRfwSPFM5RXincQnzDeNX4Z/sYCOwA5BV8ErQqlCP4R7RVRE9oqGi34RmyRuJH5FokJSTvKYVL60tPQJmTJZddlbcn3yLvJ/FLYqFirpKb1VXqtSoGqi+lPtoHqXRqimkuYHrQPak3RSda30BPVe6R8xWGBYaxRjbGsib8ps+tLsgvlOiyWWE6zqrHNt4mwD7VztrR2MHXWc1JyVXBRc5d0U3JU91D11vUy8bXzcfYP9EvzzA+oDJwYtDd4VcjH0ZThThFykVVREdEXMzNg9cQ8S2BJ1k8KSG1LWpN5M58iwyMzMmpt9MZc9zz6/omBT4bti7ZKs0lVlbyr0K0uqdtUw1nrVTa1/2KjXVNN8tlWurbD9aKd0V1H36V7Vvsb+uxNtJs2e/Hdq/LTDMzRm9s/6Pidh7un55guWLhJZ3Lrk27LM5fdWhqw6vcZl7b71lhu2bTLZvGWrybbtO6x27t/tuufsvrD9Dw7mHPp5pP2Y+PEVJ61PnTuTfPbX+UkXtS8dvZJ49d/1OTdtbt29U39P+f6Jh3mPxZ7sf5b5QuTlwdf5b+XfXfjQ9Mn086uvC76H/xT4depP6z/H//8BrvkJNtP5UDIAAAAJcEhZcwAACxIAAAsSAdLdfvwAAAE5SURBVHicbVA9S8NQFD1JLk3A0tatg2h+QnByzOifEIKTmx0t+JG3KTh27NCf4Ojma3Xo2F9QIwiWUuVZo6bNS58vsRUK3uG8y+Gec989pAxLItuYL7Asw040ZqSgKWnLFa8wL17K2/+KCoukMlsRK0uCqZh/A0V02rRf3eOzyke3M7xPSVLK0OiLJD0/WAjBm5ufPLjtgZKSNJi/F8UwIhVp150Rw8mVtorN9a296hxiFyRgmuANjrfs0eD8TqAaM7+cf7c+Xs4Gh3+yASjy9lsp871BnD6ZDGG30bb0pgdCNWwtxzoFXrYBDz5xP9GB8KAz+r62wC66XnlCjj2j/O7Sb0q1cYF1aWktheodlRlDMJg8l3V+IdyRc7T1lStq64fwmoIryIAT9KeSwRvGTpwqWOS9THvbP1+Jg6eGxblOAAAAAElFTkSuQmCC"></div>
  //     <div style="display: table-row;text-align:center">www.pullmanbus.cl</div>
  //     <br><div style="display: table-row;text-align:center"><small>Caratula: <strong>${this.mys.ventaRuta.caratula}</strong></small></div>
  //     <br><div style="display: table-row;text-align:center"><small>RUT: <strong>${this.mys.ventaRuta.rut}</strong></small></div>
  //     <br><div style="display: table-row;text-align:center"><small>Pos: <strong>4</strong></small></div>
  //     <br><div style="display: table-row;text-align:center"><small>Fecha:<strong>${fechaActual}</strong></small></div>
  //     <br><div style="display: table-row;text-align:center"><small>Hora: <strong>${horaActual}</strong></small></div>
  //     <br><div style="display: table-row;text-align:center">Valor: <strong>${this.totalGeneral}</strong></div>
  //     <br><br><br><br><br></div>`;
  //     this.printer.print(this.contenido, this.myoptions).then(
  //       (succes) => {
  //         // console.log('acumuladoDsdI2', this.mys.acumulado);
  //         this.router.navigateByUrl('/pagina3');
  //       },
  //       (error) => {
  //         this.toast_mostrar(
  //           'Hubo un error, intente nuevamente..',
  //           4000,
  //           'primary',
  //           'top'
  //         );
  //         this.router.navigateByUrl('/pagina2');
  //       }
  //     );
  //   } else {
  //     alert('Nada para imprimir\nPresione tarifas para continuar. \nIntente nuevamente..')
  //   }
  // }
  ImprimirBoleto() {
    // let fechaActual = moment().format('DD/MM/YYYY');
    // let horaActual = moment().format('HH:mm:ss');
    if (this.mys.ventaRuta.totalGeneral !== 0) {

      this.myoptions = {
        name: 'pullman_001',
      };
      this.contenido = `<div style="display: table-row;">
    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAL4AAAARAQAAAABLRSsLAAAC3mlDQ1BEb3QgR2FpbiAyMCUAAHicY2BgnsAABEwCDAwFRSVF7kGOkRGRUQrsNxnYGJgYeBgsGNgSk4sLfIPdQhhwgm/XGBhB9GVd3GpwAtZkoMVA+gAQG6WkFicD6S9AnF5eUgAUZ4wBskWSssHsAhA7OyTIGchuAbqapyS1AqSXwTm/oLIoMz2jREEjWVPByMDAUsE5vyg1B0QW5BcllmTm58EshNoBArwu+SUK7omZeUAtqmS4HS8AhSOEhQgfhBgCJJcWlUFYYEUCDAoMBgwODAEMiQz1DAsYjjK8YRRndGEsZVzBeI9JjCmIaQLTBWZh5kjmhcxvWCxZOlhuseqxtrLeY7Nkm8b2jT2cfTeHEkcXxxfORM4LXI5cW7g1uRfwSPFM5RXincQnzDeNX4Z/sYCOwA5BV8ErQqlCP4R7RVRE9oqGi34RmyRuJH5FokJSTvKYVL60tPQJmTJZddlbcn3yLvJ/FLYqFirpKb1VXqtSoGqi+lPtoHqXRqimkuYHrQPak3RSda30BPVe6R8xWGBYaxRjbGsib8ps+tLsgvlOiyWWE6zqrHNt4mwD7VztrR2MHXWc1JyVXBRc5d0U3JU91D11vUy8bXzcfYP9EvzzA+oDJwYtDd4VcjH0ZThThFykVVREdEXMzNg9cQ8S2BJ1k8KSG1LWpN5M58iwyMzMmpt9MZc9zz6/omBT4bti7ZKs0lVlbyr0K0uqdtUw1nrVTa1/2KjXVNN8tlWurbD9aKd0V1H36V7Vvsb+uxNtJs2e/Hdq/LTDMzRm9s/6Pidh7un55guWLhJZ3Lrk27LM5fdWhqw6vcZl7b71lhu2bTLZvGWrybbtO6x27t/tuufsvrD9Dw7mHPp5pP2Y+PEVJ61PnTuTfPbX+UkXtS8dvZJ49d/1OTdtbt29U39P+f6Jh3mPxZ7sf5b5QuTlwdf5b+XfXfjQ9Mn086uvC76H/xT4depP6z/H//8BrvkJNtP5UDIAAAAJcEhZcwAACxIAAAsSAdLdfvwAAAE5SURBVHicbVA9S8NQFD1JLk3A0tatg2h+QnByzOifEIKTmx0t+JG3KTh27NCf4Ojma3Xo2F9QIwiWUuVZo6bNS58vsRUK3uG8y+Gec989pAxLItuYL7Asw040ZqSgKWnLFa8wL17K2/+KCoukMlsRK0uCqZh/A0V02rRf3eOzyke3M7xPSVLK0OiLJD0/WAjBm5ufPLjtgZKSNJi/F8UwIhVp150Rw8mVtorN9a296hxiFyRgmuANjrfs0eD8TqAaM7+cf7c+Xs4Gh3+yASjy9lsp871BnD6ZDGG30bb0pgdCNWwtxzoFXrYBDz5xP9GB8KAz+r62wC66XnlCjj2j/O7Sb0q1cYF1aWktheodlRlDMJg8l3V+IdyRc7T1lStq64fwmoIryIAT9KeSwRvGTpwqWOS9THvbP1+Jg6eGxblOAAAAAElFTkSuQmCC">
</div>
<div style="display: table-row;text-align:center">
    <div style="display: table-cell;border-bottom: 3px black double;">www.pullmanbus.cl</div>
</div>
<small><br></small>
<div style="display: table-row;text-align:center; ">
    <div style="display: table-cell;text-align: start;">
        </strong>CARATULA:</strong> ${this.mys.ventaRuta.caratula}
    </div>
</div>
<div style="display: table-row;text-align:center; ">
    <div style="display: table-cell;text-align: start;">
        </strong>BOLETO:</strong> ${this.mys.ventaRuta.boleto}
    </div>
</div>

<div style="display: table-row;text-align:center; ">
    <div style="display: table-cell;text-align: start;">
        </strong>RUT: </strong> ${this.mys.ventaRuta.rut}
    </div>
</div>

<div style="display: table-row;text-align:center; ">
    <div style="display: table-cell;text-align: start;">
        </strong>POS: </strong> 4
    </div>
</div>

<div style="display: table; ">
    <div style="display: table-row;text-align:center;">
        <div
            style="display: table-cell;border-right: 1px black dotted;color: white;align-items: center;border-top: 1px black dotted">
            XXX<strong style="color: black">FECHA:</strong>XXX</div>
        <div style="display: table-cell;color: white;align-items: center;border-top: 1px black dotted">XXX<strong
                style="color: black;">HORA:</strong>XXX
        </div>
    </div>
    <div style="display: table-row;text-align:center;">
        <div
            style="display: table-cell;border-right: 1px black dotted;color: black;align-items: center;border-bottom: 1px black dotted">
            ${this.mys.ventaRuta.fecha}
        </div>
        <div style="display: table-cell;color: black;align-items: center;border-bottom: 1px black dotted">
            ${this.mys.ventaRuta.hora}
        </div>
    </div>
</div>
<div style="display: table">
    <div style="display: table-row;text-align:center;">
        <div style="display: table-cell; color: black; align-items: center;">
            <strong> VALOR:</strong> $ ${this.mys.ventaRuta.totalGeneral.toLocaleString('de-DE')}
        </div>
    </div>
    <div style="display: table-row;text-align:center;">
        <div style="display: table-cell; color: white; align-items: center;">
            <small>1234567890987612345678909876</small>
        </div>
    </div>
</div>`;

      this.printer.print(this.contenido, this.myoptions).then(
        (succes) => {
          // console.log('acumuladoDsdI2', this.mys.acumulado);
          this.router.navigateByUrl('/pagina3');
        },
        (error) => {
          console.log('error', error);
          this.toast_mostrar(
            'Hubo un error, intente nuevamente..',
            4000,
            'primary',
            'top'
          );
          this.router.navigateByUrl('/pagina2');
        }
      );
    } else {
      alert('Nada para imprimir\nPresione tarifas para continuar. \nIntente nuevamente..')
    }
  }
  // }

  ImprimirAcumulado() {
    // console.log('this.mys.acumuladoDsdImprimirAcumulado', this.mys.acumulado);
    // this.myoptions = {
    //   name: 'pullman_001',
    // }
    // this.contenido = `<img
    //   src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAL4AAAARAQAAAABLRSsLAAAC3mlDQ1BEb3QgR2FpbiAyMCUAAHicY2BgnsAABEwCDAwFRSVF7kGOkRGRUQrsNxnYGJgYeBgsGNgSk4sLfIPdQhhwgm/XGBhB9GVd3GpwAtZkoMVA+gAQG6WkFicD6S9AnF5eUgAUZ4wBskWSssHsAhA7OyTIGchuAbqapyS1AqSXwTm/oLIoMz2jREEjWVPByMDAUsE5vyg1B0QW5BcllmTm58EshNoBArwu+SUK7omZeUAtqmS4HS8AhSOEhQgfhBgCJJcWlUFYYEUCDAoMBgwODAEMiQz1DAsYjjK8YRRndGEsZVzBeI9JjCmIaQLTBWZh5kjmhcxvWCxZOlhuseqxtrLeY7Nkm8b2jT2cfTeHEkcXxxfORM4LXI5cW7g1uRfwSPFM5RXincQnzDeNX4Z/sYCOwA5BV8ErQqlCP4R7RVRE9oqGi34RmyRuJH5FokJSTvKYVL60tPQJmTJZddlbcn3yLvJ/FLYqFirpKb1VXqtSoGqi+lPtoHqXRqimkuYHrQPak3RSda30BPVe6R8xWGBYaxRjbGsib8ps+tLsgvlOiyWWE6zqrHNt4mwD7VztrR2MHXWc1JyVXBRc5d0U3JU91D11vUy8bXzcfYP9EvzzA+oDJwYtDd4VcjH0ZThThFykVVREdEXMzNg9cQ8S2BJ1k8KSG1LWpN5M58iwyMzMmpt9MZc9zz6/omBT4bti7ZKs0lVlbyr0K0uqdtUw1nrVTa1/2KjXVNN8tlWurbD9aKd0V1H36V7Vvsb+uxNtJs2e/Hdq/LTDMzRm9s/6Pidh7un55guWLhJZ3Lrk27LM5fdWhqw6vcZl7b71lhu2bTLZvGWrybbtO6x27t/tuufsvrD9Dw7mHPp5pP2Y+PEVJ61PnTuTfPbX+UkXtS8dvZJ49d/1OTdtbt29U39P+f6Jh3mPxZ7sf5b5QuTlwdf5b+XfXfjQ9Mn086uvC76H/xT4depP6z/H//8BrvkJNtP5UDIAAAAJcEhZcwAACxIAAAsSAdLdfvwAAAE5SURBVHicbVA9S8NQFD1JLk3A0tatg2h+QnByzOifEIKTmx0t+JG3KTh27NCf4Ojma3Xo2F9QIwiWUuVZo6bNS58vsRUK3uG8y+Gec989pAxLItuYL7Asw040ZqSgKWnLFa8wL17K2/+KCoukMlsRK0uCqZh/A0V02rRf3eOzyke3M7xPSVLK0OiLJD0/WAjBm5ufPLjtgZKSNJi/F8UwIhVp150Rw8mVtorN9a296hxiFyRgmuANjrfs0eD8TqAaM7+cf7c+Xs4Gh3+yASjy9lsp871BnD6ZDGG30bb0pgdCNWwtxzoFXrYBDz5xP9GB8KAz+r62wC66XnlCjj2j/O7Sb0q1cYF1aWktheodlRlDMJg8l3V+IdyRc7T1lStq64fwmoIryIAT9KeSwRvGTpwqWOS9THvbP1+Jg6eGxblOAAAAAElFTkSuQmCC">
    // <div style="display: table;">
    // <div style="display: table-row;">
    //   <div style="display: table-cell;text-align: center;background-color:lightgray; border-left: 1px solid grey;">Fecha-Hora</div>
    //   <div style="display: table-cell;text-align: center;background-color:lightgray; border-left: 1px solid grey;">Cobro</div>
    //   <div style="display: table-cell;text-align: center;background-color:lightgray; border-left: 1px solid grey;border-right: 1px solid grey">Total</div>
    // </div>`;
    // let myTotal = 0;
    // this.mys.acumulado.forEach(element => {
    //   console.log('element', element);
    //   myTotal = myTotal + element.total;
    //   this.contenido = this.contenido + `  <div style="display: table-row;">
    //   <div style="display: table-cell;text-align: center; border-left: 1px solid grey;"><small>${element.fecha.slice(0, -3)}</small></div>
    //   <div style="display: table-cell;text-align: right; border-left: 1px solid grey;"><small>$${element.total}.000</small></div>
    //   <div style="display: table-cell;text-align: right; border-left: 1px solid grey; border-right: 1px solid grey;"><small>$${myTotal}.000</small></div>
    // </div>`;
    // });
    // this.contenido = this.contenido + `</div>`;
    // this.contenido = this.contenido + `<strong>Cantidad: ${this.mys.acumulado.length}</strong><br>`;
    // this.contenido = this.contenido + `<strong>Caratula: 123345</strong><br>`;
    // this.contenido = this.contenido + `<strong>Total General: $${myTotal}.000</strong><br><br><br><br>`;
    // this.printer.print(this.contenido, this.myoptions)
    //   .then(succes => {
    //     this.limpiar();
    //     this.router.navigateByUrl('/pagina3')
    //   }, error => {
    //     this.toast_mostrar('Hubo un error, intente nuevamente..', 4000, "primary", "top");
    //     this.limpiar();
    //     this.router.navigateByUrl('/home')
    //   });
  }

  btnGral(myvalue: number) {
    this.mys.ventaRuta['totalGeneral'] = myvalue;
    console.log('this.mys.ventaRuta', this.mys.ventaRuta);
    let myData = {
      idServicio: this.mys.ventaRuta.idServicio,
      usuario: this.mys.ventaRuta.rut,
      caratula: this.mys.ventaRuta.caratula,
      latitud: "123123123",
      longitud: "857584123",
      tarifa: myvalue
    };
    this.loading = true;
    this.integrador.VRtransaccion(myData).subscribe((resultado: any) => {
      console.log('resultado', resultado);
      this.loading = false;
      if (resultado.mensaje && resultado.mensaje === 'OK') {
        this.mys.ventaRuta['boleto'] = resultado.boleto;
        this.mys.ventaRuta['fecha'] = resultado.fecha;
        this.mys.ventaRuta['hora'] = resultado.hora;

        console.log('this.mys.ventaRuta', this.mys.ventaRuta);
        this.ImprimirBoleto();

      } else {
        alert('Transacción Rechazada, intente nuevamente,,')

      }


    })

    // this.Imprimir2();
  }



  btnLimpiar() {
    this.totalGeneral = 0;
  }
}



