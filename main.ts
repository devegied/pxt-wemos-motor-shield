/**
 * Blocks for driving the WEMOS I2C Motor Shield
 */
//% weight=100 color=#00A654 icon="\uf1b6" block="Robotics"
//% groups='["Motors", "Settings"]'
namespace WEMOS_Motor_Shield {
    //Constants 
    let PRESCALE_REG = 0xFE //the prescale register address
    let MODE_1_REG = 0x00  //The mode 1 register address
    let StepperPause = 20 //initally set the pause at 20mS
    // List of motors for the motor blocks to use. These represent register offsets in the PCA9865 driver IC.
    export enum Motors {
        //% block="Motor A"
        MotorA = 0,
        //% block="Motor B"
        MotorB = 1
    }

    // Directions the motors can rotate.
    export enum MotorDirection {
        //% block="Forward"
        Forward = 2,
        //% block="Reverse"
        Reverse = 1
    }

    // Shield I2C address
    export enum Address {
        //% block="0x30"
        Address0x30 = 48,
        //% block="0x2F"
        Address0x2F = 47,
        //% block="0x2E"
        Address0x2E = 46,
        //% block="0x2D"
        Address0x2D = 45
    }

    let initalised = false
    let i2c_address = Address.Address0x30
    let pwm_resolution = 9 // 0-511
    let pwm_frequency = 15000

    /**
     * Initializes shield with particular I2C address
     * @param address shield I2C address
     */
    //% group=Settings
    //% blockId=wemos_set_address
    //% block="set shield address to %address"
    //% weight=50 blockGap=8
    export function init(address: Address): void {
        if (initalised == false) {
            i2c_address = address
            sendCommandConfigurePWM()
            initalised = true
        }
    }

    /**
     * sendCommandConfigurePWM()
     * Sets the MotorShield's PWM resolution and frequency
     * |  4 bit CMD |      4 bit |                    16 bit |
     * | config pwm | Resolution |             PWM Frequency |
     * |       0000 |       1010 |         00010011 10001000 | -> Set 10 bit resolution = 1024 steps and 5KHz Frequency
     */
    function sendCommandConfigurePWM() {
        /*
        //function i2cWriteBuffer(address: int32, buf: Buffer, repeat?: boolean): int32;
        let buf = pins.createBuffer(3)
        buf[0] = pwm_resolution & 0x0F
        buf[1] = pwm_frequency>>8
        buf[2] = pwm_frequency
        pins.i2cWriteBuffer(address, buf, false)
        **/
        //function i2cWriteNumber(address: number, value: number, format: NumberFormat, repeated?: boolean): void;
        pins.i2cWriteNumber(i2c_address, pwm_resolution & 0x0F, NumberFormat.UInt8BE, true)
        pins.i2cWriteNumber(i2c_address, pwm_frequency, NumberFormat.UInt16BE, false)
    }
    /**
     * sendCommandSetMotor()
     * Sets the motor's PWM duty cycle / pulse and direction
     * |       0001 |      4 bit |     4 bit |        12 bit |
     * |  set motor |      Motor | Direction |          Step |
     * |       0001 |       0001 |      0001 | 0010 00000000 | -> Set MotorB at step 512
     */
    function sendCommandSetMotor(motor: Motors, direction: number, pwm_value: number) {
        /*
        Wire.beginTransmission(_address);
        Wire.write((byte)_motor | (byte)0x10);
        Wire.write((byte)(direction << 4) | ((byte)(pwm_value >> 8) & (byte)0x0F));
        Wire.write((byte)pwm_value);
        Wire.endTransmission(true);
        */
        pins.i2cWriteNumber(i2c_address, 0x10 | motor, NumberFormat.UInt8BE, true)
        pins.i2cWriteNumber(i2c_address, (direction << 12) | pwm_value, NumberFormat.UInt16BE, false)
    }


    /**
     * Sets the requested motor running in chosen direction at a set speed.
     * @param motor which motor to turn on
     * @param dir   which direction to go
     * @param speed how fast to spin the motor
     */
    //% group=Motors
    //% blockId=wemos_motor_on
    //% block="%motor|on direction %dir|speed %speed"
    //% weight=100 blockGap=8
    //% speed.min=0 speed.max=100
    export function motorOn(motor: Motors, dir: MotorDirection, speed: number): void {
        if (initalised == false) {
            init(i2c_address)
        }
        /*convert 0-100 to 0-512*/
        let outputVal = pins.map(speed, 0, 100, 0, 512)
        outputVal = Math.round(outputVal)
        sendCommandSetMotor(motor, dir, outputVal)
    }

    /**
     * Turns off all motors
     */
    //% group=Motors
    //% blockId=wemos_standby
    //% weight=65 blockGap=8
    //%block="turn off all motors"
    export function allOff(): void {
        if (initalised == false) {
            init(i2c_address)
        }
        sendCommandSetMotor(Motors.MotorA, 4/*STANDBY*/, 0)
    }

    /**
     * Lets the motor to stop smoothly
     * @param motor which motor to turn off
     */
    //% group=Motors
    //% blockId=wemos_motor_off
    //% weight=65 blockGap=8
    //%block="turn off %motor"
    export function motorOff(motor: Motors): void {
        if (initalised == false) {
            init(i2c_address)
        }
        sendCommandSetMotor(motor, 5/*COAST*/, 0)
    }

    /**
     * Stops motor immediately
     * @param motor which motor to brake
     */
    //% group=Motors
    //% blockId=wemos_motor_brake
    //% weight=65 blockGap=8
    //%block="turn off %motor"
    export function brakeMotor(motor: Motors): void {
        if (initalised == false) {
            init(i2c_address)
        }
        sendCommandSetMotor(motor, 0/*BRAKE*/, 0)
    }

}