function AbstandInfoSenden () {
    serial.writeString("<")
    serial.writeString("Start")
    serial.writeString("Sensorabstand ")
    serial.writeNumber(Abstand)
    serial.writeString("  Millimeter")
    serial.writeString(">")
}
function Initialisierung () {
    BlinkZeit = 100
    LS_Frei = 0
    LS_unterbrochen = 1
    Schritt = 0
    pins.digitalWritePin(DigitalPin.P0, 1)
    pins.digitalWritePin(DigitalPin.P1, 0)
    pins.digitalWritePin(DigitalPin.P8, 1)
    pins.digitalWritePin(DigitalPin.P16, 0)
    Abstand = 2000
    DatenSendenEinstellen()
}
function BerechneGeschwindigkeit () {
    ZeitDifferenz = EndZeit - StartZeit
    Geschw_mm_sec = Abstand / ZeitDifferenz
    Geschwindigkeit_km_h = Geschw_mm_sec * 36
    Geschwindigkeit_km_h = Math.round(Geschwindigkeit_km_h) / 10
}
function PruefeLichtschranke2 () {
    if (pins.digitalReadPin(DigitalPin.P11) == LS_unterbrochen) {
        EndZeit = control.millis()
        pins.digitalWritePin(DigitalPin.P16, 0)
        Schritt = 2
    }
}
function SendeMesswert () {
    serial.writeString("<")
    serial.writeString("V=")
    serial.writeNumber(Geschwindigkeit_km_h)
    serial.writeString(" km/h")
    serial.writeString(">")
}
function DatenSendenEinstellen () {
    serial.redirect(
    SerialPin.P14,
    SerialPin.P15,
    BaudRate.BaudRate19200
    )
}
function GeschwindigkeitMessen () {
    if (Schritt == 0) {
        MessungStarten()
    }
    if (Schritt == 1) {
        PruefeLichtschranke2()
    }
    if (Schritt == 2) {
        BerechneGeschwindigkeit()
        SendeMesswert()
        Schritt = 0
        pins.digitalWritePin(DigitalPin.P1, 0)
        pins.digitalWritePin(DigitalPin.P0, 1)
        pins.digitalWritePin(DigitalPin.P8, 1)
        basic.pause(100)
    }
}
function Blinker () {
    if (control.millis() - StartTime > BlinkZeit) {
        StartTime = control.millis()
        if (LEDEin == 0) {
            BlinkZeit = 200
            LEDEin = 1
            pins.digitalWritePin(DigitalPin.P0, 1)
            pins.digitalWritePin(DigitalPin.P1, 1)
            pins.digitalWritePin(DigitalPin.P8, 1)
            pins.digitalWritePin(DigitalPin.P16, 1)
        } else {
            BlinkZeit = 800
            pins.digitalWritePin(DigitalPin.P0, 0)
            pins.digitalWritePin(DigitalPin.P1, 0)
            pins.digitalWritePin(DigitalPin.P8, 0)
            pins.digitalWritePin(DigitalPin.P16, 0)
            LEDEin = 0
        }
    }
}
function MessungStarten () {
    if (pins.digitalReadPin(DigitalPin.P5) == LS_unterbrochen) {
        StartZeit = control.millis()
        pins.digitalWritePin(DigitalPin.P0, 0)
        pins.digitalWritePin(DigitalPin.P1, 1)
        pins.digitalWritePin(DigitalPin.P8, 0)
        pins.digitalWritePin(DigitalPin.P16, 1)
        basic.pause(100)
        Schritt = 1
    }
}
let LEDEin = 0
let StartTime = 0
let Geschwindigkeit_km_h = 0
let Geschw_mm_sec = 0
let StartZeit = 0
let EndZeit = 0
let ZeitDifferenz = 0
let Schritt = 0
let LS_unterbrochen = 0
let LS_Frei = 0
let BlinkZeit = 0
let Abstand = 0
Initialisierung()
AbstandInfoSenden()
basic.forever(function () {
    // Schalter zum Umschalten zwischen Einstellmodus mit blinkenden Lichtschranken
    // und
    // Geschwindigkeitsmessung
    if (pins.digitalReadPin(DigitalPin.P2) == 1) {
        Blinker()
    } else {
        GeschwindigkeitMessen()
    }
})
