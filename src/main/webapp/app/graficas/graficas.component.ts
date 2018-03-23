import {Component, OnInit, OnDestroy} from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import {HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Principal } from '../shared';
import { Datos } from '../entities/datos';
import { DatosService } from '../entities/datos';
import { Chart } from 'angular-highcharts';

import { HighchartsMore } from 'highcharts-more';
import * as Highcharts from 'highcharts';
import {RelacionFechaTipodiaService, TipoDia} from '../entities/relacion-fecha-tipodia';
import {IntervaloOfertadoService, IntervaloOfertado} from '../entities/intervalo-ofertado';
import {TablaTrenes, TablaTrenesService} from '../entities/tabla-trenes';

import {ChartDesviacion,
        ChartIntervalo,
        ChartNumeroTrenes,
        ChartTiempoVueltaVelocidad,
        ChartTOC,
        ChartViajerosDensidad} from './charts/chart-Theme';

declare var require: any;
require('highcharts/highcharts-more')(Highcharts);

@Component({
    selector: 'jhi-graficas',
    templateUrl: './graficas.component.html',
    styleUrls: [
        'graficas.css'
    ]
})
export class GraficasComponent implements OnInit, OnDestroy {
    config: any;
    currentAccount: any;
    eventSubscriber: Subscription;

    linea: String;
    datos: Datos[] = [];
    tipo: TipoDia = null;

    date: any;
    desde: any;
    desde2: any;

    chartIntervalo: any;
    chartDesviacion: any;
    chartNumeroTrenes: any;
    chartTiempoVueltaVelocidad: any;
    chartTOC: any;
    chartViajerosDensidad: any;

    viajeros: number[] = [0, 0, 0, 0];
    dataInt: any[] = [];
    dataDes: any[] = [];
    dataVue: any[] = [];
    dataNuT: any[] = [];
    dataVia: any[] = [];
    dataTOC: any[] = [];
    dataDen: any[] = [];
    dataCon: any[] = [];
    dataVel: any[] = [];
    dataCoK: any[] = [];

    dataInO: any[] = [];
    dataInO2: any[] = [];
    dataTaT: any[] = [];
    dataTaT2: any[] = [];

    constructor(
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal,
        private route: ActivatedRoute,
        public datepipe: DatePipe,

        private datosService: DatosService,
        private relacionFechaTipodiaService: RelacionFechaTipodiaService,
        private intervaloOfertadoService: IntervaloOfertadoService,
        private tablaTrenesService: TablaTrenesService,
    ) {
    }

