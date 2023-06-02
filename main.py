def AbstandInfoSenden():
    serial.write_string("<")
    serial.write_string("Start")
    serial.write_string("Sensorabstand ")
    serial.write_number(Abstand)
    serial.write_string("  Millimeter")
    serial.write_string(">")
def Initialisierung():
    global LS_Frei, LS_unterbrochen, Schritt, Abstand
    LS_Frei = 0
    LS_unterbrochen = 1
    Schritt = 0
    pins.digital_write_pin(DigitalPin.P0, 1)
    pins.digital_write_pin(DigitalPin.P8, 1)
    pins.digital_write_pin(DigitalPin.P16, 0)
    Abstand = 10000
    DatenSendenEinstellen()
def BerechneGeschwindigkeit():
    global ZeitDifferenz, Geschw_mm_sec, Geschwindigkeit_km_h
    ZeitDifferenz = EndZeit - StartZeit
    Geschw_mm_sec = Abstand / ZeitDifferenz
    Geschwindigkeit_km_h = Geschw_mm_sec * 36
    Geschwindigkeit_km_h = Math.round(Geschwindigkeit_km_h) / 10
def PruefeLichtschranke2():
    global EndZeit, Schritt
    if pins.digital_read_pin(DigitalPin.P11) == LS_unterbrochen:
        EndZeit = control.millis()
        pins.digital_write_pin(DigitalPin.P16, 0)
        Schritt = 2
def SendeMesswert():
    serial.write_string("<")
    serial.write_string("V=")
    serial.write_number(Geschwindigkeit_km_h)
    serial.write_string(" km/h")
    serial.write_string(">")
def DatenSendenEinstellen():
    serial.redirect(SerialPin.P14, SerialPin.P15, BaudRate.BAUD_RATE19200)
def MessungStarten():
    global StartZeit, Schritt
    if pins.digital_read_pin(DigitalPin.P5) == LS_unterbrochen:
        StartZeit = control.millis()
        pins.digital_write_pin(DigitalPin.P0, 0)
        pins.digital_write_pin(DigitalPin.P1, 1)
        pins.digital_write_pin(DigitalPin.P8, 0)
        pins.digital_write_pin(DigitalPin.P16, 1)
        basic.pause(100)
        Schritt = 1

def Blinker():
    global StartTime, LEDEin
    if control.millis() - StartTime > 500:
        StartTime = control.millis()
        if LEDEin == 0:
            LEDEin = 1
            pins.digital_write_pin(DigitalPin.P8, 1)
            pins.digital_write_pin(DigitalPin.P1, 1)
        else:
            pins.digital_write_pin(DigitalPin.P8, 1)
            pins.digital_write_pin(DigitalPin.P1, 0)
            LEDEin = 0

StartTime = 0
LEDEin = 0

Geschwindigkeit_km_h = 0
Geschw_mm_sec = 0
StartZeit = 0
EndZeit = 0
ZeitDifferenz = 0
Schritt = 0
LS_unterbrochen = 0
LS_Frei = 0
Abstand = 0
Initialisierung()
AbstandInfoSenden()

def on_forever():
    global Schritt
    if Schritt == 0:
        MessungStarten()
    if Schritt == 1:
        PruefeLichtschranke2()
    if Schritt == 2:
        BerechneGeschwindigkeit()
        SendeMesswert()
        Schritt = 0
        basic.show_number(Geschwindigkeit_km_h)
        pins.digital_write_pin(DigitalPin.P1, 0)
        pins.digital_write_pin(DigitalPin.P0, 1)
        pins.digital_write_pin(DigitalPin.P8, 1)
        basic.pause(100)
basic.forever(on_forever)
