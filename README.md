# MagicBox

## Module 3 of CPSC 334: Creative Embedded Systems

The MagicBox is a wireless system that communicates to a React Native app via UDP messages over WiFi. The system is interacted with via three sensors: piezoelectric, light, and force resist. These three methods of interation are all contained within an unassuming black box. The user can squeeze the forst resist sensor, cover the ambient light sensor, or tap different parts of the box to trigger responses from the system.

![Closed Box](assets/closed_box.HEIC)

On the software side, the ESP32 receives analog input from each of these sensors, and with power from a 600mah LiPo battery transmits them over a WiFi network. The React Native app (when connected to the MagicBox network) provides the user with a sketch pad. Each of the box's sensors is mapped to a parameter of the drawing: the background color, the stroke weight of the pen, and the stroke color.

### Wiring diagram for the MagicBox

![Wiring Diagram](assets/wiring_diagram.png)

![Open Box](assets/open_box.HEIC)

![Construction](assets/construction.HEIC)