    loadChartIntervalo() {
        this.chartIntervalo = new Chart;
        this.chartIntervalo.options = ChartIntervalo;
        this.chartIntervalo.removeSerie(1);
        this.chartIntervalo.removeSerie(0);

        this.chartIntervalo.addSerie({
            step: 'left',
            name: 'Intervalo Ofertado',
            data: this.dataInO2,
            type: 'arearange',
            lineWidth: 0,
            linkedTo: ':previous',
            fillOpacity: 0.3,
            zIndex: 0,
            marker: {
                enabled: false
            }
        });
        this.chartIntervalo.addSerie({
            name: 'Intervalo medio',
            data: this.dataInt,
            zIndex: 1,
            marker: {
                fillColor: 'grey',
                lineWidth: 2,
            }
        });
    }
    loadChartDesviacion() {
        this.chartDesviacion = new Chart;
        this.chartDesviacion.options = ChartDesviacion;
        this.chartDesviacion.removeSerie(0);
        // this.chartIntervalo.removeSerie(0);

        this.chartDesviacion.addSerie({
            name: 'Desidad',
            data: this.dataDes,
            zIndex: 1,
            marker: {
                fillColor: 'grey',
                lineWidth: 2,
            }
        });
    }
    loadChartNumeroTrenes() {
        this.chartNumeroTrenes = new Chart;
        this.chartNumeroTrenes.options = ChartNumeroTrenes;
        this.chartNumeroTrenes.removeSerie(1);
        this.chartNumeroTrenes.removeSerie(0);

        this.chartNumeroTrenes.addSerie({
            step: 'left',
            name: 'Tabla trenes',
            data: this.dataTaT2,
            type: 'arearange',
            lineWidth: 0,
            linkedTo: ':previous',
            fillOpacity: 0.3,
            zIndex: 0,
            marker: {
                enabled: false
            }
        });
        this.chartNumeroTrenes.addSerie({
            name: 'Tabla trenes',
            data: this.dataNuT,
            zIndex: 1,
            marker: {
                fillColor: 'grey',
                lineWidth: 2,
            }
        });
    }
    loadChartTiempoVueltaVelocidad() {

        this.chartTiempoVueltaVelocidad = new Chart;
        this.chartTiempoVueltaVelocidad.options = ChartTiempoVueltaVelocidad;
        this.chartTiempoVueltaVelocidad.removeSerie(1);
        this.chartTiempoVueltaVelocidad.removeSerie(0);

        this.chartTiempoVueltaVelocidad.addSerie({
            name: 'Tiempo de Vuelta',
            data: this.dataVue,
            zIndex: 1,
            marker: {
                fillColor: 'grey',
                lineWidth: 2,
            }
        });
        this.chartTiempoVueltaVelocidad.addSerie({
            name: 'Velocidad',
            data: this.dataVel,
            zIndex: 1,
            marker: {
                fillColor: 'grey',
                lineWidth: 2,
            }
        });
    }
    loadChartTOC() {
        this.chartTOC = new Chart;
        this.chartTOC.options = ChartTOC;
        this.chartTOC.removeSerie(0);

        this.chartTOC.addSerie({
            name: 'TOC',
            data: this.dataTOC,
            zIndex: 1,
            marker: {
                fillColor: 'grey',
                lineWidth: 2,
            }
        });
    }
    loadChartViajerosDensidad() {

        this.chartViajerosDensidad = new Chart;
        this.chartViajerosDensidad.options = ChartViajerosDensidad;
        this.chartViajerosDensidad.removeSerie(1);
        this.chartViajerosDensidad.removeSerie(0);

        this.chartViajerosDensidad.addSerie({
            name: 'Numero de viajeros',
            data: this.dataVia,
            zIndex: 1,
            marker: {
                fillColor: 'grey',
                lineWidth: 2,
            }
        });
        this.chartViajerosDensidad.addSerie({
            name: 'Densidad',
            data: this.dataDen,
            zIndex: 1,
            marker: {
                fillColor: 'grey',
                lineWidth: 2,
            }
        });
    }

    loadCharts() {
        this.loadChartIntervalo();
        this.loadChartNumeroTrenes();
        this.loadChartTiempoVueltaVelocidad();
        this.loadChartTOC();
        this.loadChartDesviacion();
        this.loadChartViajerosDensidad();
    }

    // -------------------------

    loadSeriesDatos() {

        this.dataInt = [];
        this.dataDes = [];
        this.dataVue = [];
        this.dataNuT = [];
        this.dataVia = [];
        this.dataTOC = [];
        this.dataDen = [];
        this.dataCon = [];
        this.dataVel = [];
        this.dataCoK = [];

        if (this.datos.length > 0) {
            for (let i = 0; i < this.datos.length; i++) {
                this.dataInt.push([this.datos[i].fechaHora.valueOf(), this.datos[i].intervaloMedio]);
                this.dataDes.push([this.datos[i].fechaHora.valueOf(), this.datos[i].desviacionMedia]);
                this.dataVue.push([this.datos[i].fechaHora.valueOf(), this.datos[i].tiempoVuelta]);
                this.dataNuT.push([this.datos[i].fechaHora.valueOf(), this.datos[i].numeroTrenes]);
                this.dataVia.push([this.datos[i].fechaHora.valueOf(), this.datos[i].viajeros]);
                this.dataTOC.push([this.datos[i].fechaHora.valueOf(), this.datos[i].toc]);
                this.dataDen.push([this.datos[i].fechaHora.valueOf(), this.datos[i].densidad]);
                this.dataCon.push([this.datos[i].fechaHora.valueOf(), this.datos[i].consumo]);
                this.dataVel.push([this.datos[i].fechaHora.valueOf(), this.datos[i].velocidad]);
                this.dataCoK.push([this.datos[i].fechaHora.valueOf(), this.datos[i].cocheKm]);
            }
        }
       this.loadCharts();
    }

