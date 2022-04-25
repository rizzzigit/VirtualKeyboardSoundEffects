# VirtualKeyboardSoundEffects
Plays virtual keypress sounds in your computer.

## Getting started
  Run the following command:
  ```shell
  $ npx github:rizzzigit/VirtualKeyboardSoundEffects
  ```
### **Important**

It only works if...
* It has access to `/dev/input`

  **Warning**: Normal users should not have access to input devices as it will give user-space applications the ability to write to those. You can run this as root or just do all of this in a virtual machine.

* `alsa-utils` is installed on your system.
