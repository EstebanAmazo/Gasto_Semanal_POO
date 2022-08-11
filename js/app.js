const formulario = document.querySelector('#agregar-gasto');
const seccionGastos = document.querySelector('.primario');
const seccionPresupuesto = document.querySelector('seccion-presupuesto');
const listadoGastos = document.querySelector('.list-group');
const inputPresupuesto = document.querySelector('#presupuesto');
const btnAregarGasto = document.querySelector('.agregar-gasto-btn');
const agregarGastoBtn = document.querySelector('.agregar-gasto-btn');
const campoGasto = document.querySelector('#gasto');
const campoCantidad = document.querySelector('#cantidad');
const campoPresupuesto = document.querySelector('#campo-presupuesto');
const btnPresupuesto = document.querySelector('.presupuesto-btn');
const grupoCampo = document.querySelector('.campo')
let btnEditar;
let presupuestoGlobal;
let campos;

// console.log(presupuesto)





eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', deshabilitarCampos);
    btnAregarGasto.addEventListener('click', agregarGasto);
    formulario.addEventListener('click', agregarPresupuesto);

    //muestra los datos de local storage
    document.addEventListener('DOMContentLoaded', cargarStorage)

}



function cargarStorage() {
    let lsPresupuesto = JSON.parse(localStorage.getItem('gastos')) || {};
        const {presupuesto, restante, gastos} = lsPresupuesto;
        // console.log(lsPresupuesto);



        if(Object.entries(lsPresupuesto).length === 0) {

        } else {
            presupuestoGlobal = new Presupuesto(presupuesto);
            presupuestoGlobal.lsPresupuesto(lsPresupuesto)
            ui.insertarPresupuesto(presupuestoGlobal);
            ui.habilitarGastos();
            ui.btnEditarPresupuesto();
            ui.mostrarGasto(gastos);
            ui.actualizarRestante(restante);
            ui.comprobarPresupuesto(presupuestoGlobal);


            // console.log(presupuestoGlobal)

        }
}
// clases


class Presupuesto {
    constructor(presupuesto) {


        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    lsPresupuesto(presupuestoObj) {
        const {presupuesto, restante, gastos} = presupuestoObj
        this.presupuesto = Number(presupuesto);
        this.restante = Number(restante);
        this.gastos = gastos;
    }

    nuevoGasto(nuevoGasto) {
        this.gastos = [...this.gastos, nuevoGasto];
        this.calcularRestante();
        // sincronizarStorage();
    }

    calcularRestante(){
        const gastado = this.gastos.reduce((total, gasto) => {
            return Number(total + gasto.cantidad)
        }, 0);
        this.restante = this.presupuesto - gastado;
        // console.log(this.restante);



    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter((gasto => gasto.id !== id));
        // console.log(this.gastos);
        this.calcularRestante();

    }
}



// Local Storage

function sincronizarStorage() {
    localStorage.setItem('gastos', JSON.stringify(presupuestoGlobal));

}


class UI {
    insertarPresupuesto(cantidad) {
        const {presupuesto, restante} = cantidad;
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    mostrarAlerta(mensaje, tipo, campos) {


        const alerta = document.createElement('div');
        alerta.textContent = mensaje;
        if(tipo === 'error') {

            alerta.classList.add('text-danger', 'nError')
            campos.classList.add('border', 'border-danger');
            // console.log(alerta)
        } else {

            let alerta2 = document.querySelector('.nError')
            alerta2.remove();
            campos.classList.remove('border', 'border-danger');
        }

        const nError = document.getElementsByClassName('nError')
        if(nError.length === 0) {
            grupoCampo.appendChild(alerta)
        }
    }

    congelarGastos() {


        campoGasto.disabled = true;
        campoCantidad.disabled = true;
        agregarGastoBtn.disabled = true;
        campoGasto.classList.add('cursor-not-alw');
        campoCantidad.classList.add('cursor-not-alw');


    }

    habilitarPresupuesto() {

        btnEditar.remove();
        campoPresupuesto.disabled = false;
        formulario.insertBefore(btnPresupuesto, document.querySelector('.seccion-gastos'));

    }

    btnEditarPresupuesto() {

        btnPresupuesto.remove();
        btnEditar = document.createElement('button');
        btnEditar.classList.add('btn', 'btn-info' ,'boton');
        btnEditar.textContent = 'Editar';
        btnEditar.onclick = () => {
            this.congelarGastos();
            cargarEdicion(presupuestoGlobal);

        };
        formulario.insertBefore(btnEditar, document.querySelector('.seccion-gastos'));
    }

    habilitarGastos() {

        // btnPresupuesto.disabled = true;
        campoPresupuesto.disabled = true;
        campoGasto.disabled = false;
        campoCantidad.disabled = false;
        agregarGastoBtn.disabled = false;
        campoGasto.classList.remove('cursor-not-alw');
        campoCantidad.classList.remove('cursor-not-alw');

    }
    mostrarGasto(gastos) {
        this.limpiarHTML();
        gastos.forEach((gasto) => {
            const nuevoGasto = document.createElement('li')
            const {nombre, cantidad, id} = gasto;
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.innerHTML = `${nombre} <span class='badge badge-primary badge-pill'> $ ${cantidad} </span>`;

            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.textContent = 'Borrar x';

            listadoGastos.appendChild(nuevoGasto);
            nuevoGasto.appendChild(btnBorrar);

            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }

        })

    }


