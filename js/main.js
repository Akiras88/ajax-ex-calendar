/**
 * WELCOME TO MOMENT JS
 */
$(document).ready(function () {
    
    /**
     * SETUP
     */

    // Punto di partenza
    var baseMonth = moment('2018-01-01'); 
    var addMonth = $('.switch i:last-child');
    var subtractMonth = $('.switch i:first-child');

    // Init Handlenars
    var source = $('#day-template').html();
    var template = Handlebars.compile(source);
    
    // print giorno
    printMonth(template, baseMonth);

    // ottieni festività mese corrente
    printHoliday(baseMonth);

    // add or subtract month and holiday to push
    monthNext(baseMonth, addMonth, template);
    monthPrev(baseMonth, subtractMonth, template);


}); // <-- End doc ready


/*************************************
    FUNCTIONS
 *************************************/

// Stampa a schermo i giorni del mese
function printMonth(template, date) {
    // numero giorni nel mese
    var daysInMonth = date.daysInMonth();

    //  setta header
    $('h1').html( date.format('MMMM YYYY') );

    // Imposta data attribute data visualizzata
    $('.month').attr('data-this-date',  date.format('YYYY-MM-DD'));

    // genera giorni mese
    for (var i = 0; i < daysInMonth; i++) {
        // genera data con moment js
        var thisDate = moment({
            year: date.year(),
            month: date.month(),
            day: i + 1
        });

        // imposta dati template
        var context = {
            class: 'day',
            day: thisDate.format('DD MMMM'),
            completeDate: thisDate.format('YYYY-MM-DD')
        };

        //compilare e aggiungere template
        var html = template(context);
        $('.month-list').append(html);
    }
}

// Ottieni e stampa festività
function printHoliday(date) {
    // chiamo API
    $.ajax({
        url: 'https://flynn.boolean.careers/exercises/api/holidays' ,
        method: 'GET',
        data: {
            year: date.year(),
            month: date.month()
        },
        success: function(res) {
            var holidays = res.response;

            for (var i = 0; i < holidays.length; i++) {
                var thisHoliday = holidays[i];

                var listItem = $('li[data-complete-date="' + thisHoliday.date + '"]');

                if(listItem) {
                    listItem.addClass('holiday');
                    listItem.text( listItem.text() + ' - ' + thisHoliday.name );
                }
            }
        },
        error: function() {
            console.log('Errore chiamata festività'); 
        }
    });
}
// funtions to change month
function monthNext(baseMonth, addMonth, template) {
    addMonth.on('click', function() {
        var nextMonth = baseMonth.add(1 , 'M');
        
        if ( nextMonth.year() > 2018 ) {
            alert('Anno non disponibile');
        } else {
            $('.month-list').html('');
            printMonth(template, nextMonth);
            printHoliday(nextMonth);
        }
    });
}
function monthPrev(baseMonth, subtractMonth, template) {
    subtractMonth.on('click', function(){
        var prevMonth = baseMonth.subtract(1 , 'M');

        if ( prevMonth.year() < 2018 ) {
            alert('Anno non disponibile');
        } else {
            $('.month-list').html('');
            printMonth(template, prevMonth);
            printHoliday(prevMonth);
        }
    });
}