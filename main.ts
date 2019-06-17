/**
 * Blocks for driving the WEMOS I2C Motor Shield
 */
//% weight=100 color=#00A654 icon="\uf1b6" block="Robotics"
//% groups='["Motors", "Settings"]'
namespace WEMOS_Motor_Shield {
    // List of motors for the motor blocks to use.
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
    let i2c_buf = pins.createBuffer(3)
    let i2c_address = Address.Address0x30
    let pwm_resolution = 9 // 0-511
    let pwm_frequency = 15000

    /**
     * Initializes shield with particular I2C address
     * @param address shield I2C address
     */
    //% group=Settings
    //% blockId=wemos_set_address
    //% block="Set Motor Shield I2C address to %address"
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
        i2c_buf[0] = pwm_resolution & 0x0F
        i2c_buf[1] = pwm_frequency>>8
        i2c_buf[2] = pwm_frequency
        pins.i2cWriteBuffer(i2c_address, i2c_buf)
    }
    /**
     * sendCommandSetMotor()
     * Sets the motor's PWM duty cycle / pulse and direction
     * |       0001 |      4 bit |     4 bit |        12 bit |
     * |  set motor |      Motor | Direction |          Step |
     * |       0001 |       0001 |      0001 | 0010 00000000 | -> Set MotorB at step 512
     */
    function sendCommandSetMotor(motor: Motors, direction: number, pwm_value: number) {
        i2c_buf[0] = 0x10 | motor
        i2c_buf[1] = ((direction << 4) | ((pwm_value >> 8) & 0x0F))
        i2c_buf[2] = pwm_value
        pins.i2cWriteBuffer(i2c_address, i2c_buf)
    }


    /**
     * Sets the requested motor running in chosen direction at a set speed.
     * @param motor which motor to turn on
     * @param dir   which direction to go
     * @param speed how fast to spin the motor
     */
    //% group=Motors
    //% blockId=wemos_motor_on
    //% block="Run %motor|%dir|speed %speed"
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
     * Turns off all motors by going into standby mode
     */
    //% group=Motors
    //% blockId=wemos_standby
    //% weight=65 blockGap=8
    //%block="Turn off all motors"
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
    //%block="Turn off %motor"
    export function motorOff(motor: Motors): void {
        if (initalised == false) {
            init(i2c_address)
        }
        sendCommandSetMotor(motor, 5/*COAST*/, 0)
    }

    /**
     * Stops motor immediately by shorting pins
     * @param motor which motor to brake
     */
    //% group=Motors
    //% blockId=wemos_motor_brake
    //% weight=65 blockGap=8
    //%block="Stop %motor"
    export function brakeMotor(motor: Motors): void {
        if (initalised == false) {
            init(i2c_address)
        }
        sendCommandSetMotor(motor, 0/*BRAKE*/, 0)
    }

}