    ngOnInit() {
        this.desde = new Date();
        this.desde = this.datepipe.transform(this.desde, 'yyyy-MM-dd');
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.eventSubscriber = this.route.params.subscribe((params) => {
            this.linea = (params['id']); });

        this.loadAll();
    }

    loadAll() {
        this.loadDatosFechaLinea();
        this.loadTipodia();
        this.loadViajerosFechaLinea();
        this.loadCharts();
    }

    updatedataTaT(tipodia) {
        this.tablaTrenesService.queryLineaTipoDia(this.linea, tipodia).subscribe(
            (res: HttpResponse<TablaTrenes[]>) => {
                this.dataTaT = res.body;
                this.dataTaT2 = [];
                for (let i = 0; i < this.dataTaT.length; i++) {
                    this.date = this.dataTaT[i].hora;
                    this.desde2 = new Date (this.desde);
                    this.desde2 = Date.UTC(this.desde2.getUTCFullYear(),
                        this.desde2.getUTCMonth(), this.desde2.getUTCDate(),
                        this.date.getUTCHours(), this.date.getUTCMinutes(),
                        this.date.getUTCSeconds());
                    this.dataTaT2.push([this.desde2, 0, this.dataTaT[i].numeroTrenes]);
                }
                this.dataTaT2.sort();
                this.loadCharts();
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    updatedataInO(tipodia) {
        this.intervaloOfertadoService.queryLineaTipoDia(this.linea, tipodia).subscribe(
            (res: HttpResponse<IntervaloOfertado[]>) => {
                this.dataInO = res.body;
                this.dataInO2 = [];
                for (let i = 0; i < this.dataInO.length; i++) {
                    this.date = this.dataInO[i].hora;
                    this.desde2 = new Date (this.desde);
                    this.desde2 = Date.UTC(this.desde2.getUTCFullYear(),
                        this.desde2.getUTCMonth(), this.desde2.getUTCDate(),
                        this.date.getUTCHours(), this.date.getUTCMinutes(),
                        this.date.getUTCSeconds());
                    this.dataInO2.push([this.desde2, this.dataInO[i].intervaloMin, this.dataInO[i].intervaloMax]);
                }
                this.dataInO2.sort();
                this.loadCharts();
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    loadTipodia() {
        this.relacionFechaTipodiaService.queryFechaTipoDia(this.desde).subscribe(
            (resT: HttpResponse<TipoDia>) => {
                if (this.tipo !== resT.body) {
                    this.tipo = resT.body;
                    this.updatedataInO(this.tipo);
                    this.updatedataTaT(this.tipo);
                }
            },
            (res: HttpErrorResponse) => {this.onError(res.message);
            }
        );
    }

    loadDatosFechaLinea() {
        this.datosService.queryFechaLinea(this.desde.toString() + ' 06:00', this.linea).subscribe(
            (res: HttpResponse<Datos[]>) => {
                this.datos = res.body;
                this.loadSeriesDatos();
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    loadViajerosFechaLinea() {
        this.datosService.queryViajerosFechaLinea(this.desde.toString() + ' 06:00', this.linea).subscribe(
            (res: HttpResponse<number[]>) => {
                this.viajeros = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    ngOnDestroy() {
            this.eventSubscriber.unsubscribe();
            this.eventManager.destroy(this.eventSubscriber);
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
