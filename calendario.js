$(function() {
    $('#confirmarReserva').on('click', function() {
        // Busca el td con clase .current (el día seleccionado)
        const $selectedTd = $('#calendar').find('td.day.current');
        let selectedDate = null;
        if ($selectedTd.length > 0) {
            // Tomar el día, mes y año del calendario
            const day = parseInt($selectedTd.text());
            const $header = $('#calendar').find('.calendar-header .calendar-title').first();
            let month, year;
            if ($header.length) {
                const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
                const parts = $header.text().trim().split(' ');
                month = meses.indexOf(parts[0].toLowerCase());
                year = parseInt(parts[1]);
                if (month !== -1 && !isNaN(year) && !isNaN(day)) {
                    selectedDate = new Date(year, month, day);
                }
            }
        }

        // Sin validaciones: si hay selección, muestra el modal
        let fechaTexto = selectedDate ? selectedDate.toLocaleDateString('es-ES') : "Sin selección";
        let hours = [];
        for(let h=8; h<=16; h++) {
            hours.push((h < 10 ? "0" : "") + h + ":00");
        }
        let hourButtons = hours.map(h => 
            `<button class="button bg-white fg-red bd-red hour-btn" data-hour="${h}">${h}</button>`
        ).join('');
        Swal.fire({
            title: `Reservar para el<br><span class="fg-red">${fechaTexto}</span>`,
            html: `<div class="modal-hours d-flex flex-wrap justify-center">${hourButtons}</div>`,
            showConfirmButton: false,
            showCloseButton: true,
            customClass: {
                popup: 'p-4'
            },
            didOpen: () => {
                document.querySelectorAll('.hour-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        let hour = this.getAttribute('data-hour');
                        Swal.fire({
                            icon: 'success',
                            title: '¡Reserva realizada!',
                            html: `<span class="fg-red">${fechaTexto}</span> a las <b>${hour}</b>`,
                            confirmButtonColor: '#ff3c3c'
                        });
                    });
                });
            }
        });
    });
});