    limpiarHTML() {
        while(listadoGastos.firstChild) {
            listadoGastos.removeChild(listadoGastos.firstChild);
        }
    }

    actualizarRestante(restante) {

        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj) {
        const {presupuesto, restante} = presupuestoObj;
        const divRestante = document.querySelector('.restante');
        if(restante < (presupuesto / 4)) {
            divRestante.classList.remove('alert-success', 'alert-warning');
            divRestante.classList.add('alert-danger');
        } else if (restante < (presupuesto / 2)){
            divRestante.classList.remove('alert-success');
            divRestante.classList.add('alert-warning');
        } else {
            divRestante.classList.remove('alert-danger', 'alert-warning');
            divRestante.classList.add('alert-success');
        }

        if(restante <= 0) {
            ui.mostrarAlerta('Presupuesto agotado', 'error');
            ui.congelarGastos();


        }


    }

};

const ui = new UI();




// funciones

function deshabilitarCampos() {



    campoGasto.disabled = true;
    campoCantidad.disabled = true;
    agregarGastoBtn.disabled = true;
}



function agregarPresupuesto(e) {
    e.preventDefault();
    if(e.target.classList.contains('presupuesto-btn')) {

        const presupuestoUsuario = Number(document.querySelector('#campo-presupuesto').value);
        campos = document.getElementById('campo-presupuesto');

        if(presupuestoUsuario  <= 0 || isNaN(presupuestoUsuario) || presupuestoUsuario === '') {


            ui.mostrarAlerta('Presupuesto no valido', 'error', campos);


            return;
        } else {
            if(campos.classList.contains('border-danger')){
                ui.mostrarAlerta(null, null, campos)
            }
        }

        // presupuesto valido
        presupuestoGlobal = new Presupuesto(presupuestoUsuario);
        ui.congelarGastos();
        ui.btnEditarPresupuesto();
        ui.insertarPresupuesto(presupuestoGlobal);
        ui.habilitarGastos();
        sincronizarStorage();





    }
}

function agregarGasto(e) {
    e.preventDefault();


        const nombre = document.querySelector('#gasto').value;
        const cantidad = Number(document.querySelector('#cantidad').value);
        campos = document.getElementById('gasto');
        console.log(e.target)




        if (nombre === '' || cantidad === '') {
            ui.mostrarAlerta('Este campo es requerido', 'error', campos)

            return;
        } else if (isNaN(cantidad) || cantidad <= 0) {
            ui.mostrarAlerta('Cantidad no valida', 'error', campos);
            return;
        }

        const nuevoGasto = {nombre, cantidad, id: Date.now()};
        presupuestoGlobal.nuevoGasto(nuevoGasto);


        const {gastos, restante} = presupuestoGlobal;
        ui.actualizarRestante(restante);
        ui.mostrarGasto(gastos);
        ui.comprobarPresupuesto(presupuestoGlobal);
        sincronizarStorage();



        formulario.reset();



}



function eliminarGasto(id){
    presupuestoGlobal.eliminarGasto(id);

    const {gastos, restante} = presupuestoGlobal;
    ui.mostrarGasto(gastos);

    // console.log(restante)

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuestoGlobal);

    sincronizarStorage();

}

// carga los datos del presupuesto

function cargarEdicion(presupuestoObj) {
    const {presupuesto} = presupuestoObj;
    // habilitar el input del presupuesto
    ui.habilitarPresupuesto();

    // llenar el input del presupuesto

    campoPresupuesto.value = presupuesto;

}

