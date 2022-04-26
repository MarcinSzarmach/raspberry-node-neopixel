# Raspberry-node-neopixel

Let’s create project in Node.js on Raspi. First at all we need to write system to sd card.

Here some manual https://projects.raspberrypi.org/en/projects/raspberry-pi-setting-up/2

After that lets put sd card to Raspberry and connect hdmi cable to monitor, and connect keyboard and mouse to USB port. 

Now we can power up Raspi and gave a some minutes to initialize system. 

Now we should see that picture: 


That means our Raspberry is ready to work. We should go throw this installation process, connect to wifi, set up administration password etc.

After that lets click to Raspi logo in top left corner, next Preferences => Raspberry Pi Configuration. In tab “Interface” we need to enable “SSH” option, and save.

Now we need to know what is ip address of our device. We can check that on our router settings or in Raspberry. 

To get ip address on raspberry let’s open command line and type “hostname -I”, then we should see:


Now we can log in to our Raspberry from our computer or we can type all command direct on Raspberry (if You want that go to point Installing Node).

Now on our computer, connected to the same network as Raspberry we need to create a ssh connection. Tutorial for other systems: https://www.howtogeek.com/311287/how-to-connect-to-an-ssh-server-from-windows-macos-or-linux/
 
Open terminal and type 

```“ssh pi@<<your_ip_address>>” ```

in my case its

```“ssh pi@192.168.32.144”```

After typed administrator password we should see something like that:


Whatever we typed now in this terminal will execute on our Raspi. 

Installation of Node.js
We will be using version 10.24 of Node.js because library used in project “node-rpi-ws281x-native” has a problems in newer version of Node.js.

In next step we should type:

```“wget https://nodejs.org/dist/latest-v10.x/node-v10.24.1-linux-armv7l.tar.gz”```

now, we downloading a node js to our Raspi, then we need copy our Node.js file to proper folder to: 

```“sudo cp -R node-v10.24.1-linux-armv7l/* /usr/local/”```

If everything goes well we can check if Node.js was installed correctly by command:
scr

```“node -v”```

We should see version of Node.js:


Now let’s download our repo from GitHub. First create folder on Desktop by command: 

```“cd Desktop/ && mkdir app && cd app”```

and we need to download our repo by:

```“git clone https://git.stxnext.pl/marcin.szarmach/raspberry-node-neopixel .”```

We need to install dependencies: 

```“sudo npm i”```

After that our project its ready, now we need to connect WS2812 leds to our raspberry:



Blue cable is connected to 18 pin of GPIO on Raspberry board, red cable is Vcc 5V, and black is GND.

After proper connect leds to Raspi we can start our project with command:
sudo node app.js
And now You can go on Your computer and type in browser ip addres of raspberry pi:

You should see result like on video:
https://www.youtube.com/watch?v=xbbQI-sd80Y


Let’s open app.js file, we have there:

```
const gpio = 18

const channels = ws2821x.init({
    dma: 10,
    freq: 800000,
    channels: [
        { count: 62, gpio, invert: false, brightness: 100, stripType: 'ws2812' },
    ]
});
```
gpio is a pin number connected to the Raspberry.

```
const channels = ws2821x.init({
    dma: 10,
    freq: 800000,
    channels: [
        { count: 62, gpio, invert: false, brightness: 100, stripType: 'ws2812' },
    ]
});
```

Here we have a number of our leds on strip. In my case is 62.

Brightness is used to dimmer out diodes.

In some case when Your leds is connected properly but doesn't light proper color, try to disable audio, open ssh with raspi and type:

sudo nano /boot/config.txt

and found line:
```
# Enable audio (loads snd_bcm2835)
dtparam=audio=on
```
and you should comment dtparam so it needs to look like that:
```
# Enable audio (loads snd_bcm2835)
# dtparam=audio=on
```
then save the file and reboot Your Raspberry. Now leds strip should work.
