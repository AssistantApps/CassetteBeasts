# Data extraction steps

## Unpack `.pck`

Run the following python script from [tehskai](https://github.com/tehskai/godot-unpacker) to get the first step of the unpacked files

```sh
py godot-unpacker.py "E:\Steam\steamapps\common\Cassette Beasts\CassetteBeasts.pck"
```

This will create a folder called `CassetteBeasts_pck` in the location that you ran the above script.

## "Manual" files

Use [Godot RE Tools](https://github.com/bruvzg/gdsdecomp/releases) to convert some necessary files, the following are required at the moment:

- All csv files in `translation`
  - This will create `.txt` files
- All json files in:
  - `sprites/monsters`
  - `sprites/monsters`
  - `sprites/characters/battle`
  - `sprites/monsters/world`
  - Each folder in `sprites/fusions`
  - _A cheaty way to do this easily, is to select all files and let the Godot RE Tools report errors on most of the selected files 😅_
  - This will create `.txt` files
