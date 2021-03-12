# cbb-led-matrix
#### Display college basketball scores on a raspberry pi led matrix
![image of scoreboard](https://i.imgur.com/tBaEwND.jpg)
## Introduction
RPis are awesomes and you might already have one laying around that you looking for a project for. In the spirit of March I've put together a little project to utilize the power of a RaspberryPi and some LED Matrices of being able to display live and upcoming games with scores for college basketball. It can also easily be modified for college football which I will post a seperate repository for come Fall 2021.

I personally chose to use NodeJS as it's what I'm more comfortable with, but many scoreboard projects like the amazing [NHL LED Scoreboard](https://github.com/riffnshred/nhl-led-scoreboard) use Python and can serve as a great reference if you want to remake this. Each person has different needs and desires. My first attempt at this project used software that simply mirrored an HDMI output from the PI, using a forced resoultion and a chromium kiosk mode web page. I've since changed to a new version (this one) that instead uses a [PixelPusher](https://github.com/hzeller/pixelpusher-server) server that I can send a node-canvas to from any device on my network which makes it easier for me to change what content I want as I use my display for other projects when sports are out of season. 

If you choose to embark on this project, don't blame me if it fails or if the data sources stop working as I'm just a person who likes to program as a hobby in my freetime.

### Things Used
- Raspberry Pi (I've tested on both 3B+ and 4)
- 64x32 LED Matrix (x2)
- Adafruit RGB Matrix Hat
- Soldering Iron & Solder
- Power Supply (5V 8 Amps)
- MicroSD or USB Drive
- 3D Printer (Helpful for the enclosure but not neccessary)
- Active internet connection (wired or wifi)


## Setup
#### Hardware
Once you have all your parts secured I recommend following [this](https://learn.adafruit.com/adafruit-rgb-matrix-plus-real-time-clock-hat-for-raspberry-pi/overview) great tutorial from Adafruit for building and soldering your Matrix Hat. There are many guides on setting up a RaspberryPi for for the first time. I recommend using RaspberryOS Lite because you will not need a GUI and it will hog resources that may impact your performance. Another thing I recommend is setting up SSH so that you can remotely login to your pi and shut it down from other computers or phone apps like [Terminus](https://termius.com/). Once you have your Pi all set up, it wouldn't hurt to try some of the examples from the [rpi-rgb-led-matrix](https://github.com/hzeller/rpi-rgb-led-matrix) from hzeller that is the lifeblood of this project which there are several tutorials for. This will give you a feel for your display and it's capabilities and settings that work best for you.

#### Software
When you are all setup and have some example work under your belt, the next step to take is to install the PixelPusher server [(using James Warner's fork)](https://jmswrnr.com/) on your pi using:
```
apt get install git make build-essential

git clone --recursive https://github.com/jmswrnr/rpi-matrix-pixelpusher.git
cd rpi-matrix-pixelpusher

make
```

Once you have your files setup you con you can then start your server which will be able to receive data from other devices on your network. To start the server you can use something like the code below. Note that each person might have different needs and settings but this is what works best for me. If you want to connect to ethernet you'll need to change the wlan to lan. You can also set this up as a bash command to run on your pi's startup so you can set it and forget it.

```
sudo ./pixel-push \
  -i wlan0 \
  -u 65507 \
  --led-rows=32 \
  --led-cols=64 \
  --led-parallel=1 \
  --led-chain=2 \
  --led-slowdown-gpio=2 \
  --led-gpio-mapping=adafruit-hat-pwm \
  --led-brightness=50 \
  --led-pwm-bits=11
```
If all is well then you should see that PixelPusher discovery has begun broadcasting to a port which is where the fun can begin. You can set your pi and matrices aside and move to a device like a desktop or laptop that you want to control from. Download this repo to that device and make sure you have NodeJS installed on your machine. I've tested on v13 and v15 without issues. Navigate to where you downloaded this project in a command line or terminal. You'll need to install the necessary node_modules for the project. To do this use terminal or command prompt to navigate to your downloaded file directory and run `npm install`. The required packages should download, be patient if there's some delay on the node-canvas module.

Once all the modules are installed, ***manually installing the included font to your system*** as I was having problems getting the canvas to import the font correctly.

With the font installed and modules in place you should now be good to go! Run  `node ncaabb.js` and it should start. Note that there is an initial 5 second delay that I left in to give the assets time to load.

## Misc

### Where the data comes from
There are several ways to obtain the data that drives a scoreboard such as this. You can scrape data, or look at the XHR requests for json at almost any sports site (CBS, FOX Sports, ESPN, NCAA). I personally opted to use [this](https://gist.github.com/akeaswaran/b48b02f1c94f873c6655e7129910fc3b) as a reference ***but*** this is
- unreliable
- could be taken down
- changed at any time rendering your scoreboard code useless.

You can use this to manipulate the data to your liking by changing the fetch URL and the guide above. For example if you wanted a future or past date, a specific team, a specific conference, etc you can append the url request.

I have set my repo to only request every couple minutes as to not cause a burden on their servers. Overrequesting could cause your IP to get banned.

### Changing/Making new icons
I'm constantly changing icons to my personal preference. If you want to change your schools icon you can replace the .bmp in the /img folder. You'll notice that the icons are all very dark. That's intential due to the way LEDs render color. My advice is to first design and save your 36x32 icon as normal, and then run a protomatter_dither python script on it as described in [this](https://learn.adafruit.com/image-correction-for-rgb-led-matrices?view=all) article to make it appear more vibrant on the LED display.

### Future releases
I currently have a news ticker, as well as a Top 25 rankings in the works. The best part about this project is that if you are familiar to drawing to Canvas you can basically make whatever you like!
